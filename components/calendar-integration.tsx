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
import { Download, Loader2, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

interface CalendarIntegrationProps {
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  onClose: () => void
}

export function CalendarIntegration({ title, description, startDate, endDate, onClose }: CalendarIntegrationProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Generate an .ics file for calendar import
  const generateICSFile = () => {
    setIsGenerating(true)

    try {
      // Calculate end time (default to 1 hour after start)
      const end = endDate || new Date(startDate.getTime() + 60 * 60 * 1000)

      // Format dates for iCalendar format (YYYYMMDDTHHmmssZ)
      const formatDate = (date: Date) => {
        return date
          .toISOString()
          .replace(/-|:|\.\d+/g, "")
          .replace("Z", "")
      }

      const startFormatted = formatDate(startDate)
      const endFormatted = formatDate(end)

      // Create iCalendar content
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `SUMMARY:${title}`,
        description ? `DESCRIPTION:${description.replace(/\n/g, "\\n")}` : "",
        `DTSTART:${startFormatted}`,
        `DTEND:${endFormatted}`,
        `DTSTAMP:${formatDate(new Date())}`,
        `UID:${crypto.randomUUID()}@notesminder.app`,
        "STATUS:CONFIRMED",
        "SEQUENCE:0",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n")

      // Create a blob and download link
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${title.replace(/\s+/g, "-")}-reminder.ics`)
      document.body.appendChild(link)

      // Simulate a delay for better UX
      setTimeout(() => {
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        setIsGenerating(false)
        setIsSuccess(true)

        toast({
          title: "Calendar event created",
          description: "The event has been downloaded and can be imported to your calendar",
        })
      }, 1000)
    } catch (error) {
      console.error("Error generating calendar event:", error)
      setIsGenerating(false)
      toast({
        title: "Failed to create calendar event",
        description: "There was an error generating the calendar event",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Calendar</DialogTitle>
          <DialogDescription>
            {isSuccess ? "Calendar event has been created successfully." : "Create a calendar event for this reminder."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {!isSuccess ? (
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <div className="font-medium">{title}</div>
                <div className="text-sm text-muted-foreground mt-1">{format(startDate, "PPP 'at' h:mm a")}</div>
                {description && <div className="text-sm mt-2 line-clamp-2">{description}</div>}
              </div>

              <Button className="w-full" onClick={generateICSFile} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Calendar Event
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <div className="text-center">
                <p className="font-medium">Calendar Event Created</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Import the downloaded file to add this event to your calendar
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant={isSuccess ? "default" : "outline"} onClick={onClose}>
            {isSuccess ? "Done" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
