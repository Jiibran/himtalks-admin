"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { LoginModalProvider } from "@/hooks/use-login-modal"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LoginModalProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SidebarProvider>
            {children}
            <Toaster />
          </SidebarProvider>
        </ThemeProvider>
      </LoginModalProvider>
    </AuthProvider>
  )
}

