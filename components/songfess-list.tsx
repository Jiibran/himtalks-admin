"use client"

import type { Songfess } from "@/types/songfess"
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Music, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { deleteSongfess } from "@/services/api"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useLoginModal } from "@/hooks/use-login-modal"
import { formatSafeDate, formatExactDate } from "@/lib/date-utils"

interface SongfessListProps {
  songfess: Songfess[]
  onDelete: (id: string) => void
}

export default function SongfessList({ songfess, onDelete }: SongfessListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const { showLoginModal } = useLoginModal()

  const handleDelete = async (id: string) => {
    if (!isAuthenticated) {
      showLoginModal()
      return
    }

    try {
      setDeletingId(id)
      await deleteSongfess(id)
      onDelete(id)
      toast({
        title: "Songfess deleted",
        description: "The songfess has been successfully deleted."
      })
    } catch (error) {
      console.error("Failed to delete songfess:", error)
      toast({
        title: "Error",
        description: "Failed to delete songfess. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {songfess.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No songfess found.</div>
      ) : (
        songfess.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded overflow-hidden bg-gray-100">
                    {item.album_art ? (
                      <img 
                        src={item.album_art} 
                        alt={item.song_title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Music className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.song_title || "Unknown Song"}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.artist || "Unknown Artist"}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground" title={formatExactDate(item.created_at)}>
                  {formatSafeDate(item.created_at)}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm">{item.content}</p>
                <p className="text-xs text-muted-foreground">
                  From: {item.sender_name || "Anonymous"} • To: {item.recipient_name || "Unknown"}
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="bg-muted/50 p-2">
              <div className="flex w-full justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(item.id.toString())}
                  disabled={deletingId === item.id.toString()}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {deletingId === item.id.toString() ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

