import axios from 'axios'
import { AuthToken } from '../../../utility/AuthToken'
import { ApiBase } from '../../../utility/ApiBase'

export class ActivityTracker extends ApiBase {
  async postActivityTracker(requestBodyData: any) {
    const authToken = new AuthToken()
    const [client_id, client_secret] = await authToken.secretManager()
    const token = await this.generateAccessToken(client_id, client_secret)

    const requestBody = requestBodyData

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    const response = await axios.post('https://hyatt-non-prod-int.apigee.net/hpe/v1/activity', requestBody, { headers })

    return response
  }

  async postProperty(requestBodyData: any) {
    const authToken = new AuthToken()
    const [client_id, client_secret] = await authToken.secretManager()
    const token = await this.generateAccessToken(client_id, client_secret)

    const requestBody = requestBodyData

    const headers = {
      Authorization: `Bearer ${token}`,
      'x-app-client':'CORTEX',
      'x-hyatt-locale':'en-US',
      'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:108.0) Gecko/20100101 Firefox/108.0',
      'Content-Type': 'application/json',
    }

    const response = await axios.post('https://hyatt-non-prod-int.apigee.net/hpe/v1/properties', requestBody, { headers })

    return response
  }

  async postPropertiesSort(requestBodyData: any) {
    const authToken = new AuthToken()
    const [client_id, client_secret] = await authToken.secretManager()
    const token = await this.generateAccessToken(client_id, client_secret)

    const requestBody = requestBodyData

    const headers = {
      Authorization: `Bearer ${token}`,
      'x-app-client':'CORTEX',
      'x-hyatt-locale':'en-US',
      'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:108.0) Gecko/20100101 Firefox/108.0',
      'Content-Type': 'application/json',
    }

    const response = await axios.post('https://hyatt-non-prod-int.apigee.net/hpe/v1/properties', requestBody, { headers })

    return response
  }
}
