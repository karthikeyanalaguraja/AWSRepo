export interface PropertiesPayload {
  page: string
  slots: {
    type: string
    id: string
  }[]
  guest: {
    memberId: string
    adobeId: string
  }
  session: {
    country: string
    region: string | null
    city: string | null
  }
}
