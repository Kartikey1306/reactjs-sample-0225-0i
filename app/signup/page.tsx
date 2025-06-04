"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock signup logic
    // In a real app, you would send this data to a backend to create a user
    const newUser = { name: username, email: email }
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    console.log("Signing up with:", username, email)
    router.push("/dashboard")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-brand p-4">
      <div className="w-full max-w-md space-y-8 p-6 md:p-10 bg-primary-brand/90 rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">Sign up</h1>
        </div>
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <Label htmlFor="username" className="block text-sm font-medium text-gray-200">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full bg-white/10 text-white border border-blue-400/50 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 py-2 px-3 rounded-md"
              placeholder="Enter Name"
            />
          </div>
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-white/10 text-white border border-blue-400/50 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 py-2 px-3 rounded-md"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-white/10 text-white border border-blue-400/50 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 py-2 px-3 rounded-md"
              placeholder="Enter Password"
            />
          </div>

          <div className="flex items-center">
            <Checkbox
              id="terms"
              name="terms"
              required
              className="h-4 w-4 text-white border-gray-400 focus:ring-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor="terms" className="ml-2 block text-sm text-gray-200">
              I accept the terms & conditions
            </Label>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-white text-primary-brand hover:bg-gray-100 py-3 text-lg font-semibold rounded-md"
            >
              Sign up
            </Button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-gray-200">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-white hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
