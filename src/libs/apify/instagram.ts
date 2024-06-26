import { apifyClient } from './client'

import { RESULT_LIMITS_INSTAGRAM } from '../../consts'
import {
  type InstagramDataByUsername,
  type InstagramQueryRun,
  type InstagramDirectURLRun
} from '../../types/apify'

export const getInstagramDataByQuery = async ({ query }: { query: string }) => {
  const input = {
    search: query,
    resultsType: 'posts',
    resultsLimit: RESULT_LIMITS_INSTAGRAM,
    searchType: 'hashtag',
    searchLimit: RESULT_LIMITS_INSTAGRAM,
    addParentData: false
  }
  const run = await apifyClient.actor('shu8hvrXbJbY3Eb9W').call(input)
  const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems()
  return items as unknown as InstagramQueryRun[]
}

export const getInstagramDataByDirectUrl = async ({
  directUrls
}: {
  directUrls: string[]
}) => {
  const input = {
    directUrls,
    resultsType: 'posts',
    resultsLimit: RESULT_LIMITS_INSTAGRAM,
    searchType: 'hashtag',
    searchLimit: RESULT_LIMITS_INSTAGRAM,
    addParentData: false
  }
  const run = await apifyClient.actor('shu8hvrXbJbY3Eb9W').call(input)
  const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems()
  return items as unknown as InstagramDirectURLRun[]
}

export const getInstagramDataByUsernames = async ({
  usernames
}: {
  usernames: string[]
}) => {
  const input = {
    usernames
  }
  const run = await apifyClient.actor('dSCLg0C3YEZ83HzYX').call(input)
  const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems()
  return items as unknown as InstagramDataByUsername[]
}

export const getImagesFromCarruselUrl = async ({ url }: { url: string }) => {
  const items = await getInstagramDataByDirectUrl({ directUrls: [url] })
  const { images } = items[0]
  return images
}
