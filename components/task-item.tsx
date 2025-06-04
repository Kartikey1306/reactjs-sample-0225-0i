"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Edit3, Bell } from "lucide-react"
import type { Task } from "@/lib/types" // Ensure type import

interface TaskItemProps {
  task: Task
  onUpdateTask: (task: Task) => void
  onOpenDetails: (task: Task) => void
}

export default function TaskItem({ task, onUpdateTask, onOpenDetails }: TaskItemProps) {
  const handleToggleComplete = () => {
    onUpdateTask({ ...task, isCompleted: !task.isCompleted })
  }

  return (
    <div
      className={`p-2.5 rounded-md flex items-start gap-3 group transition-colors ${task.isCompleted ? "bg-green-100/70 hover:bg-green-200/70" : "bg-white hover:bg-slate-50"}`}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.isCompleted}
        onCheckedChange={handleToggleComplete}
        className={`mt-1 ${task.isCompleted ? "border-green-600 data-[state=checked]:bg-green-600" : "border-slate-400"}`}
      />
      <div className="flex-grow cursor-pointer" onClick={() => onOpenDetails(task)}>
        <p className={`text-sm ${task.isCompleted ? "line-through text-slate-500" : "text-slate-800"}`}>{task.title}</p>
        {task.details && !task.isCompleted && (
          <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{task.details}</p>
        )}
        {task.dueDate && !task.isCompleted && (
          <p
            className={`text-xs mt-0.5 ${new Date(task.dueDate) < new Date() && task.dueDate !== "3rd July, 2020" ? "text-red-500" : "text-blue-600"}`}
          >
            {task.dueDate}
          </p>
        )}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
        {!task.isCompleted && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-500 hover:text-slate-700"
            onClick={() => console.log("Reminder for", task.title)}
          >
            <Bell className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-500 hover:text-slate-700"
          onClick={() => onOpenDetails(task)}
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
