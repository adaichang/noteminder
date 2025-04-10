"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function TimePicker({ date, setDate, className }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null)
  const hourRef = React.useRef<HTMLInputElement>(null)
  const secondRef = React.useRef<HTMLInputElement>(null)
  const [isPm, setIsPm] = React.useState<boolean>(false)

  // Initialize with current time if no date is provided
  React.useEffect(() => {
    if (!date) {
      const now = new Date()
      setIsPm(now.getHours() >= 12)
    } else {
      setIsPm(date.getHours() >= 12)
    }
  }, [date, setDate])

  // Get hours in 12-hour format
  const hours12 = React.useMemo(() => {
    if (!date) return ""
    const hours = date.getHours()
    return hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  }, [date])

  // Get minutes
  const minutes = React.useMemo(() => {
    if (!date) return ""
    return date.getMinutes()
  }, [date])

  // Handle hour change
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!date) return

    const newHour = Number.parseInt(e.target.value, 10)
    if (isNaN(newHour) || newHour < 1 || newHour > 12) return

    const newDate = new Date(date)
    newDate.setHours(isPm ? (newHour === 12 ? 12 : newHour + 12) : newHour === 12 ? 0 : newHour)
    setDate(newDate)

    // Auto-advance to minutes
    if (e.target.value.length === 2) {
      minuteRef.current?.focus()
    }
  }

  // Handle minute change
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!date) return

    const newMinute = Number.parseInt(e.target.value, 10)
    if (isNaN(newMinute) || newMinute < 0 || newMinute > 59) return

    const newDate = new Date(date)
    newDate.setMinutes(newMinute)
    setDate(newDate)
  }

  // Toggle AM/PM
  const toggleAmPm = () => {
    if (!date) return

    const newDate = new Date(date)
    const hours = newDate.getHours()

    if (isPm) {
      // Switching from PM to AM
      newDate.setHours(hours - 12)
    } else {
      // Switching from AM to PM
      newDate.setHours(hours + 12)
    }

    setIsPm(!isPm)
    setDate(newDate)
  }

  // Create a new date if none exists
  const handleFocus = () => {
    if (!date) {
      const newDate = new Date()
      newDate.setSeconds(0)
      newDate.setMilliseconds(0)
      setDate(newDate)
      setIsPm(newDate.getHours() >= 12)
    }
  }

  return (
    <div className={cn("flex items-end gap-2", className)}>
      <div>
        <Label htmlFor="hours" className="text-xs">
          Hour
        </Label>
        <Input
          ref={hourRef}
          id="hours"
          className="w-12 h-8"
          value={date ? hours12.toString().padStart(2, "0") : ""}
          onChange={handleHourChange}
          onFocus={handleFocus}
          placeholder="hh"
          maxLength={2}
        />
      </div>
      <div className="text-sm pb-1.5">:</div>
      <div>
        <Label htmlFor="minutes" className="text-xs">
          Min
        </Label>
        <Input
          ref={minuteRef}
          id="minutes"
          className="w-12 h-8"
          value={date ? minutes.toString().padStart(2, "0") : ""}
          onChange={handleMinuteChange}
          onFocus={handleFocus}
          placeholder="mm"
          maxLength={2}
        />
      </div>
      <Button variant="outline" size="sm" className="ml-2 h-8 px-2 text-xs" onClick={toggleAmPm} onFocus={handleFocus}>
        {isPm ? "PM" : "AM"}
      </Button>
    </div>
  )
}
