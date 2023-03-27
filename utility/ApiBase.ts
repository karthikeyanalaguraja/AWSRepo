import axios from 'axios';
import AWS from 'aws-sdk';
import aws4Interceptor from 'aws4-axios';
import fs from 'fs';
import path from 'path';

const credentials = new AWS.SharedIniFileCredentials({ profile: 'qa_ro' });

const credentiallsNew = {
  accessKeyId: credentials.accessKeyId,
  secretAccessKey: credentials.secretAccessKey,
  sessionToken: credentials.sessionToken,
};

const v4Interceptor = aws4Interceptor(
  {
    region: 'us-east-2',
    service: 'execute-api',
  },
  credentiallsNew
);

export class ApiBase {

    async replacePlaceholders(payload, variables){
        let replacedPayload = payload;
        for (const [key, value] of Object.entries(variables)) {
          const placeholder = `{{${key}}}`;
          replacedPayload = replacedPayload.replace(new RegExp(placeholder, 'g'), value);
        }
        return replacedPayload;
    }

    async placeHolder (str, variables) {
        return str.replace(/{{(.*?)}}/g, (_, key) => variables[key]);
     }

    async GetApi ({ url }) {
        try {      
            axios.interceptors.request.use(v4Interceptor);
            const data = await axios.get(url);
            console.log(data);
          } catch (err) {
            console.log('error', err.response.config.headers);
            console.log('error', err.response.data);
          }
    }

    async PostApi ({ url, payloadFileName, variables}) {
        try {   
            const payload = fs.readFileSync(path.join(payloadFileName), 'utf-8');   
            // const replacedPayload = await this.replacePlaceholders(payload, variables);
            const replacedPayload = JSON.parse(await this.placeHolder(JSON.stringify(payloadFileName), variables));
            axios.interceptors.request.use(v4Interceptor);
            const response = await axios.post(url, replacedPayload);
            console.log(response.data);
          } catch (err) {
            console.log('error', err.response.config.headers);
            console.log('error', err.response.data);
          }
    }

    async generateAccessToken (client_id, client_secret) {
        const accessTokenUrl = 'https://hyatt-non-prod-int.apigee.net/oauth-compliant/client_credential/accesstoken?grant_type=client_credentials';
        const clientId = client_id;
        const clientSecret = client_secret;

        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);

        const response = await axios.post(accessTokenUrl, params);
        if (response.status !== 200) {
            throw new Error(`Failed to generate access token. Status code: ${response.status}`);
        }

        const { access_token } = response.data;

        if (!access_token) {
            throw new Error(`Access token not found in response data.`);
        }
        
        return access_token;
    }

}
