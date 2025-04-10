"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Timer } from "@/types/note"

interface TimerPlayerProps {
  timer: Timer
}

export function TimerPlayer({ timer }: TimerPlayerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTime, setCurrentTime] = useState(timer.duration)
  const [currentSet, setCurrentSet] = useState(1)
  const [currentRep, setCurrentRep] = useState(1)
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Reset timer when timer prop changes
  useEffect(() => {
    resetTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startTimer = () => {
    if (isRunning) return

    setIsRunning(true)

    intervalRef.current = setInterval(() => {
      setCurrentTime((prevTime) => {
        if (prevTime <= 1) {
          // Timer for current set completed
          const newSet = currentSet + 1

          if (newSet > timer.sets) {
            // All sets completed for this rep
            const newRep = currentRep + 1

            if (newRep > timer.repetitions) {
              // All reps completed
              clearInterval(intervalRef.current!)
              setIsRunning(false)
              return 0
            } else {
              // Start next rep
              setCurrentRep(newRep)
              setCurrentSet(1)
              return timer.duration
            }
          } else {
            // Start next set
            setCurrentSet(newSet)
            return timer.duration
          }
        }

        return prevTime - 1
      })
    }, 1000)
  }

  const pauseTimer = () => {
    if (!isRunning) return

    clearInterval(intervalRef.current!)
    setIsRunning(false)
  }

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    setIsRunning(false)
    setCurrentTime(timer.duration)
    setCurrentSet(1)
    setCurrentRep(1)
    setProgress(100)
  }

  // Update progress bar
  useEffect(() => {
    setProgress((currentTime / timer.duration) * 100)
  }, [currentTime, timer.duration])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div>
          <span className="font-medium">{formatTime(currentTime)}</span>
        </div>
        <div className="text-muted-foreground">
          Set {currentSet}/{timer.sets} • Rep {currentRep}/{timer.repetitions}
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex justify-center gap-2 mt-2">
        <Button variant="outline" size="sm" className="w-24" onClick={isRunning ? pauseTimer : startTimer}>
          {isRunning ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              {currentTime === timer.duration && currentSet === 1 && currentRep === 1 ? "Start" : "Resume"}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetTimer}
          disabled={currentTime === timer.duration && currentSet === 1 && currentRep === 1}
        >
          <Square className="mr-2 h-4 w-4" />
          Stop
        </Button>
      </div>
    </div>
  )
}
