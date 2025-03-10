"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function AuthSuccessPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect to main application page
        router.push("/messages")
      } else {
        // Auth failed, redirect to login
        router.push("/login")
      }
    }
  }, [isLoading, isAuthenticated, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Processing authentication... Please wait.</p>
    </div>
  )
}
