import { Config, SecretsManager, SharedIniFileCredentials } from 'aws-sdk'
import AWS from 'aws-sdk'

const credentials = new AWS.SharedIniFileCredentials({ profile: 'tools' })

export class AuthToken {
  private credentiallsNew = {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
  }

  async secretManager() {
    const secretsManager = new SecretsManager({ credentials: this.credentiallsNew, region: 'us-east-2' })
    const secretName = 'cortex-cicd-tools-secrets'
    const SECRET_KEY = ['apigee_nonprod_client_id', 'apigee_nonprod_client_secret']

    const secret = await secretsManager.getSecretValue({ SecretId: secretName }).promise()
    const secrets = JSON.parse(secret.SecretString!)
    const secretValues = SECRET_KEY.map((key) => secrets[key])
    return secretValues
  }
}
