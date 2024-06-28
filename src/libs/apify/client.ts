import { ApifyClient } from 'apify-client'
import { config } from 'dotenv'
config()

const apifiKey = process.env.APIFY_API_KEY

export const apifyClient = new ApifyClient({
  token: apifiKey
})
