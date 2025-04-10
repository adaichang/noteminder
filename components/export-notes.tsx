"use client"

import { useState } from "react"
import { Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNotes } from "@/hooks/use-notes"
import { useToast } from "@/hooks/use-toast"
import { GoogleDriveIntegration } from "./google-drive-integration"

export function ExportNotes() {
  const { notes } = useNotes()
  const { toast } = useToast()
  const [showGoogleDrive, setShowGoogleDrive] = useState(false)

  // Function to download notes as JSON
  const downloadAsJson = () => {
    try {
      // Ensure all date objects are properly serialized
      const processedNotes = notes.map((note) => ({
        ...note,
        // Convert any Date objects to ISO strings
        reminder: note.reminder instanceof Date ? note.reminder.toISOString() : note.reminder,
      }))

      // Convert notes to a JSON string with pretty formatting
      const jsonString = JSON.stringify(processedNotes, null, 2)

      // Create a blob from the JSON string
      const blob = new Blob([jsonString], { type: "application/json" })

      // Create a URL for the blob
      const url = URL.createObjectURL(blob)

      // Create a temporary anchor element
      const a = document.createElement("a")
      a.href = url
      a.download = `notesminder-export-${new Date().toISOString().split("T")[0]}.json`

      // Trigger the download
      document.body.appendChild(a)
      a.click()

      // Clean up
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: `${notes.length} notes exported as JSON`,
      })
    } catch (error) {
      console.error("Error exporting notes:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your notes",
        variant: "destructive",
      })
    }
  }

  // Function to export to Google Drive
  const exportToGoogleDrive = () => {
    setShowGoogleDrive(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Notes
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={downloadAsJson}>
            <Download className="mr-2 h-4 w-4" />
            Download as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToGoogleDrive}>
            <Upload className="mr-2 h-4 w-4" />
            Export to Google Drive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showGoogleDrive && <GoogleDriveIntegration notes={notes} onClose={() => setShowGoogleDrive(false)} />}
    </>
  )
}
