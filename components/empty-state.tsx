import { FileText } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileText className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No notes found</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        Get started by creating your first note or try a different search term.
      </p>
    </div>
  )
}
