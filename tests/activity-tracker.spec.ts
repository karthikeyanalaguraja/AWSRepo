import axios from "axios";
import { beforeAll, describe, expect, it, assert } from "vitest";
import { Request } from "../src/api/hcom/request";
import { ActivityTrackerPayload } from "../src/api/hcom/payloads/activity-tracker";

describe("activitytracker test", () => {
  it("response returns 200", async () => {
    const response = await Request.post(ActivityTrackerPayload)
    expect(response.status).toBe(200)
  });
});
