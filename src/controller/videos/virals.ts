import { RequestWithToken } from '../../types/jwt'

export const checkReqBody = (req: RequestWithToken) => {
  const { search, platform, languages } = req.body

  if (!search) {
    return { status: 400, error: 'search is required' }
  }
  if (!platform) {
    return { status: 400, error: 'platform is required' }
  }
  if (!languages) {
    return { status: 400, error: 'languages is required' }
  }
  const isPlatformValid = ['tiktok', 'instagram', 'youtube'].includes(platform)
  if (!isPlatformValid) {
    return { status: 400, error: 'Invalid platform' }
  }
  return { status: 200, message: 'Valid request' }
}
