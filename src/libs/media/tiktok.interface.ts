export interface TiktokData3 {
  added_sound_music_info: AddedSoundMusicInfo
  aigc_info: AigcInfo
  anchors: null
  anchors_extras: string
  author: WelcomeAuthor
  author_user_id: number
  aweme_acl: AwemeACL
  aweme_id: string
  aweme_type: number
  banners: null
  behind_the_song_music_ids: null
  behind_the_song_video_music_ids: null
  bodydance_score: number
  branded_content_accounts: null
  cc_template_info: CcTemplateInfo
  cha_list: ChaList[]
  challenge_position: null
  cmt_swt: boolean
  collect_stat: number
  comment_config: CommentConfig
  comment_topbar_info: null
  commerce_config_data: null
  commerce_info: CommerceInfo
  content_desc: string
  content_desc_extra: any[]
  content_model: ContentModel
  cover_labels: null
  create_time: number
  creation_info: CreationInfo
  desc: string
  desc_language: string
  disable_search_trending_bar: boolean
  distance: string
  distribute_type: number
  follow_up_publish_from_id: number
  geofencing: null
  geofencing_regions: null
  green_screen_materials: null
  group_id: string
  group_id_list: GroupIDList
  has_danmaku: boolean
  has_vs_entry: boolean
  have_dashboard: boolean
  hybrid_label: null
  image_infos: null
  interact_permission: InteractPermission
  interaction_stickers: null
  is_ads: boolean
  is_description_translatable: boolean
  is_hash_tag: number
  is_nff_or_nr: boolean
  is_on_this_day: number
  is_pgcshow: boolean
  is_preview: number
  is_relieve: boolean
  is_text_sticker_translatable: boolean
  is_title_translatable: boolean
  is_top: number
  is_vr: boolean
  item_comment_settings: number
  item_duet: number
  item_react: number
  item_stitch: number
  label_top: LabelTop
  label_top_text: null
  long_video: null
  main_arch_common: string
  mask_infos: any[]
  misc_info: string
  muf_comment_info_v2: null
  music: AddedSoundMusicInfo
  music_begin_time_in_ms: number
  music_selected_from: string
  music_title_style: number
  music_volume: string
  need_trim_step: boolean
  need_vs_entry: boolean
  nickname_position: null
  no_selected_music: boolean
  operator_boost_info: null
  origin_comment_ids: null
  origin_volume: string
  original_client_text: OriginalClientText
  picked_users: any[]
  playlist_blocked: boolean
  poi_re_tag_signal: number
  position: null
  prevent_download: boolean
  products_info: null
  question_list: null
  quick_reply_emojis: string[]
  rate: number
  reference_tts_voice_ids: null
  reference_voice_filter_ids: null
  region: string
  risk_infos: RiskInfos
  search_highlight: null
  share_info: ChaListShareInfo
  share_url: string
  sort_label: string
  statistics: Statistics
  status: Status
  support_danmaku: boolean
  text_extra: TextExtra[]
  text_sticker_major_lang: string
  title_language: string
  ttec_suggest_words: TtecSuggestWords
  tts_voice_ids: null
  ttt_product_recall_type: number
  uniqid_position: null
  upvote_info: UpvoteInfo
  upvote_preload: UpvotePreload
  used_full_song: boolean
  user_digged: number
  video: Video
  video_control: VideoControl
  video_labels: any[]
  video_text: any[]
  voice_filter_ids: null
  with_promotional_music: boolean
  without_watermark: boolean
}

export interface AddedSoundMusicInfo {
  album: string
  allow_offline_music_to_detail_page: boolean
  artists: any[]
  audition_duration: number
  author: string
  author_deleted: boolean
  author_position: null
  avatar_medium: LabelTop
  avatar_thumb: LabelTop
  binded_challenge_id: number
  can_not_reuse: boolean
  collect_stat: number
  commercial_right_type: number
  cover_large: LabelTop
  cover_medium: LabelTop
  cover_thumb: LabelTop
  create_time: number
  dmv_auto_show: boolean
  duration: number
  duration_high_precision: DurationHighPrecision
  external_song_info: any[]
  extra: string
  has_commerce_right: boolean
  id: number
  id_str: string
  is_audio_url_with_cookie: boolean
  is_author_artist: boolean
  is_commerce_music: boolean
  is_matched_metadata: boolean
  is_original: boolean
  is_original_sound: boolean
  is_pgc: boolean
  is_play_music: boolean
  is_shooting_allow: boolean
  log_extra: string
  lyric_short_position: null
  matched_pgc_sound: MatchedPgcSound
  matched_song: MatchedSong
  meme_song_info: MemeSongInfo
  mid: string
  multi_bit_rate_play_info: null
  mute_share: boolean
  offline_desc: string
  owner_handle: string
  owner_id: string
  owner_nickname: string
  play_url: LabelTop
  position: null
  prevent_download: boolean
  preview_end_time: number
  preview_start_time: number
  recommend_status: number
  search_highlight: null
  sec_uid: string
  shoot_duration: number
  source_platform: number
  status: number
  tag_list: null
  title: string
  tt_to_dsp_song_infos: any[]
  uncert_artists: null
  user_count: number
  video_duration: number
}

export interface LabelTop {
  height: number
  uri: string
  url_list: string[]
  url_prefix: null
  width: number
}

export interface DurationHighPrecision {
  audition_duration_precision: number
  duration_precision: number
  shoot_duration_precision: number
  video_duration_precision: number
}

export interface MatchedPgcSound {
  artist_infos: ArtistInfo[]
  author: string
  mixed_author: string
  mixed_title: string
  music_release_info: MusicReleaseInfo
  title: string
  uncert_artists: null
}

export interface ArtistInfo {
  enter_type: number
  follow_status: number
  follower_status: number
  handle: string
  is_block: boolean
  is_blocked: boolean
  is_private_account: boolean
  is_verified: boolean
  is_visible: boolean
  nick_name: string
  sec_uid: string
  status: number
  uid: string
}

export interface MusicReleaseInfo {
  group_release_date: number
  is_new_release_song: boolean
}

export interface MatchedSong {
  author: string
  chorus_info: ChorusInfo
  cover_medium: LabelTop
  full_duration: number
  h5_url: string
  id: string
  performers: null
  title: string
}

export interface ChorusInfo {
  duration_ms: number
  start_ms: number
}

export interface MemeSongInfo {}

export interface AigcInfo {
  aigc_label_type: number
  created_by_ai: boolean
}

export interface WelcomeAuthor {
  accept_private_policy: boolean
  account_labels: null
  account_region: string
  ad_cover_url: null
  advance_feature_item_order: null
  advanced_feature_info: null
  apple_account: number
  authority_status: number
  avatar_168x168: LabelTop
  avatar_300x300: LabelTop
  avatar_larger: LabelTop
  avatar_medium: LabelTop
  avatar_thumb: LabelTop
  avatar_uri: string
  aweme_count: number
  bind_phone: string
  bold_fields: null
  can_message_follow_status_list: number[]
  can_set_geofencing: null
  cha_list: null
  comment_filter_status: number
  comment_setting: number
  commerce_user_level: number
  cover_url: any[]
  create_time: number
  custom_verify: string
  cv_level: string
  download_prompt_ts: number
  download_setting: number
  duet_setting: number
  enabled_filter_all_comments: boolean
  enterprise_verify_reason: string
  events: null
  fake_data_info: MemeSongInfo
  favoriting_count: number
  fb_expire_time: number
  follow_status: number
  follower_count: number
  follower_status: number
  followers_detail: null
  following_count: number
  friends_status: number
  geofencing: null
  google_account: string
  has_email: boolean
  has_facebook_token: boolean
  has_insights: boolean
  has_orders: boolean
  has_twitter_token: boolean
  has_youtube_token: boolean
  hide_search: boolean
  homepage_bottom_toast: null
  ins_id: string
  is_ad_fake: boolean
  is_block: boolean
  is_discipline_member: boolean
  is_mute: number
  is_mute_lives: number
  is_mute_non_story_post: number
  is_mute_story: number
  is_phone_binded: boolean
  is_star: boolean
  item_list: null
  language: string
  live_agreement: number
  live_commerce: boolean
  live_verify: number
  mention_status: number
  mutual_relation_avatars: null
  need_points: null
  need_recommend: number
  nickname: string
  platform_sync_info: null
  prevent_download: boolean
  react_setting: number
  region: string
  relative_users: null
  reply_with_video_flag: number
  room_id: number
  search_highlight: null
  sec_uid: string
  secret: number
  share_info: AuthorShareInfo
  share_qrcode_uri: string
  shield_comment_notice: number
  shield_digg_notice: number
  shield_edit_field_info: null
  shield_follow_notice: number
  short_id: string
  show_image_bubble: boolean
  signature: string
  special_account: SpecialAccount
  special_lock: number
  status: number
  stitch_setting: number
  story_status: number
  total_favorited: number
  tw_expire_time: number
  twitter_id: string
  twitter_name: string
  type_label: null
  uid: string
  unique_id: string
  unique_id_modify_time: number
  user_canceled: boolean
  user_mode: number
  user_now_pack_info: MemeSongInfo
  user_period: number
  user_profile_guide: null
  user_rate: number
  user_spark_info: MemeSongInfo
  user_tags: null
  verification_type: number
  verify_info: string
  video_icon: LabelTop
  white_cover_url: null
  with_commerce_entry: boolean
  with_shop_entry: boolean
  youtube_channel_id: string
  youtube_channel_title: string
  youtube_expire_time: number
}

export interface AuthorShareInfo {
  now_invitation_card_image_urls: null
  share_desc: string
  share_desc_info: string
  share_qrcode_url: LabelTop
  share_title: string
  share_title_myself: string
  share_title_other: string
  share_url: string
}

export interface SpecialAccount {
  special_account_list: null
}

export interface AwemeACL {
  download_general: DownloadGeneral
  download_mask_panel: DownloadGeneral
  platform_list: null
  press_action_list: null
  share_action_list: ShareActionList[]
  share_general: DownloadGeneral
  share_list_status: number
}

export interface DownloadGeneral {
  code: number
  extra: string
  mute: boolean
  show_type: number
  transcode: number
  toast_msg?: string
}

export interface ShareActionList {
  action_id: string
  code: number
  extra: string
  show_type: number
  toast_msg: string
}

export interface CcTemplateInfo {
  author_name: string
  clip_count: number
  desc: string
  duration_milliseconds: number
  related_music_id: string
  template_id: string
}

export interface ChaList {
  author: ChaListAuthor
  banner_list: null
  cha_attrs: null
  cha_name: string
  cid: string
  collect_stat: number
  connect_music: any[]
  desc: string
  extra_attr: ExtraAttr
  hashtag_profile: string
  is_challenge: number
  is_commerce: boolean
  is_pgcshow: boolean
  schema: string
  search_highlight: null
  share_info: ChaListShareInfo
  show_items: null
  sub_type: number
  type: number
  use_count: number
  user_count: number
  view_count: number
}

export interface ChaListAuthor {
  account_labels: null
  ad_cover_url: null
  advance_feature_item_order: null
  advanced_feature_info: null
  bold_fields: null
  can_message_follow_status_list: null
  can_set_geofencing: null
  cha_list: null
  cover_url: null
  events: null
  followers_detail: null
  geofencing: null
  homepage_bottom_toast: null
  item_list: null
  mutual_relation_avatars: null
  need_points: null
  platform_sync_info: null
  relative_users: null
  search_highlight: null
  shield_edit_field_info: null
  type_label: null
  user_profile_guide: null
  user_tags: null
  white_cover_url: null
}

export interface ExtraAttr {
  is_live: boolean
}

export interface ChaListShareInfo {
  bool_persist: number
  now_invitation_card_image_urls: null
  share_desc: string
  share_desc_info: string
  share_quote: string
  share_signature_desc: string
  share_signature_url: string
  share_title: string
  share_title_myself: string
  share_title_other: string
  share_url: string
  share_link_desc?: string
  whatsapp_desc?: string
}

export interface CommentConfig {
  emoji_recommend_list: null
  long_press_recommend_list: null
  preload: Preload
  quick_comment: QuickComment
  quick_comment_emoji_recommend_list: null
}

export interface Preload {
  preds: string
  type: number
}

export interface QuickComment {
  enabled: boolean
}

export interface CommerceInfo {
  adv_promotable: boolean
  auction_ad_invited: boolean
  branded_content_type: number
  with_comment_filter_words: boolean
}

export interface ContentModel {
  custom_biz: CustomBiz
  standard_biz: StandardBiz
}

export interface CustomBiz {
  aweme_trace: string
}

export interface StandardBiz {
  creator_analytics: MemeSongInfo
  e_commerce: ECommerce
}

export interface ECommerce {
  ttec_content_tag: TtecContentTag
}

export interface TtecContentTag {
  recommendation_tag_consumer_str: string
  recommendation_tag_creator_str: string
}

export interface CreationInfo {
  creation_used_functions: any[]
}

export interface GroupIDList {
  GroupdIdList0: number[]
  GroupdIdList1: number[]
}

export interface InteractPermission {
  allow_adding_as_post: AllowAddingAsPost
  allow_adding_to_story: number
  allow_create_sticker: AllowCreateSticker
  allow_story_switch_to_post: MemeSongInfo
  duet: number
  duet_privacy_setting: number
  stitch: number
  stitch_privacy_setting: number
  upvote: number
}

export interface AllowAddingAsPost {
  status: number
}

export interface AllowCreateSticker {
  disable_toast: string
  status: number
}

export interface OriginalClientText {
  markup_text: string
  text_extra: TextExtra[]
}

export interface TextExtra {
  hashtag_id: string
  hashtag_name: string
  is_commerce: boolean
  sec_uid: string
  tag_id?: string
  type: number
  user_id: string
  end?: number
  start?: number
}

export interface RiskInfos {
  content: string
  risk_sink: boolean
  type: number
  vote: boolean
  warn: boolean
}

export interface Statistics {
  aweme_id: string
  collect_count: number
  comment_count: number
  digg_count: number
  download_count: number
  forward_count: number
  lose_comment_count: number
  lose_count: number
  play_count: number
  repost_count: number
  share_count: number
  whatsapp_share_count: number
}

export interface Status {
  allow_comment: boolean
  allow_share: boolean
  aweme_id: string
  download_status: number
  in_reviewing: boolean
  is_delete: boolean
  is_prohibited: boolean
  private_status: number
  review_result: ReviewResult
  reviewed: number
  self_see: boolean
}

export interface ReviewResult {
  review_status: number
}

export interface TtecSuggestWords {
  ttec_suggest_words: null
}

export interface UpvoteInfo {
  friends_recall_info: string
  repost_initiate_score: number
  user_upvoted: boolean
}

export interface UpvotePreload {
  need_pull_upvote_info: boolean
}

export interface Video {
  CoverTsp: number
  ai_dynamic_cover: AIDynamicCover
  ai_dynamic_cover_bak: AIDynamicCover
  animated_cover: AIDynamicCover
  big_thumbs: any[]
  bit_rate: BitRate[]
  bit_rate_audio: any[]
  cdn_url_expired: number
  cla_info: ClaInfo
  cover: LabelTop
  cover_is_custom: boolean
  duration: number
  dynamic_cover: LabelTop
  has_watermark: boolean
  height: number
  is_bytevc1: number
  is_callback: boolean
  meta: string
  need_set_token: boolean
  origin_cover: LabelTop
  play_addr: PlayAddr
  download_addr: PlayAddr
  ratio: string
  source_HDR_type: number
  tags: null
  width: number
}

export interface AIDynamicCover {
  uri: string
  url_list: string[]
  url_prefix: null
}

export interface BitRate {
  HDR_bit: string
  HDR_type: string
  bit_rate: number
  dub_infos: null
  fps: number
  gear_name: string
  is_bytevc1: number
  play_addr: PlayAddr
  quality_type: number
  video_extra: string
}

export interface PlayAddr {
  data_size: number
  file_cs: string
  file_hash: string
  height: number
  uri: string
  url_key: string
  url_list: string[]
  url_prefix: null
  width: number
}

export interface ClaInfo {
  caption_infos: CaptionInfo[]
  captions_type: number
  creator_edited_caption_id: number
  enable_auto_caption: number
  has_original_audio: number
  hide_original_caption: boolean
  no_caption_reason: number
  original_language_info: OriginalLanguageInfo
  vertical_positions: null
}

export interface CaptionInfo {
  caption_format: string
  caption_length: number
  cla_subtitle_id: number
  complaint_id: number
  expire: number
  is_auto_generated: boolean
  is_original_caption: boolean
  lang: string
  language_code: string
  language_id: number
  source_tag: string
  sub_id: number
  sub_version: string
  subtitle_type: number
  translation_type: number
  translator_id: number
  url: string
  url_list: string[]
  variant: string
}

export interface OriginalLanguageInfo {
  can_translate_realtime: boolean
  can_translate_realtime_skip_translation_lang_check: boolean
  first_subtitle_time: number
  is_burnin_caption: boolean
  lang: string
  language_code: string
  language_id: number
  original_caption_type: number
}

export interface VideoControl {
  allow_download: boolean
  allow_duet: boolean
  allow_dynamic_wallpaper: boolean
  allow_music: boolean
  allow_react: boolean
  allow_stitch: boolean
  draft_progress_bar: number
  prevent_download_type: number
  share_type: number
  show_progress_bar: number
  timer_status: number
}
