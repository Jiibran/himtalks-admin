"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  sub: string
  email: string
  name: string
  picture: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: () => void
  logout: () => void
  refreshAuthStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("https://api.teknohive.me/api/protected", {
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Auth status check error:", error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const login = () => {
    // Redirect to the external Google login URL
    window.location.href = "https://api.teknohive.me/auth/google/login"
  }

  const logout = async () => {
    try {
      await fetch("https://api.teknohive.me/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      // Clear local state
      setUser(null)
      setIsAuthenticated(false)

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin: user?.isAdmin || false,
    login,
    logout,
    refreshAuthStatus: checkAuthStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

