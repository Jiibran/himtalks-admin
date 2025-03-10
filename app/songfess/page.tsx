"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Songfess } from "@/types/songfess"
import SongfessList from "@/components/songfess-list"
import { useWebSocket } from "@/hooks/use-websocket"
import { fetchSongfess } from "@/services/api"
import { useAuth } from "@/components/auth-provider"

export default function SongfessPage() {
  const [songfess, setSongfess] = useState<Songfess[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, refreshAuthStatus } = useAuth()

  // Initialize WebSocket connection
  const { lastMessage } = useWebSocket("wss://api.teknohive.me/songfess")

  // Fetch initial songfess entries
  const loadSongfess = async () => {
    try {
      setLoading(true)
      // Refresh auth status before making the request
      await refreshAuthStatus()
      const data = await fetchSongfess()
      setSongfess(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching songfess:", err)
      setError("Failed to load songfess. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSongfess()
  }, [])

  // Handle new songfess from WebSocket
  useEffect(() => {
    if (lastMessage) {
      try {
        const newSongfess = JSON.parse(lastMessage.data)
        setSongfess((prev) => [newSongfess, ...prev])
      } catch (err) {
        console.error("Error parsing WebSocket message:", err)
      }
    }
  }, [lastMessage])

  // Handle songfess deletion
  const handleDeleteSongfess = (id: string) => {
    setSongfess((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Songfess</CardTitle>
          <CardDescription>View and manage your song confessions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">Loading songfess...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : (
            <SongfessList songfess={songfess} onDelete={handleDeleteSongfess} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

