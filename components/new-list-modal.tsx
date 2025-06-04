"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"

interface NewListModalProps {
  onAddList: (listName: string) => void
  triggerButton: React.ReactNode // Allow custom trigger
}

export default function NewListModal({ onAddList, triggerButton }: NewListModalProps) {
  const [listName, setListName] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleAddList = () => {
    if (listName.trim()) {
      onAddList(listName.trim())
      setListName("")
      setIsOpen(false) // Close dialog after adding
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-800">Create New List</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="list-name" className="text-sm font-medium text-slate-700">
            List Name
          </Label>
          <Input
            id="list-name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Enter list name"
            className="mt-1 bg-white"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAddList} className="bg-primary-brand hover:bg-primary-brand/90 text-white">
            <PlusCircle className="mr-2 h-5 w-5" /> Create List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
