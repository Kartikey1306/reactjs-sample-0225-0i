"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Trash2, X, MoveRight } from "lucide-react"
import type { Task, TaskList } from "@/lib/types" // Ensure type import
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TaskDetailsModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onUpdateTask: (task: Task) => void
  onDeleteTask: (listId: string, taskId: string) => void
  allLists: TaskList[]
  onMoveTask: (taskId: string, oldListId: string, newListId: string) => void
}

export default function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
  allLists,
  onMoveTask,
}: TaskDetailsModalProps) {
  const [title, setTitle] = useState(task.title)
  const [details, setDetails] = useState(task.details || "")
  const [dueDate, setDueDate] = useState(task.dueDate || "")

  useEffect(() => {
    setTitle(task.title)
    setDetails(task.details || "")
    setDueDate(task.dueDate || "")
  }, [task])

  const handleSave = () => {
    onUpdateTask({ ...task, title, details, dueDate })
    onClose()
  }

  const handleDelete = () => {
    onDeleteTask(task.listId, task.id)
    onClose()
  }

  const handleMoveToList = (newListId: string) => {
    onMoveTask(task.id, task.listId, newListId)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-slate-50">
        <DialogHeader className="flex flex-row justify-between items-center">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
            placeholder="Task Title"
          />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-500 hover:bg-red-100">
              <Trash2 className="h-5 w-5" />
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-200">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="task-details" className="text-sm font-medium text-slate-700">
              Add details
            </Label>
            <Textarea
              id="task-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Add details..."
              className="mt-1 min-h-[80px] bg-white"
            />
          </div>
          <div>
            <Label htmlFor="task-due-date" className="text-sm font-medium text-slate-700">
              Add date
            </Label>
            <Input
              id="task-due-date"
              type="text" // Ideally, this would be a date picker
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="E.g., Tomorrow or 25th Dec"
              className="mt-1 bg-white"
            />
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-slate-600">
                  <MoveRight className="mr-2 h-4 w-4" /> Move to another list
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {allLists
                  .filter((list) => list.id !== task.listId) // Show only other lists
                  .map((list) => (
                    <DropdownMenuItem key={list.id} onClick={() => handleMoveToList(list.id)}>
                      {list.name}
                    </DropdownMenuItem>
                  ))}
                {allLists.filter((list) => list.id !== task.listId).length === 0 && (
                  <DropdownMenuItem disabled>No other lists available</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} className="bg-primary-brand hover:bg-primary-brand/90 text-white">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
