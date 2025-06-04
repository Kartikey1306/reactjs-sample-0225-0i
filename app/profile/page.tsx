"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  name?: string
  email: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser)
      setUser(parsedUser)
      setName(parsedUser.name || "")
      setEmail(parsedUser.email)
    }
    setIsLoading(false)
  }, [])

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      const updatedUser = { ...user, name, email }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      setUser(updatedUser) // Update local state for immediate feedback if needed on this page

      // Dispatch a custom event to notify other components like the header
      window.dispatchEvent(new CustomEvent("profileUpdated"))

      alert("Profile updated successfully!")
      router.push("/dashboard") // Redirect to dashboard
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!user && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>User not found. Please log in.</p>
        {/* Optionally redirect to login */}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Manage Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            {/* Add more profile fields here if needed, e.g., password change */}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
