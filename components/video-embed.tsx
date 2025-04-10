"use client"

import { useState, useEffect, useRef } from "react"
import { Play } from "lucide-react"

interface VideoEmbedProps {
  url: string
  showThumbnail?: boolean
}

export function VideoEmbed({ url, showThumbnail = false }: VideoEmbedProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(!showThumbnail)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [videoType, setVideoType] = useState<"youtube" | "vimeo" | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const youtubeMatch = url.match(youtubeRegex)

    // Vimeo URL patterns
    const vimeoRegex =
      /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?))/
    const vimeoMatch = url.match(vimeoRegex)

    if (youtubeMatch && youtubeMatch[1]) {
      const id = youtubeMatch[1]
      setVideoId(id)
      setVideoType("youtube")
      setEmbedUrl(`https://www.youtube.com/embed/${id}?autoplay=${isPlaying ? 1 : 0}`)
      setThumbnailUrl(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`)
    } else if (vimeoMatch && vimeoMatch[1]) {
      const id = vimeoMatch[1]
      setVideoId(id)
      setVideoType("vimeo")
      setEmbedUrl(`https://player.vimeo.com/video/${id}?autoplay=${isPlaying ? 1 : 0}`)

      // Fetch Vimeo thumbnail (in a real app, you'd use the Vimeo API)
      // For this demo, we'll use a placeholder
      setThumbnailUrl(`/placeholder.svg?height=480&width=640`)
    } else {
      setVideoId(null)
      setVideoType(null)
      setEmbedUrl(null)
      setThumbnailUrl(null)
    }
  }, [url, isPlaying])

  useEffect(() => {
    // Update embed URL when play state changes
    if (videoId && videoType) {
      if (videoType === "youtube") {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}`)
      } else if (videoType === "vimeo") {
        setEmbedUrl(`https://player.vimeo.com/video/${videoId}?autoplay=${isPlaying ? 1 : 0}`)
      }
    }
  }, [isPlaying, videoId, videoType])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  if (!embedUrl) {
    return <div className="bg-muted p-2 rounded text-xs text-muted-foreground">Invalid video URL: {url}</div>
  }

  if (showThumbnail && !isPlaying && thumbnailUrl) {
    return (
      <div className="relative rounded-md overflow-hidden cursor-pointer group" onClick={handlePlay}>
        <img src={thumbnailUrl || "/placeholder.svg"} alt="Video thumbnail" className="w-full h-auto object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/70 rounded-full p-3">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-md">
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded video"
      />
    </div>
  )
}
