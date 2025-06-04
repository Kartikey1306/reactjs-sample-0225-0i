"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Import useRouter for potential redirects
import TaskListComp from "@/components/task-list"
import NewListModal from "@/components/new-list-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { TaskList, Task } from "@/lib/types"

interface StoredUser {
  email: string
  name?: string
}

export default function DashboardPage() {
  const [lists, setLists] = useState<TaskList[]>([])
  const [isClient, setIsClient] = useState(false)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // This effect runs once on mount to determine the current user
    const storedUserItem = localStorage.getItem("currentUser")
    if (storedUserItem) {
      try {
        const parsedUser: StoredUser = JSON.parse(storedUserItem)
        if (parsedUser && parsedUser.email) {
          setCurrentUserEmail(parsedUser.email)
        } else {
          console.error("Stored user data is invalid or missing email.")
          setCurrentUserEmail(null)
          // router.push('/login'); // Optionally redirect if user data is corrupt
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        setCurrentUserEmail(null)
        // router.push('/login'); // Optionally redirect
      }
    } else {
      setCurrentUserEmail(null)
      // If no user, you might want to redirect to login,
      // but AppHeader might already handle this by showing a login button.
      // For now, we'll allow the page to render empty if no user.
    }
    setIsClient(true)
  }, [router]) // Added router to dependency array if used for redirection

  useEffect(() => {
    // Load lists when currentUserEmail is determined (and on client)
    if (isClient && currentUserEmail) {
      const userTaskListsKey = `taskLists_${currentUserEmail}`
      const storedLists = localStorage.getItem(userTaskListsKey)
      if (storedLists) {
        try {
          setLists(JSON.parse(storedLists))
        } catch (error) {
          console.error(`Error parsing task lists for user ${currentUserEmail}:`, error)
          setLists([]) // Fallback to empty list on parse error
        }
      } else {
        setLists([]) // Start with empty lists for this user if nothing is stored
      }
    } else if (isClient && !currentUserEmail) {
      // No user logged in, ensure lists are cleared from component state
      setLists([])
    }
  }, [isClient, currentUserEmail])

  useEffect(() => {
    // Save lists to localStorage whenever 'lists' state changes, if a user is logged in
    if (isClient && currentUserEmail) {
      const userTaskListsKey = `taskLists_${currentUserEmail}`
      localStorage.setItem(userTaskListsKey, JSON.stringify(lists))
    }
  }, [lists, isClient, currentUserEmail]) // Re-run if lists or user changes

  const addList = (listName: string) => {
    if (!currentUserEmail) return // Should not happen if UI prevents action without login

    const newList: TaskList = {
      id: `list-${Date.now()}`,
      name: listName,
      tasks: [],
    }
    setLists((prevLists) => [...prevLists, newList])
  }

  const addTask = (listId: string, taskTitle: string) => {
    if (!currentUserEmail) return

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      listId,
      isCompleted: false,
    }
    setLists((prevLists) =>
      prevLists.map((list) => (list.id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list)),
    )
  }

  const updateTask = (updatedTask: Task) => {
    if (!currentUserEmail) return

    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === updatedTask.listId
          ? {
              ...list,
              tasks: list.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
            }
          : list,
      ),
    )
  }

  const handleMoveTask = (taskId: string, oldListId: string, newListId: string) => {
    if (!currentUserEmail) return

    let taskToMove: Task | undefined

    const listsWithoutMovedTask = lists.map((list) => {
      if (list.id === oldListId) {
        taskToMove = list.tasks.find((t) => t.id === taskId)
        return { ...list, tasks: list.tasks.filter((t) => t.id !== taskId) }
      }
      return list
    })

    if (taskToMove) {
      const finalLists = listsWithoutMovedTask.map((list) => {
        if (list.id === newListId) {
          return { ...list, tasks: [...list.tasks, { ...taskToMove!, listId: newListId }] }
        }
        return list
      })
      setLists(finalLists)
    }
  }

  const deleteTask = (listId: string, taskId: string) => {
    if (!currentUserEmail) return

    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.filter((task) => task.id !== taskId),
            }
          : list,
      ),
    )
  }

  const deleteList = (listId: string) => {
    if (!currentUserEmail) return
    setLists((prevLists) => prevLists.filter((list) => list.id !== listId))
  }

  // Render loading or a message if client-side checks are not complete or no user
  if (!isClient) {
    return <div className="p-4">Loading dashboard...</div> // Or a proper skeleton loader
  }

  // If there's no logged-in user, you might want to show a specific message or rely on AppHeader
  // For now, if currentUserEmail is null, the map will be empty, and only "New List" will show.
  // This is acceptable as AppHeader would show "Login".

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-x-auto pb-4">
        <div className="flex gap-4 p-2 min-w-max">
          {currentUserEmail &&
            lists.map((list) => (
              <TaskListComp
                key={list.id}
                list={list}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onDeleteList={deleteList}
                allLists={lists}
                onMoveTask={handleMoveTask}
              />
            ))}
          {/* Show "New List" button only if a user is logged in */}
          {currentUserEmail && (
            <NewListModal
              onAddList={addList}
              triggerButton={
                <div className="w-72 flex-shrink-0">
                  <Button
                    variant="outline"
                    className="w-full h-20 bg-white/70 hover:bg-white border-dashed border-gray-400 text-gray-600"
                  >
                    <Plus className="mr-2 h-5 w-5" /> New List
                  </Button>
                </div>
              }
            />
          )}
        </div>
      </div>

      {/* Floating Action Button for New List - show only if user is logged in */}
      {currentUserEmail && (
        <div className="fixed bottom-8 right-8">
          <NewListModal
            onAddList={addList}
            triggerButton={
              <Button className="rounded-full w-16 h-16 bg-primary-brand text-white shadow-lg hover:bg-primary-brand/90">
                <Plus size={32} />
                <span className="sr-only">Add New List</span>
              </Button>
            }
          />
        </div>
      )}
      {!currentUserEmail && isClient && (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Welcome to TasksBoard!</h2>
          <p className="text-slate-500 mb-6">Please log in to manage your tasks.</p>
          <Button onClick={() => router.push("/login")} className="bg-primary-brand text-white">
            Go to Login
          </Button>
        </div>
      )}
    </div>
  )
}
