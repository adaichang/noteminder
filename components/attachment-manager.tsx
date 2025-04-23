"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Paperclip, Link2, X, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Attachment {
  id: string
  type: "file" | "link"
  name: string
  url: string
  size?: number
  fileType?: string
}

interface AttachmentManagerProps {
  attachments: Attachment[]
  onChange: (attachments: Attachment[]) => void
}

export function AttachmentManager({ attachments, onChange }: AttachmentManagerProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkName, setLinkName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddLink = () => {
    if (!linkUrl.trim()) return

    // Basic URL validation
    let url = linkUrl.trim()
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url
    }

    const name = linkName.trim() || new URL(url).hostname.replace(/^www\./, "")

    const newAttachment: Attachment = {
      id: crypto.randomUUID(),
      type: "link",
      name,
      url,
    }

    onChange([...attachments, newAttachment])
    setLinkUrl("")
    setLinkName("")
    setShowLinkInput(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newAttachments: Attachment[] = [...attachments]

    Array.from(files).forEach((file) => {
      // Create a blob URL for the file
      const url = URL.createObjectURL(file)

      newAttachments.push({
        id: crypto.randomUUID(),
        type: "file",
        name: file.name,
        url,
        size: file.size,
        fileType: file.type,
      })
    })

    onChange(newAttachments)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveAttachment = (id: string) => {
    const updatedAttachments = attachments.filter((attachment) => attachment.id !== id)
    onChange(updatedAttachments)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {attachments.map((attachment) => (
          <Badge
            key={attachment.id}
            variant="secondary"
            className={cn(
              "flex items-center gap-1 py-1 px-2",
              attachment.type === "link" ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "",
            )}
          >
            {attachment.type === "file" ? <File className="h-3 w-3" /> : <Link2 className="h-3 w-3" />}
            <span className="truncate max-w-[150px]">{attachment.name}</span>
            {attachment.size && <span className="text-xs opacity-70">({formatFileSize(attachment.size)})</span>}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 p-0"
              onClick={() => handleRemoveAttachment(attachment.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      {showLinkInput ? (
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Paste URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Link name (optional)"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddLink} disabled={!linkUrl.trim()}>
              Add Link
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowLinkInput(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="flex-1">
            <Paperclip className="mr-2 h-4 w-4" />
            Attach File
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowLinkInput(true)} className="flex-1">
            <Link2 className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </div>
      )}
    </div>
  )
}
