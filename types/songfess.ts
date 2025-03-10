export interface Songfess {
  id: number | string
  content: string
  song_id: string
  song_title: string
  artist: string
  album_art?: string
  preview_url?: string
  start_time?: number
  end_time?: number
  sender_name: string
  recipient_name: string
  created_at: string
}