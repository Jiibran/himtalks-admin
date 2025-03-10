"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function AuthSuccessPage() {
  const router = useRouter()
  const { refreshAuthStatus } = useAuth()

  useEffect(() => {
    const handleAuthSuccess = async () => {
      // Refresh auth status to get the user info from the cookie
      await refreshAuthStatus()
      
      // Redirect to the messages page
      router.push("/messages")
    }

    handleAuthSuccess()
  }, [router, refreshAuthStatus])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Authentication successful. Redirecting...</p>
    </div>
  )
}
