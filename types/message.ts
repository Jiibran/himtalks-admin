export interface Message {
  id: number | string
  content: string
  sender_name: string
  recipient_name: string
  category?: string
  created_at: string
}