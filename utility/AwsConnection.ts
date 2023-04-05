import { APIGatewayClient, GetDomainNameCommand } from '@aws-sdk/client-api-gateway'
import { DynamoDBClient, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb'
import AWS from 'aws-sdk'
import { XRay } from '@aws-sdk/client-xray';
const dotenv = require('dotenv')
dotenv.config()

const credentials = new AWS.SharedIniFileCredentials({ profile: 'dev' })

export class AwsConnection {
  private credentiallsNew = {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
  }

  async getListOfAPIFromApiGateway() {
    const apiGateway = new AWS.APIGateway({ credentials: this.credentiallsNew, region: 'us-east-2' })
    try {
      const data = await apiGateway.getRestApis({}).promise()
      const apis = data.items?.map((api) => ({
        id: api.id,
        name: api.name,
      }))
      console.log('API details:', apis)
    } catch (err) {
      console.log('Error getting API Gateway list:', err)
    }
  }

  async getCustomDomainName() {
    const apiGateway = new AWS.APIGateway({ credentials: this.credentiallsNew, region: 'us-east-2' })
    try {
      const data = await apiGateway.getDomainNames({}).promise()
      const customDomains = data.items?.map((domain) => ({
        name: domain.domainName,
        tags: domain.tags,
      }))
      console.log('Custom domain details:', customDomains)
    } catch (err) {
      console.log('Error getting custom domain details:', err)
    }
  }

  async getSpecficCustomDomainName(apiGatewayId: string, domainName: string) {
    const client = new APIGatewayClient({ credentials: this.credentiallsNew, region: 'us-east-2' })
    const command = new GetDomainNameCommand({
      domainName,
      restApiId: apiGatewayId,
    })

    try {
      const response = await client.send(command)
      return response
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async getCloudWatch(logGroupName: string) {
    const cloudwatchlogs = new AWS.CloudWatchLogs({ credentials: this.credentiallsNew, region: 'us-east-2' })
    const params: AWS.CloudWatchLogs.FilterLogEventsRequest = {
      logGroupName,
      orderBy: 'LastEventTime',
      limit: 5,
      descending: true,
    }
    // const data = await cloudwatchlogs.filterLogEvents(params).promise();
    // return data;

    const data = await cloudwatchlogs.describeLogStreams(params).promise()
    if (data.logStreams) {
      for (const stream of data.logStreams) {
        console.log(`Log Stream ID: ${stream.logStreamName}`)
        const logsParams = {
          logGroupName,
          logStreamName: stream.logStreamName,
          limit: 1,
          startFromHead: true,
        }

        const logsData = await cloudwatchlogs.getLogEvents(logsParams).promise()

        if (logsData.events && logsData.events.length > 0) {
          console.log(`Latest Log Message: ${logsData.events[0].message}`)
          // for (const event of logsData.events) {
          //   console.log(`Message: ${event.message}`);
          // }
        }
      }
    }
  }

  async listDynamoDB() {
    const client = new DynamoDBClient({ credentials: this.credentiallsNew, region: 'us-east-2' })

    const params = {
      TableName: 'personalize-content-links-dev',
    }

    const command = new ScanCommand(params)
    const response = await client.send(command)

    return response.Items
  }

  async queryDynamoDB() {
    AWS.config.update({ credentials: this.credentiallsNew, region: 'us-west-2' })
    const docClient = new AWS.DynamoDB.DocumentClient()

    const params = {
      TableName: 'personalize-content-links-dev',
      KeyConditionExpression: '#linkHash = :linkHash',
      ExpressionAttributeNames: {
        '#linkHash': 'linkHash',
      },
      ExpressionAttributeValues: {
        ':linkHash': 'link#WGkQeAgKC8AI527SQiMB1TOZBvKitbCa',
      },
    }

    try {
      const data = await docClient.query(params).promise()
      console.log(data.Items)
    } catch (err) {
      console.error('Unable to query. Error:', JSON.stringify(err, null, 2))
    }
  }

  async xray() {
    const xray = new XRay({ region: 'us-east-2' });
    const endTime = new Date().getTime(); // Current time
    const startTime = endTime - (5 * 60 * 1000); // 5 minutes ago
    
    const params = {
      StartTime: new Date(startTime),
      EndTime: new Date(endTime),
    };

    try {
      const data = await xray.getTraceSummaries(params);
      console.log(`Found ${data.TraceSummaries?.length ?? 0} traces:`);
      console.log(data.TraceSummaries)
      data.TraceSummaries?.forEach((trace) => {
      console.log(`- Trace ID: ${trace.Id}, Http URL: ${trace.Http?.HttpURL}, Http Status: ${trace.Http?.HttpStatus},`);
      const annotations = trace.Annotations;
      const apiId = annotations['aws:api_id'];
      console.log(apiId);
    });

   } catch (err) {
          console.log('Error retrieving traces:', err);
    }
  }
}
