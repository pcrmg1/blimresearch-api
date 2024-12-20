import { YoutubeQueryRun, YoutubeURLRun } from '../../types/apify'
import { errorHandler } from '../../utils/error'
import { apifyClient } from './client'

export const getYoutubeShortsDataFromQuery = async ({
  query
}: {
  query: string
}) => {
  try {
    const input = {
      downloadSubtitles: false,
      hasCC: false,
      hasLocation: false,
      hasSubtitles: false,
      is360: false,
      is3D: false,
      is4K: false,
      isBought: false,
      isHD: false,
      isHDR: false,
      isLive: false,
      isVR180: false,
      maxResultStreams: 0,
      maxResults: 0,
      maxResultsShorts: 25,
      preferAutoGeneratedSubtitles: false,
      saveSubsToKVS: false,
      searchKeywords: query,
      startUrls: [],
      subtitlesLanguage: 'any',
      subtitlesFormat: 'srt'
    }
    const run = await apifyClient.actor('h7sDV53CddomktSi5').call(input)
    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems()
    const COST_PER_ITEM = 5 / 1000
    const cost = items.length * COST_PER_ITEM
    return { items: items as unknown as YoutubeQueryRun[], cost }
  } catch (error) {
    errorHandler(error)
    return null
  }
}

export const getYoutubeShortsDataFromUrl = async ({
  channelUrls
}: {
  channelUrls: string[]
}) => {
  const input = {
    maxResultStreams: 0,
    maxResults: 0,
    maxResultsShorts: 5,
    sortVideosBy: 'POPULAR',
    startUrls: channelUrls.map((url) => ({ url }))
  }
  try {
    const run = await apifyClient.actor('67Q6fmd8iedTVcCwY').call(input)
    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems()
    const COST_PER_ITEM = 5 / 1000
    const cost = items.length * COST_PER_ITEM
    return { items: items as unknown as YoutubeURLRun[], cost }
  } catch (error) {
    return errorHandler(error)
  }
}
