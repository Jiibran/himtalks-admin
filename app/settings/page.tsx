"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BlacklistWord {
  id: string;
  word: string;
}

export default function SettingsPage() {
  const [blacklistedWords, setBlacklistedWords] = useState<BlacklistWord[]>([])
  const [songfessDays, setSongfessDays] = useState<string>("")
  const [newWord, setNewWord] = useState("")
  const [loading, setLoading] = useState(true)
  const [addingWord, setAddingWord] = useState(false)
  const [removingWordId, setRemovingWordId] = useState<string | null>(null)
  const [updatingSongfessDays, setUpdatingSongfessDays] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, isAdmin } = useAuth()

  const fetchBlacklistedWords = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://api.teknohive.me/api/admin/blacklist", {
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch blacklisted words")
      }

      const wordsList = await response.json()
      setBlacklistedWords(Array.isArray(wordsList) ? wordsList : [])
    } catch (error) {
      console.error("Error fetching blacklisted words:", error)
      toast({
        title: "Error",
        description: "Failed to load blacklisted words. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchSongfessDays = async () => {
    try {
      const response = await fetch("https://api.teknohive.me/api/admin/configSongfessDays", {
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch songfess days")
      }

      const data = await response.json()
      setSongfessDays(data.days || "")
    } catch (error) {
      console.error("Error fetching songfess days:", error)
    }
  }

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchBlacklistedWords()
      fetchSongfessDays()
    } else if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/")
    }
  }, [isAuthenticated, isAdmin, router])

  const handleAddBlacklistWord = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newWord.trim()) {
      toast({
        title: "Error",
        description: "Word is required",
        variant: "destructive"
      })
      return
    }

    try {
      setAddingWord(true)
      const response = await fetch("https://api.teknohive.me/api/admin/blacklist", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ word: newWord })
      })

      if (!response.ok) {
        throw new Error("Failed to add blacklist word")
      }

      toast({
        title: "Success",
        description: "Word added to blacklist successfully"
      })
      
      setNewWord("")
      fetchBlacklistedWords()
    } catch (error) {
      console.error("Error adding blacklist word:", error)
      toast({
        title: "Error",
        description: "Failed to add blacklist word. Please try again.",
        variant: "destructive"
      })
    } finally {
      setAddingWord(false)
    }
  }

  const handleRemoveBlacklistWord = async (word: string) => {
    try {
      setRemovingWordId(word)
      const response = await fetch("https://api.teknohive.me/api/admin/blacklist/remove", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ word })
      })

      if (!response.ok) {
        throw new Error("Failed to remove blacklist word")
      }

      const result = await response.json()
      toast({
        title: "Success",
        description: result.message || "Word removed successfully"
      })

      fetchBlacklistedWords()
    } catch (error) {
      console.error("Error removing blacklist word:", error)
      toast({
        title: "Error",
        description: "Failed to remove blacklist word. Please try again.",
        variant: "destructive"
      })
    } finally {
      setRemovingWordId(null)
    }
  }

  const handleUpdateSongfessDays = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!songfessDays.trim()) {
      toast({
        title: "Error",
        description: "Number of days is required",
        variant: "destructive"
      })
      return
    }

    try {
      setUpdatingSongfessDays(true)
      const response = await fetch("https://api.teknohive.me/api/admin/configSongfessDays", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ days: songfessDays })
      })

      if (!response.ok) {
        throw new Error("Failed to update songfess days")
      }

      toast({
        title: "Success",
        description: "Songfess days limit updated successfully"
      })
    } catch (error) {
      console.error("Error updating songfess days:", error)
      toast({
        title: "Error",
        description: "Failed to update songfess days. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUpdatingSongfessDays(false)
    }
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure system parameters and restrictions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="songfess">
            <TabsList className="mb-4">
              <TabsTrigger value="songfess">Songfess Settings</TabsTrigger>
              <TabsTrigger value="blacklist">Blacklist Words</TabsTrigger>
            </TabsList>
            
            <TabsContent value="songfess">
              <Card>
                <CardHeader>
                  <CardTitle>Songfess Duration</CardTitle>
                  <CardDescription>Set the number of days songfess will be available</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateSongfessDays} className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Number of days"
                      value={songfessDays}
                      onChange={(e) => setSongfessDays(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={updatingSongfessDays}>
                      {updatingSongfessDays ? "Updating..." : "Update"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="blacklist">
              <Card>
                <CardHeader>
                  <CardTitle>Blacklisted Words</CardTitle>
                  <CardDescription>Add or remove words that will be filtered from messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddBlacklistWord} className="flex gap-2 mb-6">
                    <Input
                      type="text"
                      placeholder="New blacklisted word"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={addingWord}>
                      {addingWord ? "Adding..." : "Add Word"}
                    </Button>
                  </form>

                  {loading ? (
                    <div className="text-center py-4">Loading blacklisted words...</div>
                  ) : blacklistedWords.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No blacklisted words found.</div>
                  ) : (
                    <div className="space-y-2">
                      {blacklistedWords.map((item) => (
                        <div
                          key={item.id || item.word}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                        >
                          <div className="font-medium">{item.word}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveBlacklistWord(item.word)}
                            disabled={removingWordId === item.word}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {removingWordId === item.word ? "Removing..." : "Remove"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}