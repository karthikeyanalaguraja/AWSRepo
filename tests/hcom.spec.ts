import axios from 'axios'
import { beforeAll, describe, expect, it, assert } from 'vitest'
import { ApiBase } from '../utility/ApiBase'
import { AuthToken } from '../utility/AuthToken'
import { ActivityTracker } from '../src/hcom/hcomApi/ActivityTracker'
import fs from 'fs'

describe('AWS Connection Test', () => {
  it.skip('Activity API', async () => {
    const apiBase = new ApiBase()
    const authToken = new AuthToken()
    const [client_id, client_secret] = await authToken.secretManager()
    const token = await apiBase.generateAccessToken(client_id, client_secret)
    console.log(token)

    const requestBody = {
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
  })

  it('Sample test', async () => {
    const activityTracker = new ActivityTracker()
    await activityTracker.postActivityTracker()
  })
})
