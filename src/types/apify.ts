export interface InstagramDirectURLRun {
  inputUrl: string
  id: string
  type: Type
  shortCode: string
  caption: string
  hashtags: string[]
  mentions: string[]
  url: string
  commentsCount: number
  firstComment: string
  latestComments: LatestComment[]
  dimensionsHeight: number
  dimensionsWidth: number
  displayUrl: string
  images: string[]
  alt: null | string
  likesCount: number
  timestamp: Date
  childPosts: ChildPost[]
  ownerFullName: string
  ownerUsername: string
  ownerId: string
  isSponsored: boolean
  videoUrl?: string
  videoViewCount?: number
  videoPlayCount?: number
  productType?: string
  videoDuration?: number
  isPinned?: boolean
  musicInfo?: MusicInfo
  taggedUsers?: CoauthorProducer[]
  coauthorProducers?: CoauthorProducer[]
  locationName?: string
  locationId?: string
}

export interface MusicInfo {
  artist_name: string
  song_name: string
  uses_original_audio: boolean
  should_mute_audio: boolean
  should_mute_audio_reason: string
  audio_id: string
}

export interface ChildPost {
  id: string
  type: Type
  shortCode: string
  caption: string
  hashtags: any[]
  mentions: any[]
  url: string
  commentsCount: number
  firstComment: string
  latestComments: any[]
  dimensionsHeight: number
  dimensionsWidth: number
  displayUrl: string
  images: any[]
  alt: null | string
  likesCount: null
  timestamp: null
  childPosts: any[]
  ownerId: null
  taggedUsers?: CoauthorProducer[]
  videoUrl?: string
  videoViewCount?: number
  videoPlayCount?: null
}

export interface CoauthorProducer {
  full_name?: string
  id: string
  is_verified: boolean
  profile_pic_url: string
  username: string
}

export enum Type {
  Image = 'Image',
  Sidecar = 'Sidecar',
  Video = 'Video'
}

export interface LatestComment {
  id: string
  text: string
  ownerUsername: string
  ownerProfilePicUrl: string
  timestamp: Date
  repliesCount: number
  replies: LatestComment[]
  likesCount: number
  owner: CoauthorProducer
}

export interface InstagramDataByUsername {
  inputUrl: string
  id: string
  username: string
  url: string
  fullName: string
  biography: string
  externalUrl?: string
  externalUrlShimmed?: string
  followersCount: number
  followsCount: number
  hasChannel: boolean
  highlightReelCount: number
  isBusinessAccount: boolean
  joinedRecently: boolean
  businessCategoryName?: string
  private: boolean
  verified: boolean
  profilePicUrl: string
  profilePicUrlHD: string
  igtvVideoCount: number
  relatedProfiles: RelatedProfile[]
  latestIgtvVideos: LatestIgtvVideo[]
  postsCount: number
  latestPosts: LatestPost[]
}

export interface RelatedProfile {
  id: string
  full_name: string
  is_private: boolean
  is_verified: boolean
  profile_pic_url: string
  username: string
}

export interface LatestIgtvVideo {
  type: string
  shortCode: string
  title?: string
  caption: string
  commentsCount: number
  commentsDisabled: boolean
  dimensionsHeight: number
  dimensionsWidth: number
  displayUrl: string
  likesCount: number
  videoDuration?: number
  videoViewCount: number
  id: string
  hashtags: string[]
  mentions: string[]
  url: string
  firstComment: string
  latestComments: any[]
  images: any[]
  videoUrl?: string
  alt: any
  timestamp: string
  childPosts: any[]
  locationName?: string
  locationId?: string
  ownerUsername: string
  ownerId: string
  productType: string
  taggedUsers?: TaggedUser[]
}

export interface TaggedUser {
  full_name: string
  id: string
  is_verified: boolean
  profile_pic_url: string
  username: string
}

export interface LatestPost {
  id: string
  type: string
  shortCode: string
  caption: string
  hashtags: string[]
  mentions: string[]
  url: string
  commentsCount: number
  dimensionsHeight: number
  dimensionsWidth: number
  displayUrl: string
  images: string[]
  alt?: string
  likesCount: number
  timestamp: string
  ownerUsername: string
  ownerId: string
  locationName?: string
  locationId?: string
  isPinned?: boolean
  videoUrl?: string
  videoViewCount?: number
  productType?: string
  taggedUsers?: TaggedUser3[]
}

export interface TaggedUser2 {
  full_name: string
  id: string
  is_verified: boolean
  profile_pic_url: string
  username: string
}

export interface TaggedUser3 {
  full_name: string
  id: string
  is_verified: boolean
  profile_pic_url: string
  username: string
}

export interface InstagramQueryRun {
  searchTerm: string
  searchSource: string
  inputUrl: string
  id: string
  name: string
  username: string
  url: string
  topPostsOnly: boolean
  profilePicUrl: string
  postsCount: number
  topPosts: Post[]
  latestPosts: Post[]
}

export interface Post {
  id: string
  type: string
  shortCode: string
  caption: string
  hashtags: string[]
  mentions: any[]
  url: string
  commentsCount: number
  firstComment: string
  latestComments: any[]
  dimensionsHeight: number
  dimensionsWidth: number
  displayUrl: string
  images: any[]
  alt: string
  likesCount: number
  timestamp: Date
  childPosts: any[]
  ownerId: string
}

export interface TiktokProfileRun {
  id: string
  title: string
  views: number
  likes: number
  comments: number
  shares: number
  bookmarks: number
  hashtags: any[]
  channel: Channel
  uploadedAt: number
  uploadedAtFormatted: Date
  video: Video
  song: Song
  postPage: string
}

export interface Channel {
  name: string
  username: string
  id: string
  url: string
  avatar: string
  verified: boolean
  followers: number
  following: number
  videos: number
}

export interface Song {
  id: number
  title: string
  artist: string
  album: null
  duration: number
  cover: string
}

export interface Video {
  width: number
  height: number
  ratio: string
  duration: number
  url: string
  cover: string
  thumbnail: string
}

export interface TiktokQueryRun {
  id: string
  text: string
  createTime: number
  createTimeISO: Date
  isAd: boolean
  isMuted: boolean
  authorMeta: AuthorMeta
  musicMeta: MusicMeta
  webVideoUrl: string
  mediaUrls: string[]
  videoMeta: VideoMeta
  diggCount: number
  shareCount: number
  playCount: number
  collectCount: number
  commentCount: number
  mentions: string[]
  hashtags: Hashtag[]
  effectStickers: any[]
  isSlideshow: boolean
  isPinned: boolean
  searchQuery: string
}

export interface AuthorMeta {
  id: string
  name: string
  nickName: string
  verified: boolean
  signature: string
  bioLink: null
  avatar: string
  privateAccount: boolean
  following: number
  fans: number
  heart: number
  video: number
  digg: number
}

export interface Hashtag {
  id: string
  name: string
  title?: string
  cover?: string
}

export interface MusicMeta {
  musicName: string
  musicAuthor: string
  musicOriginal: boolean
  musicAlbum: string
  playUrl: string
  coverMediumUrl: string
  musicId: string
}

export interface VideoMeta {
  height: number
  width: number
  duration: number
  coverUrl: string
  originalCoverUrl: string
  format: string
  originalDownloadAddr: string
  downloadAddr: string
}

export interface YoutubeQueryRun {
  id?: string
  title?: string
  url: string
  viewCount?: number
  fromYTUrl?: string
  thumbnailUrl?: string
  type?: Type
  duration?: null
  channelName: string
  channelUrl?: null
  date?: Date
  order?: number
  comments?: null
  channelId?: null
  likes?: number
  commentsCount?: number
  descriptionLinks?: null
  isMonetized?: null
  subtitles?: null
  text?: null | string
  hashtags?: any[]
  formats?: null
  note?: string
  input?: string
}

export interface YoutubeURLRun {
  id: string
  title: string
  url: string
  viewCount: number
  fromYTUrl: string
  thumbnailUrl: string
  type: string
  duration: null
  channelName: string
  channelUrl: string
  date: null
  order: number
  channelDescription: string
  channelJoinedDate: string
  channelDescriptionLinks: string[]
  channelLocation: string
  channelAvatarUrl: string
  channelBannerUrl: string
  channelTotalVideos: number
  channelTotalViews: number
  numberOfSubscribers: number
  isChannelVerified: boolean
  channelId: string
  inputChannelUrl: string
  isAgeRestricted: boolean
}
