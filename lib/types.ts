export interface Profile {
  id: string
  email: string
  full_name: string
  date_of_birth: string
  gender: "male" | "female" | "other"
  university: string
  major?: string
  graduation_year?: number
  bio?: string
  interests?: string[]
  profile_complete: boolean
  created_at: string
  updated_at: string
}

export interface ProfilePhoto {
  id: string
  user_id: string
  photo_url: string
  photo_order: number
  created_at: string
}

export interface Preferences {
  id: string
  user_id: string
  show_me: "male" | "female" | "everyone"
  min_age: number
  max_age: number
  max_distance?: number
  same_university_only: boolean
  created_at: string
  updated_at: string
}

export interface Swipe {
  id: string
  swiper_id: string
  swiped_id: string
  action: "like" | "pass" | "super_like"
  created_at: string
}

export interface Match {
  id: string
  user1_id: string
  user2_id: string
  created_at: string
  last_message_at?: string
}

export interface Message {
  id: string
  match_id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}

export interface ProfileWithPhotos extends Profile {
  profile_photos: ProfilePhoto[]
}
