import axios from "axios"
import { beforeAll, describe, expect, it, assert } from "vitest"
import { AwsConnection } from "../utility/AwsConnection"
import { ApiBase } from "../utility/ApiBase"
import { AuthToken } from "../utility/AuthToken"
import sum from "../src/sum"
import fs from 'fs';

describe('AWS Connection Test', () => {

    it.skip('Test AWS Connection', async () => {
        const awsConnection = new AwsConnection();
        await awsConnection.getListOfAPIFromApiGateway();
        await awsConnection.getCustomDomainName();
        const customDomainName = await awsConnection.getSpecficCustomDomainName("qa-notification","api.notification.qa.hyatt.global");
        console.log(customDomainName);
        const data = await awsConnection.getCloudWatch("/aws/api-gateway/notification-qa");
        console.log(data)
        await awsConnection.listDynamoDB().then((items) => console.log(items)).catch((err) => console.error(err));
        await awsConnection.queryDynamoDB().then((items) => console.log(items)).catch((err) => console.error(err));
    })

    it.skip('Test API Testing', async () => {
        const response = await axios.get('https://go.qa.hyatt.global/link/v2/imw5vof8p3W7DsKhW9XdTnMryhl-NSQg');
        assert.equal(response.status, 200);
        console.log(response.data)
    })

    it.skip('Test API tesitng with Authentication', async () => {
        const environment = 'qa'
        const ANALYTICS_BASEURL = `https://api.analytics.${environment}.hyatt.global`;
        const HCOM_BASEURL = `https://api.hcom.${environment}.hyatt.global/`

        const apiBase = new ApiBase();
        await apiBase.GetApi({url: ANALYTICS_BASEURL + '/email/stats/by-action',});
        const payloadFilePath = './src/payload/hcom-v1-activity.json'
        const payloadVariables = {
            memberId: 'aliqua-in-sint',
            adobeId: 'labore-adipisicing-officia-amet-cupidatat',
            userAgent: 'iOS',
            version: 'v0.1',
            channel: 'web',
            hpesrId: 'tempor-dolor-cillum-sint',
            eventType: 'view',
            pageId: 'commodo',
            lang: 'es-ES'
          };


          await apiBase.PostApi({
            url: HCOM_BASEURL + '/v1/activity',
            payloadFileName: payloadFilePath,
            variables: payloadVariables
        });
    })

    it.skip('Generate Auth Token', async () => {
               var url = 'https://hyatt-non-prod-int.apigee.net/oauth-compliant/client_credential/accesstoken?grant_type=client_credentials' 
          
            var postOptions = {
              'method': 'POST',
              'headers': {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'grant_type':'client_credentials',
                'Authorization' : 'client_id:tOAIAfUBNl1agVv0XGhGmWt7YoFEXC5g, client_secret:Vsm5mJSAKg57mSl3'
              },
              'redirect': 'follow'
            };
        //    var authToken = UrlFetchApp.fetch(url, postOptions);
          
    })

    it('Activity API', async () => {
        const apiBase = new ApiBase();
        const authToken = new AuthToken();
        const [client_id, client_secret] = await authToken.secretManager();
        const token = await apiBase.generateAccessToken(client_id,client_secret);
        console.log(token);

        const requestBody = {
            guest: {
              memberId: 'aliqua-in-sint',
              adobeId: 'labore-adipisicing-officia-amet-cupidatat'
            },
            session: {
              userAgent: 'iOS',
              version: 'v0.1'
            },
            channel: 'web',
            hpesrId: 'tempor-dolor-cillum-sint',
            eventType: 'view',
            pageId: 'commodo',
            lang: 'es-ES'
          };
          const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'text/plain'
          };
      
          const response = await axios.post('https://hyatt-non-prod-int.apigee.net/hpe/v1/activity', requestBody, { headers });

          console.log(response.status);
      
          if (response.status < 200 || response.status >= 300) {
            throw new Error(`Unexpected status code: ${response.status}`);
          }
    })

})