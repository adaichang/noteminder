"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Play, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoEmbedProps {
  url: string
  showThumbnail?: boolean
}

export function VideoEmbed({ url, showThumbnail = false }: VideoEmbedProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(!showThumbnail)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const [videoType, setVideoType] = useState<"youtube" | "vimeo" | "instagram" | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // YouTube URL patterns (including playlists)
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|.*[?&]list=)|youtu\.be\/)([^"&?/\s]{11})?(?:.*[?&]list=([^"&?/\s]+))?/
    const youtubeMatch = url.match(youtubeRegex)

    // Vimeo URL patterns
    const vimeoRegex =
      /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?))/
    const vimeoMatch = url.match(vimeoRegex)

    // Instagram URL patterns (reels, posts)
    const instagramRegex = /(?:instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+))/
    const instagramMatch = url.match(instagramRegex)

    if (youtubeMatch) {
      const videoId = youtubeMatch[1]
      const playlistId = youtubeMatch[2]

      setVideoId(videoId || null)
      setPlaylistId(playlistId || null)
      setVideoType("youtube")

      // Create embed URL based on what we have
      if (playlistId) {
        // If we have a playlist ID
        const embedBase = videoId
          ? `https://www.youtube.com/embed/${videoId}?list=${playlistId}`
          : `https://www.youtube.com/embed/videoseries?list=${playlistId}`

        setEmbedUrl(`${embedBase}&autoplay=${isPlaying ? 1 : 0}&rel=0`)

        // For playlists without a specific video, use a default thumbnail
        if (videoId) {
          setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
        } else {
          setThumbnailUrl(`/placeholder.svg?height=480&width=640`)
        }
      } else if (videoId) {
        // Just a single video
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&rel=0`)
        setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
      }
    } else if (vimeoMatch && vimeoMatch[1]) {
      const id = vimeoMatch[1]
      setVideoId(id)
      setVideoType("vimeo")
      setEmbedUrl(`https://player.vimeo.com/video/${id}?autoplay=${isPlaying ? 1 : 0}`)

      // For this demo, we'll use a placeholder for Vimeo thumbnails
      setThumbnailUrl(`/placeholder.svg?height=480&width=640`)
    } else if (instagramMatch && instagramMatch[1]) {
      const id = instagramMatch[1]
      setVideoId(id)
      setVideoType("instagram")

      // Instagram embeds work differently - they use their oEmbed API
      // For our purposes, we'll use their embed code format
      setEmbedUrl(`https://www.instagram.com/p/${id}/embed/`)
      setThumbnailUrl(`/placeholder.svg?height=480&width=480`)
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
        const baseUrl = playlistId
          ? `https://www.youtube.com/embed/${videoId || "videoseries"}?list=${playlistId}`
          : `https://www.youtube.com/embed/${videoId}`

        setEmbedUrl(`${baseUrl}&autoplay=${isPlaying ? 1 : 0}&rel=0`)
      } else if (videoType === "vimeo") {
        setEmbedUrl(`https://player.vimeo.com/video/${videoId}?autoplay=${isPlaying ? 1 : 0}`)
      }
      // Instagram embeds don't support autoplay parameter changes
    }
  }, [isPlaying, videoId, videoType, playlistId])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const openOriginalLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(url, "_blank")
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
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
          onClick={openOriginalLink}
        >
          <ExternalLink className="h-4 w-4 text-white" />
        </Button>
      </div>
    )
  }

  // Special handling for Instagram embeds
  if (videoType === "instagram") {
    return (
      <div className="instagram-embed rounded-md overflow-hidden border">
        <iframe
          src={embedUrl}
          className="w-full"
          style={{ minHeight: "500px" }}
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
        ></iframe>
      </div>
    )
  }

  // YouTube and Vimeo embeds
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
