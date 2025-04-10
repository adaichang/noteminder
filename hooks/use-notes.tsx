"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Note } from "@/types/note"

interface NotesContextType {
  notes: Note[]
  filteredNotes: Note[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  createNote: (note?: Note) => void
  updateNote: (note: Note) => void
  deleteNote: (id: string) => void
  toggleTodoItem: (noteId: string, todoId: string) => void
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

const STORAGE_KEY = "notesminder_notes"

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)

  // Load notes from localStorage on initial render
  useEffect(() => {
    const loadNotes = () => {
      try {
        const savedNotes = localStorage.getItem(STORAGE_KEY)
        if (savedNotes) {
          const parsedNotes = JSON.parse(savedNotes)
          if (Array.isArray(parsedNotes)) {
            // Process any date objects that were serialized
            const processedNotes = parsedNotes.map((note) => {
              // Process reminder date if it exists
              if (note.reminder && typeof note.reminder === "string") {
                try {
                  // Keep as string, will be converted to Date when needed
                  const date = new Date(note.reminder)
                  if (isNaN(date.getTime())) {
                    note.reminder = undefined
                  }
                } catch (e) {
                  note.reminder = undefined
                }
              }
              return note
            })
            setNotes(processedNotes)
          }
        }
      } catch (error) {
        console.error("Failed to parse saved notes:", error)
      }
      setIsInitialized(true)
    }

    loadNotes()
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    }
  }, [notes, isInitialized])

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase()
    return (
      (note.title?.toLowerCase() || "").includes(query) ||
      (note.content?.toLowerCase() || "").includes(query) ||
      (note.tags || []).some((tag) => (tag?.toLowerCase() || "").includes(query)) ||
      (note.todos || []).some((todo) => (todo?.text?.toLowerCase() || "").includes(query))
    )
  })

  // Create a new note
  const createNote = (note?: Note) => {
    const newNote: Note = {
      id: note?.id || crypto.randomUUID(),
      title: note?.title || "",
      content: note?.content || "",
      todos: note?.todos || [],
      tags: note?.tags || [],
      videoUrl: note?.videoUrl || "",
      timer: note?.timer,
      reminder: note?.reminder,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes((prevNotes) => [newNote, ...prevNotes])
    return newNote
  }

  // Update an existing note
  const updateNote = (updatedNote: Note) => {
    setNotes((prevNotes) => prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note)))
  }

  // Delete a note
  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
  }

  // Toggle a todo item's completed status
  const toggleTodoItem = (noteId: string, todoId: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === noteId) {
          return {
            ...note,
            todos: note.todos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)),
          }
        }
        return note
      }),
    )
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        filteredNotes,
        searchQuery,
        setSearchQuery,
        createNote,
        updateNote,
        deleteNote,
        toggleTodoItem,
        setNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider")
  }
  return context
}
