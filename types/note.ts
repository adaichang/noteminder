export interface TodoItem {
  id: string
  text: string
  completed: boolean
}

export interface Timer {
  duration: number // in seconds
  sets: number
  repetitions: number
  active: boolean
}

export interface Note {
  id: string
  title: string
  content: string
  todos: TodoItem[]
  tags: string[]
  videoUrl?: string
  reminder?: Date | string
  timer?: Timer
  createdAt: string
  updatedAt: string
}
