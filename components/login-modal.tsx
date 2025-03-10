"use client"

import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
}

export function LoginModal({ isOpen, onClose, message = "Please sign in to continue" }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleGoogleLogin = () => {
    setIsLoading(true)
    try {
      login()
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Sign in required</DialogTitle>
          <DialogDescription className="text-center">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        <Alert variant="warning" className="my-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Only emails ending with @student.unsika.ac.id are allowed
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col gap-4 py-4">
          <Button 
            variant="outline" 
            onClick={handleGoogleLogin} 
            disabled={isLoading} 
            className="w-full flex items-center justify-center gap-2"
          >
            <FcGoogle className="h-5 w-5" />
            {isLoading ? "Connecting..." : "Continue with Google"}
          </Button>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="w-full sm:w-auto"
          >
            Continue as Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
