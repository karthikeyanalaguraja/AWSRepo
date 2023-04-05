import axios from 'axios'
import { beforeAll, describe, expect, it, assert } from 'vitest'
import { AwsConnection } from '../utility/AwsConnection'
import { ApiBase } from '../utility/ApiBase'
import { AuthToken } from '../utility/AuthToken'
import fs from 'fs'

describe.skip('AWS Connection Test', () => {
  it('Test AWS Connection', async () => {
    const awsConnection = new AwsConnection()
    await awsConnection.getListOfAPIFromApiGateway()
    await awsConnection.getCustomDomainName()
    const customDomainName = await awsConnection.getSpecficCustomDomainName('dev-notification', 'api.notification.dev.hyatt.global')
    console.log(customDomainName)
    const data = await awsConnection.getCloudWatch('/aws/lambda/hcom-dev-activity-tracker-v1')
    console.log(data)
    await awsConnection
      .listDynamoDB()
      .then((items) => console.log(items))
      .catch((err) => console.error(err))
    await awsConnection
      .queryDynamoDB()
      .then((items) => console.log(items))
      .catch((err) => console.error(err))
  })

  it('Test API Testing', async () => {
    const response = await axios.get('https://go.qa.hyatt.global/link/v2/imw5vof8p3W7DsKhW9XdTnMryhl-NSQg')
    assert.equal(response.status, 200)
    console.log(response.data)
  })

  it('Test API tesitng with Authentication', async () => {
    const environment = 'qa'
    const ANALYTICS_BASEURL = `https://api.analytics.${environment}.hyatt.global`
    const HCOM_BASEURL = `https://api.hcom.${environment}.hyatt.global/`

    const apiBase = new ApiBase()
    await apiBase.GetApi({ url: ANALYTICS_BASEURL + '/email/stats/by-action' })
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
      lang: 'es-ES',
    }
  })

  it('Generate Auth Token', async () => {
    var url = 'https://hyatt-non-prod-int.apigee.net/oauth-compliant/client_credential/accesstoken?grant_type=client_credentials'

    var postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        grant_type: 'client_credentials',
        Authorization: 'client_id:xxxxxx, client_secret:xxxxxxxxx',
      },
      redirect: 'follow',
    }
    //    var authToken = UrlFetchApp.fetch(url, postOptions);
  })

  it('XRAY Connection', async () => {
    const awsConnection = new AwsConnection()
    await awsConnection.xray()
  })
})
