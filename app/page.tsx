import { NoteList } from "@/components/note-list"
import { CreateNoteButton } from "@/components/create-note-button"
import { SearchBar } from "@/components/search-bar"
import { ExportNotes } from "@/components/export-notes"
import { ImportNotes } from "@/components/import-notes"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NoteMinder</h1>
        <p className="text-muted-foreground">Your all-in-one note taking solution</p>
      </header>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar />
          <div className="flex gap-2">
            <ImportNotes />
            <ExportNotes />
            <CreateNoteButton />
          </div>
        </div>

        <NoteList />
      </div>
    </div>
  )
}
