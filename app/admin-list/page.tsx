"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Trash2 } from "lucide-react"

interface Admin {
  id: string;
  email: string;
}

export default function AdminListPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [addingAdmin, setAddingAdmin] = useState(false)
  const [removingAdminId, setRemovingAdminId] = useState<string | null>(null)
  
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, isAdmin } = useAuth()

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://api.teknohive.me/api/admin/list", {
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch admins")
      }

      const adminList = await response.json()
      setAdmins(Array.isArray(adminList) ? adminList : [])
    } catch (error) {
      console.error("Error fetching admins:", error)
      toast({
        title: "Error",
        description: "Failed to load admin list. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchAdmins()
    } else if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/")
    }
  }, [isAuthenticated, isAdmin, router])

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive"
      })
      return
    }

    try {
      setAddingAdmin(true)
      const response = await fetch("https://api.teknohive.me/api/admin/addAdmin", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        throw new Error("Failed to add admin")
      }

      toast({
        title: "Success",
        description: "Admin added successfully"
      })
      
      setEmail("")
      fetchAdmins()
    } catch (error) {
      console.error("Error adding admin:", error)
      toast({
        title: "Error",
        description: "Failed to add admin. Please try again.",
        variant: "destructive"
      })
    } finally {
      setAddingAdmin(false)
    }
  }

  const handleRemoveAdmin = async (adminId: string) => {
    try {
      setRemovingAdminId(adminId)
      const response = await fetch("https://api.teknohive.me/api/admin/removeAdmin", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: adminId })
      })

      if (!response.ok) {
        throw new Error("Failed to remove admin")
      }

      const result = await response.json()
      toast({
        title: "Success",
        description: result.message || "Admin removed successfully"
      })

      fetchAdmins()
    } catch (error) {
      console.error("Error removing admin:", error)
      toast({
        title: "Error",
        description: "Failed to remove admin. Please try again.",
        variant: "destructive"
      })
    } finally {
      setRemovingAdminId(null)
    }
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Management</CardTitle>
          <CardDescription>Add or remove admin users</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="flex gap-2 mb-6">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={addingAdmin}>
              {addingAdmin ? "Adding..." : "Add Admin"}
            </Button>
          </form>

          {loading ? (
            <div className="text-center py-4">Loading admins...</div>
          ) : admins.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No admins found.</div>
          ) : (
            <div className="space-y-2">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                >
                  <div className="font-medium">{admin.email}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveAdmin(admin.id)}
                    disabled={removingAdminId === admin.id}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {removingAdminId === admin.id ? "Removing..." : "Remove"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}