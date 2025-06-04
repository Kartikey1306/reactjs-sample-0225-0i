"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TaskItem from "./task-item"
import TaskDetailsModal from "./task-details-modal"
import { PlusCircle, MoreHorizontal, Trash2 } from "lucide-react"
import type { TaskList, Task } from "@/lib/types" // Ensure type import
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TaskListProps {
  list: TaskList
  onAddTask: (listId: string, taskTitle: string) => void
  onUpdateTask: (task: Task) => void
  onDeleteTask: (listId: string, taskId: string) => void
  onDeleteList: (listId: string) => void
  allLists: TaskList[]
  onMoveTask: (taskId: string, oldListId: string, newListId: string) => void
}

export default function TaskListComp({
  list,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onDeleteList,
  allLists,
  onMoveTask,
}: TaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [showAddTaskInput, setShowAddTaskInput] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(list.id, newTaskTitle.trim())
      setNewTaskTitle("")
      setShowAddTaskInput(false)
    }
  }

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task)
  }

  const closeTaskDetails = () => {
    setSelectedTask(null)
  }

  const completedTasksCount = list.tasks.filter((task) => task.isCompleted).length

  return (
    <Card className="w-72 flex-shrink-0 bg-slate-200/80 border-slate-300 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-3 bg-slate-200 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-slate-700">{list.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-300">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDeleteList(list.id)} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-3 space-y-2 h-[calc(100%-4rem)] overflow-y-auto">
        {list.tasks
          .filter((task) => !task.isCompleted)
          .map((task) => (
            <TaskItem key={task.id} task={task} onUpdateTask={onUpdateTask} onOpenDetails={openTaskDetails} />
          ))}

        {completedTasksCount > 0 && (
          <div className="mt-3 pt-2 border-t border-slate-300">
            <p className="text-sm font-medium text-slate-600 mb-1">Completed ({completedTasksCount})</p>
            {list.tasks
              .filter((task) => task.isCompleted)
              .map((task) => (
                <TaskItem key={task.id} task={task} onUpdateTask={onUpdateTask} onOpenDetails={openTaskDetails} />
              ))}
          </div>
        )}

        {showAddTaskInput ? (
          <div className="flex items-center gap-2 mt-2">
            <Input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a task"
              className="flex-grow bg-white"
              onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            />
            <Button onClick={handleAddTask} size="sm" className="bg-primary-brand/80 hover:bg-primary-brand text-white">
              Add
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setShowAddTaskInput(true)}
            className="w-full justify-start text-slate-600 hover:bg-slate-300/70 mt-1"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Add a task
          </Button>
        )}
      </CardContent>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={closeTaskDetails}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          allLists={allLists}
          onMoveTask={onMoveTask}
        />
      )}
    </Card>
  )
}
