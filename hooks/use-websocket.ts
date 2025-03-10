"use client"

import { useEffect, useRef, useState } from "react"

interface WebSocketMessage {
  data: string
  type: string
  target: WebSocket
}

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const webSocketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket(url)
    webSocketRef.current = socket

    // Connection opened
    socket.addEventListener("open", () => {
      setIsConnected(true)
      console.log("WebSocket connection established")
    })

    // Listen for messages
    socket.addEventListener("message", (event) => {
      const message = event as WebSocketMessage
      setLastMessage(message)
    })

    // Connection closed
    socket.addEventListener("close", () => {
      setIsConnected(false)
      console.log("WebSocket connection closed")
    })

    // Connection error
    socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error)
    })

    // Clean up on unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close()
      }
    }
  }, [url])

  // Function to send messages
  const sendMessage = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(data)
    } else {
      console.error("WebSocket is not connected")
    }
  }

  return { isConnected, lastMessage, sendMessage }
}

