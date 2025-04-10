"use client"

import { useState, useRef, useEffect } from "react"
import { CalendarIcon, Plus, X, Clock } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePicker } from "@/components/ui/time-picker"
import { useNotes } from "@/hooks/use-notes"
import { TimerSettings } from "@/components/timer-settings"
import { VideoEmbed } from "@/components/video-embed"
import { CalendarIntegration } from "@/components/calendar-integration"
import type { Note, TodoItem, Timer } from "@/types/note"
import { cn } from "@/lib/utils"

interface NoteEditorProps {
  note?: Note
  onClose: () => void
}

export function NoteEditor({ note, onClose }: NoteEditorProps) {
  const { updateNote, createNote } = useNotes()
  const isEditing = !!note
  const titleInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [todos, setTodos] = useState<TodoItem[]>(note?.todos || [])
  const [newTodo, setNewTodo] = useState("")
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [videoUrl, setVideoUrl] = useState(note?.videoUrl || "")
  const [timer, setTimer] = useState<Timer | undefined>(note?.timer)
  const [reminder, setReminder] = useState<Date | undefined>(note?.reminder ? new Date(note.reminder) : undefined)
  const [videoPreviewVisible, setVideoPreviewVisible] = useState(!!videoUrl)
  const [showCalendarIntegration, setShowCalendarIntegration] = useState(false)

  // Auto-focus the title input when opening the editor
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [])

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: crypto.randomUUID(), text: newTodo, completed: false }])
      setNewTodo("")
    }
  }

  const handleRemoveTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url)
    setVideoPreviewVisible(!!url)
  }

  const handleSave = () => {
    const updatedNote = {
      id: note?.id || crypto.randomUUID(),
      title,
      content,
      todos,
      tags,
      videoUrl,
      timer,
      reminder,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (isEditing) {
      updateNote(updatedNote)
    } else {
      createNote(updatedNote)
    }

    onClose()
  }

  const formatReminderDisplay = () => {
    if (!reminder) return "Set a reminder"

    // Format date and time
    return format(reminder, "PPP 'at' h:mm a")
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <Input
          ref={titleInputRef}
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold border-none px-0 focus-visible:ring-0"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Note content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px] resize-vertical"
        />

        <div>
          <label className="text-sm font-medium mb-1 block">Video URL</label>
          <Input
            placeholder="Paste YouTube or Vimeo URL"
            value={videoUrl}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
          />
          {videoPreviewVisible && videoUrl && (
            <div className="mt-2">
              <VideoEmbed url={videoUrl} showThumbnail={true} />
            </div>
          )}
        </div>

        <TimerSettings timer={timer} onChange={setTimer} />

        <div>
          <label className="text-sm font-medium mb-1 block">Tasks</label>
          <div className="space-y-2">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-2">
                <Checkbox
                  id={todo.id}
                  checked={todo.completed}
                  onCheckedChange={(checked) => {
                    setTodos(todos.map((t) => (t.id === todo.id ? { ...t, completed: !!checked } : t)))
                  }}
                />
                <Input
                  value={todo.text}
                  onChange={(e) => {
                    setTodos(todos.map((t) => (t.id === todo.id ? { ...t, text: e.target.value } : t)))
                  }}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveTodo(todo.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add a task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddTodo()
                  }
                }}
              />
              <Button onClick={handleAddTodo}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Tags</label>
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
                <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => handleRemoveTag(tag)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTag()
                }
              }}
            />
            <Button onClick={handleAddTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Reminder</label>
          <div className="flex flex-col gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !reminder && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatReminderDisplay()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={reminder}
                  onSelect={(date) => {
                    if (date) {
                      // Preserve time if there was a previous reminder
                      const newDate = new Date(date)
                      if (reminder) {
                        newDate.setHours(reminder.getHours())
                        newDate.setMinutes(reminder.getMinutes())
                      } else {
                        // Default to current time
                        const now = new Date()
                        newDate.setHours(now.getHours())
                        newDate.setMinutes(now.getMinutes())
                      }
                      setReminder(newDate)
                    } else {
                      setReminder(undefined)
                    }
                  }}
                  initialFocus
                />
                {reminder && (
                  <div className="p-3 border-t">
                    <TimePicker date={reminder} setDate={setReminder} />
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {reminder && (
              <Button variant="outline" size="sm" className="w-full" onClick={() => setShowCalendarIntegration(true)}>
                <Clock className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </CardFooter>

      {showCalendarIntegration && reminder && (
        <CalendarIntegration
          title={title || "Untitled Note"}
          description={content}
          startDate={reminder}
          onClose={() => setShowCalendarIntegration(false)}
        />
      )}
    </Card>
  )
}
