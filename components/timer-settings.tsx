"use client"

import { useState } from "react"
import { Clock, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Timer } from "@/types/note"

interface TimerSettingsProps {
  timer: Timer | undefined
  onChange: (timer: Timer | undefined) => void
}

export function TimerSettings({ timer, onChange }: TimerSettingsProps) {
  const [isEnabled, setIsEnabled] = useState(!!timer?.active)
  const [minutes, setMinutes] = useState(timer?.duration ? Math.floor(timer.duration / 60) : 5)
  const [seconds, setSeconds] = useState(timer?.duration ? timer.duration % 60 : 0)
  const [sets, setSets] = useState(timer?.sets || 1)
  const [repetitions, setRepetitions] = useState(timer?.repetitions || 1)

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked)

    if (checked) {
      // Create or update timer
      onChange({
        duration: minutes * 60 + seconds,
        sets,
        repetitions,
        active: true,
      })
    } else {
      // Disable timer
      onChange(undefined)
    }
  }

  const updateTimer = () => {
    if (isEnabled) {
      onChange({
        duration: minutes * 60 + seconds,
        sets,
        repetitions,
        active: true,
      })
    }
  }

  const handleMinutesChange = (value: number) => {
    const newValue = Math.max(0, value)
    setMinutes(newValue)
    setTimeout(updateTimer, 0)
  }

  const handleSecondsChange = (value: number) => {
    const newValue = Math.max(0, Math.min(59, value))
    setSeconds(newValue)
    setTimeout(updateTimer, 0)
  }

  const handleSetsChange = (value: number) => {
    const newValue = Math.max(1, value)
    setSets(newValue)
    setTimeout(updateTimer, 0)
  }

  const handleRepetitionsChange = (value: number) => {
    const newValue = Math.max(1, value)
    setRepetitions(newValue)
    setTimeout(updateTimer, 0)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <Label htmlFor="timer-toggle" className="text-sm font-medium">
            Timer
          </Label>
        </div>
        <Switch id="timer-toggle" checked={isEnabled} onCheckedChange={handleToggle} />
      </div>

      {isEnabled && (
        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <Label className="text-xs">Duration</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    onClick={() => handleMinutesChange(minutes - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={minutes}
                    onChange={(e) => handleMinutesChange(Number.parseInt(e.target.value) || 0)}
                    className="h-8 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min={0}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    onClick={() => handleMinutesChange(minutes + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Label className="text-xs text-center block mt-1">Minutes</Label>
              </div>
              <span className="text-lg">:</span>
              <div className="flex-1">
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    onClick={() => handleSecondsChange(seconds - 5)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={seconds}
                    onChange={(e) => handleSecondsChange(Number.parseInt(e.target.value) || 0)}
                    className="h-8 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min={0}
                    max={59}
                    step={5}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    onClick={() => handleSecondsChange(seconds + 5)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Label className="text-xs text-center block mt-1">Seconds</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Sets</Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => handleSetsChange(sets - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  value={sets}
                  onChange={(e) => handleSetsChange(Number.parseInt(e.target.value) || 1)}
                  className="h-8 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min={1}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => handleSetsChange(sets + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Repetitions</Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => handleRepetitionsChange(repetitions - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  value={repetitions}
                  onChange={(e) => handleRepetitionsChange(Number.parseInt(e.target.value) || 1)}
                  className="h-8 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min={1}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => handleRepetitionsChange(repetitions + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
