"use client"

import { useState, createContext, useContext, useCallback, useEffect } from "react"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/components/auth-provider"

interface LoginModalContextType {
  showLoginModal: (message?: string) => void
  hideLoginModal: () => void
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined)

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState<string>()
  const { isAuthenticated, isLoading } = useAuth()

  const showLoginModal = useCallback((message?: string) => {
    setMessage(message)
    setIsOpen(true)
  }, [])

  const hideLoginModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Show login modal automatically when the page loads if user is not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        showLoginModal("Please sign in with your student.unsika.ac.id email to access the application")
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [isLoading, isAuthenticated, showLoginModal])

  return (
    <LoginModalContext.Provider value={{ showLoginModal, hideLoginModal }}>
      {children}
      <LoginModal isOpen={isOpen} onClose={hideLoginModal} message={message} />
    </LoginModalContext.Provider>
  )
}

export function useLoginModal() {
  const context = useContext(LoginModalContext)
  if (context === undefined) {
    throw new Error("useLoginModal must be used within a LoginModalProvider")
  }
  return context
}
