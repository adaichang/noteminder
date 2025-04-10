"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useNotes } from "@/hooks/use-notes"

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useNotes()

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search notes..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}
