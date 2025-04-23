"use client"

import { File, Link2, ExternalLink, FileText, ImageIcon, Video, Music, Archive, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Attachment } from "@/components/attachment-manager"

interface AttachmentListProps {
  attachments: Attachment[]
  compact?: boolean
}

export function AttachmentList({ attachments, compact = false }: AttachmentListProps) {
  if (!attachments.length) return null

  const getFileIcon = (fileType: string | undefined) => {
    if (!fileType) return <File className="h-4 w-4" />

    if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (fileType.startsWith("video/")) return <Video className="h-4 w-4" />
    if (fileType.startsWith("audio/")) return <Music className="h-4 w-4" />
    if (fileType.startsWith("text/")) return <FileText className="h-4 w-4" />
    if (fileType.includes("zip") || fileType.includes("compressed")) return <Archive className="h-4 w-4" />
    if (fileType.includes("json") || fileType.includes("javascript") || fileType.includes("html"))
      return <Code className="h-4 w-4" />

    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return ""
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {attachments.map((attachment) => (
          <a
            key={attachment.id}
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            {attachment.type === "file" ? getFileIcon(attachment.fileType) : <Link2 className="h-3 w-3" />}
            <span className="truncate max-w-[100px]">{attachment.name}</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2 mt-3">
      <h4 className="text-sm font-medium">Attachments</h4>
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-center gap-2 text-sm">
            {attachment.type === "file" ? (
              <>
                {getFileIcon(attachment.fileType)}
                <span className="truncate flex-1">{attachment.name}</span>
                {attachment.size && (
                  <span className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</span>
                )}
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 text-blue-500" />
                <span className="truncate flex-1">{attachment.name}</span>
              </>
            )}
            <Button variant="ghost" size="icon" className="h-6 w-6" asChild onClick={(e) => e.stopPropagation()}>
              <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
