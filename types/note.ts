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

export interface Attachment {
  id: string
  type: "file" | "link"
  name: string
  url: string
  size?: number
  fileType?: string
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
  attachments: Attachment[]
  createdAt: string
  updatedAt: string
}
