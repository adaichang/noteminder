"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotes } from "@/hooks/use-notes"

export function CreateNoteButton() {
  const { createNote } = useNotes()

  return (
    <Button onClick={createNote}>
      <Plus className="mr-2 h-4 w-4" />
      New Note
    </Button>
  )
}
