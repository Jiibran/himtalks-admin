"use client"

import type { Songfess } from "@/types/songfess"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Music, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { deleteSongfess } from "@/services/api"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useLoginModal } from "@/hooks/use-login-modal"

interface SongfessListProps {
  songfess: Songfess[]
  onDelete: (id: string) => void
}

export default function SongfessList({ songfess, onDelete }: SongfessListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const { showLoginModal } = useLoginModal()

  if (songfess.length === 0) {
    return <div className="text-center py-8">No songfess found</div>
  }

  const handleDelete = async (id: string) => {
    if (!isAuthenticated) {
      showLoginModal("You need to sign in to delete songfess")
      return
    }

    try {
      setDeletingId(id)
      await deleteSongfess(id)
      onDelete(id)
      toast({
        title: "Success",
        description: "Songfess deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete songfess",
        variant: "destructive",
      })
      console.error("Error deleting songfess:", error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {songfess.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{item.songTitle}</CardTitle>
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-muted-foreground" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete songfess</span>
                </Button>
              </div>
            </div>
            <CardDescription>By {item.artist}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{item.message}</p>
            {item.dedicatedTo && (
              <p className="text-sm mt-2">
                <span className="font-medium">Dedicated to:</span> {item.dedicatedTo}
              </p>
            )}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

