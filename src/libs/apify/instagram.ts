import { apifyClient } from './client'

import { RESULT_LIMITS_INSTAGRAM } from '../../consts'
import {
  type InstagramDataByUsername,
  type InstagramQueryRun,
  type InstagramDirectURLRun
} from '../../types/apify'

export const getInstagramDataForOneUrl = async ({
  url,
  resultsLimit
}: {
  url: string
  resultsLimit?: number
}) => {
  const input = {
    directUrls: [url],
    addParentData: false,
    enhanceUserSearchWithFacebookPage: false,
    isUserReelFeedURL: false,
    isUserTaggedFeedURL: false,
    resultsLimit: resultsLimit ? resultsLimit : 1,
    resultsType: 'details',
    searchLimit: 1,
    searchType: 'hashtag'
  }
  const run = await apifyClient.actor('shu8hvrXbJbY3Eb9W').call(input)
  const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems()
  return items[0] as unknown as InstagramDirectURLRun
}

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
  directUrls,
  resultsLimit
}: {
  directUrls: string[]
  resultsLimit?: number
}) => {
  const input = {
    directUrls,
    resultsType: 'posts',
    resultsLimit: resultsLimit ? resultsLimit : RESULT_LIMITS_INSTAGRAM,
    searchType: 'hashtag',
    searchLimit: resultsLimit ? resultsLimit : RESULT_LIMITS_INSTAGRAM,
    addParentData: false
  }
  const run = await apifyClient.actor('shu8hvrXbJbY3Eb9W').call(input)
  const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems()
  const COST_PER_ITEM = 0.0023
  return {
    items: items as unknown as InstagramDirectURLRun[],
    cost: COST_PER_ITEM * items.length
  }
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
  const COST_PER_ITEM = 2.3 / 1000
  return {
    items: items as unknown as InstagramDataByUsername[],
    cost: COST_PER_ITEM * items.length
  }
}

export const getImagesFromCarruselUrl = async ({ url }: { url: string }) => {
  const { items, cost } = await getInstagramDataByDirectUrl({
    directUrls: [url]
  })
  const { images } = items[0]
  return { images, cost }
}
