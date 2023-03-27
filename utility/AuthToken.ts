import { Config, SecretsManager , SharedIniFileCredentials} from 'aws-sdk';
import AWS from 'aws-sdk';

const credentials = new AWS.SharedIniFileCredentials({ profile: 'tools' });

const credentiallsNew = {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
  };


export class AuthToken {

    async secretManager() {
        
        const secretsManager = new SecretsManager({ credentials: credentiallsNew, region: 'us-east-2' });
        const secretName = 'cortex-cicd-tools-secrets';
        const SECRET_KEY = ['apigee_nonprod_client_id','apigee_nonprod_client_secret'];

        const secret = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        const secrets = JSON.parse(secret.SecretString!);
        const secretValues = SECRET_KEY.map(key => secrets[key]);
        return secretValues
    }


}
