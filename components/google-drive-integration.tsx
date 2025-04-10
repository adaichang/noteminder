"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Google } from "./icons/google"
import { Loader2, CheckCircle2, FileText } from "lucide-react"
import type { Note } from "@/types/note"

interface GoogleDriveIntegrationProps {
  notes: Note[]
  onClose: () => void
}

export function GoogleDriveIntegration({ notes, onClose }: GoogleDriveIntegrationProps) {
  const { toast } = useToast()
  const [step, setStep] = useState<"auth" | "uploading" | "success">("auth")
  const [isLoading, setIsLoading] = useState(false)

  // Simulate Google authentication
  const handleAuth = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would redirect to Google's OAuth page
      // For this demo, we'll simulate the auth flow with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStep("uploading")

      // Simulate file upload process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setStep("success")
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Could not connect to Google Drive. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (step === "success") {
      toast({
        title: "Notes exported to Google Drive",
        description: `${notes.length} notes have been saved to your Google Drive.`,
      })
    }
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export to Google Drive</DialogTitle>
          <DialogDescription>
            {step === "auth" && "Connect to your Google Drive account to export your notes."}
            {step === "uploading" && "Uploading your notes to Google Drive..."}
            {step === "success" && "Your notes have been successfully exported to Google Drive."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4">
          {step === "auth" && (
            <Button variant="outline" className="w-full" onClick={handleAuth} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Google className="mr-2 h-4 w-4" />
                  Sign in with Google
                </>
              )}
            </Button>
          )}

          {step === "uploading" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium">Uploading notes to Google Drive</p>
                <p className="text-sm text-muted-foreground">This may take a moment...</p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div className="text-center">
                <p className="font-medium">Export Complete</p>
                <p className="text-sm text-muted-foreground">
                  {notes.length} notes have been saved to your Google Drive
                </p>
              </div>
              <div className="mt-2 border rounded-md p-3 w-full">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">NoteMinder Export</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString()} • {(notes.length * 2.5).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end">
          {step === "auth" && (
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
          )}

          {step === "uploading" && (
            <Button variant="ghost" onClick={handleClose} disabled>
              Cancel
            </Button>
          )}

          {step === "success" && <Button onClick={handleClose}>Done</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
