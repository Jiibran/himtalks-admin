"use client"

import type { Message } from "@/types/message"
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { deleteMessage } from "@/services/api"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useLoginModal } from "@/hooks/use-login-modal"

interface MessageListProps {
  messages: Message[]
  onDelete: (id: string) => void
}

export default function MessageList({ messages, onDelete }: MessageListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const { showLoginModal } = useLoginModal()

  if (messages.length === 0) {
    return <div className="text-center py-8">No messages found</div>
  }

  const handleDelete = async (id: string) => {
    if (!isAuthenticated) {
      showLoginModal("You need to sign in to delete messages")
      return
    }

    try {
      setDeletingId(id)
      await deleteMessage(id)
      onDelete(id)
      toast({
        title: "Success",
        description: "Message deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      })
      console.error("Error deleting message:", error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={message.avatar || "/placeholder.svg?height=40&width=40"} alt={message.sender} />
                <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{message.sender}</h3>
                    <CardDescription>
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(message.id)}
                    disabled={deletingId === message.id}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete message</span>
                  </Button>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </CardContent>
          {message.attachment && (
            <CardFooter className="p-4 pt-0">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span>Attachment:</span>
                <a
                  href={message.attachment}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View attachment
                </a>
              </div>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}

