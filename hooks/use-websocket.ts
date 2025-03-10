"use client"

import { useState, useEffect, useRef } from "react"

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<any>(null)
  const webSocketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!url) return;
    
    // Create WebSocket with credentials
    const ws = new WebSocket(url)
    webSocketRef.current = ws

    ws.onopen = () => {
      console.log("WebSocket connected")
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastMessage(data)
      } catch (error) {
        console.log("Received non-JSON message:", event.data)
        setLastMessage(event.data)
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    ws.onclose = () => {
      console.log("WebSocket connection closed")
      setIsConnected(false)
    }

    return () => {
      ws.close()
    }
  }, [url])

  // Function to send messages
  const sendMessage = (data: any) => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(JSON.stringify(data))
    } else {
      console.error("WebSocket is not connected")
    }
  }

  return { isConnected, lastMessage, sendMessage }
}

