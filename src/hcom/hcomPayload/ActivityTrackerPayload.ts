export interface ActivityTrackerPayload {
  guest: {
    memberId: string
    adobeId: string
  }
  session: {
    userAgent: string
    version: string
  }
  channel: string
  hpesrId: string
  eventType: string
  pageId: string
  lang: string
}
