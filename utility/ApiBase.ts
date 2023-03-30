import axios from 'axios'
import AWS from 'aws-sdk'
import aws4Interceptor from 'aws4-axios'

export class ApiBase {
  constructor() {
    const credentials = new AWS.SharedIniFileCredentials({ profile: 'qa_ro' })

    const credentiallsNew = {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    }

    const v4Interceptor = aws4Interceptor(
      {
        region: 'us-east-2',
        service: 'execute-api',
      },
      credentiallsNew
    )
  }

  async GetApi({ url }: { url: string }) {
    try {
      axios.interceptors.request.use(v4Interceptor)
      const data = await axios.get(url)
      console.log(data)
    } catch (err) {
      console.log('error', err.response.config.headers)
      console.log('error', err.response.data)
    }
  }

  async generateAccessToken(client_id: string, client_secret: string) {
    const accessTokenUrl = 'https://hyatt-non-prod-int.apigee.net/oauth-compliant/client_credential/accesstoken?grant_type=client_credentials'
    const clientId = client_id
    const clientSecret = client_secret

    const params = new URLSearchParams()
    params.append('grant_type', 'client_credentials')
    params.append('client_id', clientId)
    params.append('client_secret', clientSecret)

    const response = await axios.post(accessTokenUrl, params)
    if (response.status !== 200) {
      throw new Error(`Failed to generate access token. Status code: ${response.status}`)
    }

    const { access_token } = response.data

    if (!access_token) {
      throw new Error(`Access token not found in response data.`)
    }

    return access_token
  }
}
