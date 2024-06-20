//Disable typescript here because the module is not typed
// @ts-nocheck
import instagramDl from '@sasmeee/igdl'
import axios from 'axios'
import fs from 'fs'

export const getInstagramVideoURL = async ({ url }: { url: string }) => {
  try {
    const res = await instagramDl(url)
    return res[0].download_link
  } catch (error) {
    console.error(error)
  }
}
