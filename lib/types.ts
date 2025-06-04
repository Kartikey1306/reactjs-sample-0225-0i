export interface Task {
  id: string
  title: string
  details?: string
  dueDate?: string
  isCompleted: boolean
  listId: string
}

export interface TaskList {
  id: string
  name: string
  tasks: Task[]
}
