import axios, { AxiosResponse } from "axios";
import { AuthToken } from "../../../utility/AuthToken";
import { ApiBase } from "../../../utility/ApiBase";
import aws4Interceptor from "aws4-axios";
import AWS from "aws-sdk";
import {ActivityTracker} from "./types/activity-tracket-d"

type ActivityTrackerType = ActivityTracker
type Payload = ActivityTrackerType
export class Request extends ApiBase {
    static post = async (payload: Payload): Promise<AxiosResponse<any, any>> => {
        const authToken = new AuthToken();
        const apiBase = new ApiBase()
        const [client_id, client_secret] = await authToken.secretManager();
        const token = await apiBase.generateAccessToken(client_id, client_secret);
    
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          };
      
          const response = await axios.post(
            "https://hyatt-non-prod-int.apigee.net/hpe/v1/activity",
            payload,
            { headers }
          );
          return response
    }

    static get = async (url: string): Promise<AxiosResponse<any, any>> => {
        let response
        const credentials = new AWS.SharedIniFileCredentials({ profile: "qa_ro" });

        const credentiallsNew = {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          sessionToken: credentials.sessionToken,
        };
    
        const v4Interceptor = aws4Interceptor(
          {
            region: "us-east-2",
            service: "execute-api",
          },
          credentiallsNew
        );
        try {
          axios.interceptors.request.use(v4Interceptor);
          response = await axios.get(url);
          console.log(response);
        } catch (err) {
          console.log("error", err.response.config.headers);
          console.log("error", err.response.data);
        }
        return response
      }
}