"use client"

import type React from "react"

import { useRef } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotes } from "@/hooks/use-notes"
import { useToast } from "@/hooks/use-toast"
import type { Note, Timer, TodoItem } from "@/types/note"

export function ImportNotes() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { notes, setNotes } = useNotes()
  const { toast } = useToast()

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsed = JSON.parse(content)

        // Handle different formats: array, object with notes array, or single note object
        let importedNotes: Note[]

        if (Array.isArray(parsed)) {
          // Format: array of notes
          importedNotes = parsed
        } else if (parsed && typeof parsed === "object") {
          if (Array.isArray(parsed.notes)) {
            // Format: { notes: [...] }
            importedNotes = parsed.notes
          } else if (parsed.id && typeof parsed.id === "string") {
            // Format: single note object
            importedNotes = [parsed]
          } else {
            throw new Error("Invalid format: Could not recognize note structure")
          }
        } else {
          throw new Error("Invalid format: Expected JSON object or array")
        }

        // Basic validation - ensure each note has at least an id
        const validNotes = importedNotes.filter((note) => {
          return note && typeof note === "object" && note.id && typeof note.id === "string"
        })

        if (validNotes.length === 0) {
          throw new Error("No valid notes found in the imported file")
        }

        // Process and validate each note
        const processedNotes = validNotes.map((note) => {
          // Process todos
          const todos: TodoItem[] = Array.isArray(note.todos)
            ? note.todos.map((todo) => ({
                id: todo.id || crypto.randomUUID(),
                text: todo.text || "",
                completed: !!todo.completed,
              }))
            : []

          // Process timer
          let timer: Timer | undefined = undefined
          if (note.timer && typeof note.timer === "object") {
            timer = {
              duration: typeof note.timer.duration === "number" ? note.timer.duration : 300,
              sets: typeof note.timer.sets === "number" ? note.timer.sets : 1,
              repetitions: typeof note.timer.repetitions === "number" ? note.timer.repetitions : 1,
              active: !!note.timer.active,
            }
          }

          // Process dates
          let reminder = note.reminder
          if (reminder && typeof reminder === "string") {
            // Ensure it's a valid date string
            const date = new Date(reminder)
            if (!isNaN(date.getTime())) {
              reminder = reminder
            } else {
              reminder = undefined
            }
          }

          // Return processed note
          return {
            id: note.id,
            title: note.title || "",
            content: note.content || "",
            todos,
            tags: Array.isArray(note.tags) ? note.tags.filter((tag) => typeof tag === "string") : [],
            videoUrl: typeof note.videoUrl === "string" ? note.videoUrl : "",
            reminder,
            timer,
            createdAt: typeof note.createdAt === "string" ? note.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        })

        // Merge with existing notes, avoiding duplicates
        const existingIds = new Set(notes.map((note) => note.id))
        const newNotes = processedNotes.filter((note) => !existingIds.has(note.id))

        // Replace existing notes with updated versions
        const updatedExistingNotes = processedNotes.filter((note) => existingIds.has(note.id))
        const unchangedNotes = notes.filter((note) => !updatedExistingNotes.some((n) => n.id === note.id))

        // Combine all notes
        setNotes([...unchangedNotes, ...updatedExistingNotes, ...newNotes])

        toast({
          title: "Import successful",
          description: `${newNotes.length} new note${newNotes.length === 1 ? "" : "s"} imported, ${updatedExistingNotes.length} updated`,
        })
      } catch (error) {
        console.error("Error importing notes:", error)
        toast({
          title: "Import failed",
          description: error instanceof Error ? error.message : "Invalid file format",
          variant: "destructive",
        })
      }
    }

    reader.readAsText(file)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
      <Button variant="outline" onClick={handleClick}>
        <Upload className="mr-2 h-4 w-4" />
        Import Notes
      </Button>
    </>
  )
}
