"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Message } from "@/types/message"
import MessageList from "@/components/message-list"
import { useWebSocket } from "@/hooks/use-websocket"
import { fetchMessages } from "@/services/api"
import { useAuth } from "@/components/auth-provider"
import { formatDistanceToNow } from "date-fns";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, refreshAuthStatus } = useAuth()

  // Initialize WebSocket connection
  const { lastMessage } = useWebSocket("wss://api.teknohive.me/messages")

  // Fetch initial messages
  const loadMessages = async () => {
    try {
      setLoading(true)
      // Refresh auth status before making the request
      await refreshAuthStatus()
      const data = await fetchMessages()
      setMessages(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching messages:", err)
      setError("Failed to load messages. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  // Handle new messages from WebSocket
  useEffect(() => {
    if (lastMessage) {
      try {
        const newMessage = JSON.parse(lastMessage.data)
        setMessages((prev) => [newMessage, ...prev])
      } catch (err) {
        console.error("Error parsing WebSocket message:", err)
      }
    }
  }, [lastMessage])

  // Handle message deletion
  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id))
  }

  // Add this helper function
  const formatSafeDate = (dateString: string | number | Date | null | undefined) => {
    if (!dateString) return "Unknown time";
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>View and manage your messages</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">Loading messages...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : (
            <MessageList messages={messages} onDelete={handleDeleteMessage} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

