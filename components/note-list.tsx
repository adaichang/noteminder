"use client"

import { useNotes } from "@/hooks/use-notes"
import { NoteCard } from "@/components/note-card"
import { EmptyState } from "@/components/empty-state"

export function NoteList() {
  const { filteredNotes } = useNotes()

  if (filteredNotes.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredNotes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}
