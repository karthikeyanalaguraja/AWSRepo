import { beforeAll, describe, expect, it, assert } from 'vitest'
import { ActivityTracker } from '../src/hcom/hcomApi/ActivityTracker'
import { ActivityTrackerPayload } from '../src/hcom/hcomPayload/ActivityTrackerPayload'
import { PropertiesPayload } from '../src/hcom/hcomPayload/PropertiesPayload'


describe('Hcom Smoke Test', () => {

  it('Activity Tracker with Valid Payload', async () => {
    try {
      const activityTracker = new ActivityTracker()
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
      const response = await activityTracker.postActivityTracker(requestBody)
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log('Invalid payload:', error.response.data)
      } else {
        console.error('Unexpected error:', error)
      }
    }
  })

  it('Activity Tracker with InValid Payload', async () => {
    try {
      const activityTracker = new ActivityTracker()
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
        lang: 'es-XX',
      }
      const response = await activityTracker.postActivityTracker(requestBody)
      expect(response.status).toBe(422)
      console.log(response)
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log('Invalid payload:', error.response.data)
      } else {
        console.error('Unexpected error:', error)
      }
    }
  })

  it('Properties with Valid Payload', async () => {
    try {
      const activityTracker = new ActivityTracker()
      const requestBody: PropertiesPayload = {
        "page": "/my-accounts",
        "slots": [
            {
                "type": "/hpe/v1/property",
                "id": "iasdkj82"
            }
        ],
        "guest": {
            "memberId": "asddsasd",
            "adobeId": "123123123"
        },
        "session": {
            "country": "aS-_",
            "region": null,
            "city": null
        }
      }
      const response = await activityTracker.postProperty(requestBody)
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log('Invalid payload:', error.response.data)
      } else {
        console.error('Unexpected error:', error)
      }
    }
  })

  it('Properties with Valid InPayload', async () => {
    try {
      const activityTracker = new ActivityTracker()
      const requestBody: PropertiesPayload = {
        "page": "/my-accounts",
        "slots": [
            {
                "type": "/hpe/v1/propertys",
                "id": "iasdkj82"
            }
        ],
        "guest": {
            "memberId": "asddsasd",
            "adobeId": "123123123"
        },
        "session": {
            "country": "aS-_",
            "region": null,
            "city": null
        }
      }
      const response = await activityTracker.postProperty(requestBody)
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log('Invalid payload:', error.response.data)
      } else {
        console.error('Unexpected error:', error)
      }
    }
  })

  it('Properties Sort with Valid Payload', async () => {
//     todo: test is going to similar like the above but the payload is not the interface its a json file "PropertiesSortPayload.json"
//     todo: in that i have to replace that variables with data and remaining data retains and pass this as payload
//     todo : Once the test is pass, this time i want the response to be validated. My guess it capture the response into a interface modal and 
//     validate the data against some hard coded value, later i will connect to db to validate. The sample response is stored in sampleresponse.ts
//     todo : use or extend the cloud watch logs and validate these logs are present in there 
  })

})
