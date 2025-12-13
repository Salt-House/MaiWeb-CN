export interface FunctionStatus {
  BUpdate: boolean
  CycleReport: boolean
  RatingPush: boolean
  AIRecommend: boolean
  DataShare: boolean
  DataAnalyse: boolean
}
export interface UserProfile {
  id: string
  username: string
  email: string
  privileges: string
  mai_rating: string
  mai_play_count: string
  mai_player_name: string
  mai_nameplate_id: number | null
  mai_icon_id: number | null
  mai_trophy_id: number | null
  mai_frame_id: number | null
}
export interface ThirdAccount {
  server: string
  nickname: string
  identifier: string
  from: string
}
export interface BindAccount {
  islxns: boolean
  isdivingfish: boolean
  isarcaed: boolean
}
export interface UserHistorySub {
  user_id: number
  rating: number
  rating_b35: number
  rating_b15: number
  active_until: string
}

export interface AccountResponse {
  server: string
  nickname: string
  identifier: string
}
