import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { NotesProvider } from "@/hooks/use-notes"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NoteMinder - Note Taking App",
  description: "A powerful note taking app with tasks, reminders, and planning features",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NotesProvider>{children}</NotesProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'