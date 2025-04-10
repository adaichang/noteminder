"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Edit, MoreVertical, Trash, Video, Timer } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNotes } from "@/hooks/use-notes"
import type { Note } from "@/types/note"
import { NoteEditor } from "@/components/note-editor"
import { VideoEmbed } from "@/components/video-embed"
import { TimerPlayer } from "@/components/timer-player"
import { CalendarIntegration } from "@/components/calendar-integration"

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  const { deleteNote, toggleTodoItem } = useNotes()
  const [isEditing, setIsEditing] = useState(false)
  const [showTimerPlayer, setShowTimerPlayer] = useState(false)
  const [showCalendarIntegration, setShowCalendarIntegration] = useState(false)

  if (isEditing) {
    return <NoteEditor note={note} onClose={() => setIsEditing(false)} />
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger if the click is directly on the card or specific elements
    // Don't trigger if clicking on checkboxes, buttons, or dropdown
    const target = e.target as HTMLElement
    const isCheckbox = target.closest('input[type="checkbox"]')
    const isButton = target.closest("button")
    const isTimerPlayer = target.closest(".timer-player")
    const isVideoPlayer = target.closest(".video-player")

    if (!isCheckbox && !isButton && !isTimerPlayer && !isVideoPlayer) {
      setIsEditing(true)
    }
  }

  // Format timer display
  const formatTimer = () => {
    if (!note.timer) return null

    const minutes = Math.floor(note.timer.duration / 60)
    const seconds = note.timer.duration % 60
    const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`

    return `${timeDisplay} × ${note.timer.sets} sets × ${note.timer.repetitions} reps`
  }

  const toggleTimerPlayer = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowTimerPlayer(!showTimerPlayer)
  }

  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowCalendarIntegration(true)
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{note?.title || "Untitled Note"}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  deleteNote(note.id)
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        {note.content && <p className="text-sm text-muted-foreground mb-3">{note.content}</p>}

        {note.videoUrl && (
          <div className="mb-3 video-player" onClick={(e) => e.stopPropagation()}>
            <VideoEmbed url={note.videoUrl} showThumbnail={true} />
          </div>
        )}

        {note.timer && note.timer.active && (
          <div className="mb-3">
            <div
              className="flex items-center justify-between gap-2 text-sm bg-muted p-2 rounded cursor-pointer"
              onClick={toggleTimerPlayer}
            >
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span>{formatTimer()}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleTimerPlayer}>
                {showTimerPlayer ? "Hide" : "Show"}
              </Button>
            </div>

            {showTimerPlayer && (
              <div className="mt-2 p-3 border rounded timer-player" onClick={(e) => e.stopPropagation()}>
                <TimerPlayer timer={note.timer} />
              </div>
            )}
          </div>
        )}

        {note.todos?.length > 0 && (
          <div className="space-y-1">
            {note.todos.map((todo) => (
              <div key={todo.id} className="flex items-center space-x-2">
                <Checkbox
                  id={todo.id}
                  checked={todo.completed}
                  onCheckedChange={(e) => {
                    e.stopPropagation()
                    toggleTodoItem(note.id, todo.id)
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <label
                  htmlFor={todo.id}
                  className={`text-sm ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {todo.text}
                </label>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            {format(new Date(note.createdAt), "MMM d, yyyy")}
          </div>
          {note.reminder && (
            <div className="flex items-center gap-1">
              <Clock className="mr-1 h-3 w-3" />
              <span>{format(new Date(note.reminder), "MMM d, h:mm a")}</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1" onClick={handleAddToCalendar}>
                <Calendar className="h-3 w-3" />
              </Button>
            </div>
          )}
          {note.videoUrl && (
            <div className="flex items-center">
              <Video className="mr-1 h-3 w-3" />
              Video
            </div>
          )}
          {note.timer?.active && (
            <div className="flex items-center">
              <Timer className="mr-1 h-3 w-3" />
              Timer
            </div>
          )}
        </div>
      </CardFooter>

      {showCalendarIntegration && note.reminder && (
        <CalendarIntegration
          title={note.title || "Untitled Note"}
          description={note.content}
          startDate={new Date(note.reminder)}
          onClose={() => setShowCalendarIntegration(false)}
        />
      )}
    </Card>
  )
}
