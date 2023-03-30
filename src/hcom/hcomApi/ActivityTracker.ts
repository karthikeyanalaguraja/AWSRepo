import {ActivityTrackerPayload} from '../hcomPayload/ActivityTrackerPayload'
import axios from 'axios'
import { AuthToken } from '../../../utility/AuthToken'
import { ApiBase } from '../../../utility/ApiBase'

export class ActivityTracker extends ApiBase {

    async postActivityTracker() {
        const authToken = new AuthToken()
        const [client_id, client_secret] = await authToken.secretManager()
        const token = await this.generateAccessToken(client_id, client_secret)
        console.log(token)

        const requestBody: ActivityTrackerPayload = {
            guest: {
              memberId: 'aliqua-in-sint',
              adobeId: 'labore-adipisicing-officia-amet-cupidatat',
            },
            session: {
              userAgent: 'iOS',
              version: 'v0.1',
            },
            channel: 'web',
            hpesrId: 'tempor-dolor-cillum-sint',
            eventType: 'view',
            pageId: 'commodo',
            lang: 'es-ES',
          }

          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
      
          const response = await axios.post('https://hyatt-non-prod-int.apigee.net/hpe/v1/activity', requestBody, { headers })
      
          console.log(response.status)
      
          if (response.status < 200 || response.status >= 300) {
            throw new Error(`Unexpected status code: ${response.status}`)
          }
    }
}