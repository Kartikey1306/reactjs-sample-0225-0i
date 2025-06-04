"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login logic
    // In a real app, you would validate credentials against a backend
    const mockUser = { email: email, name: "Demo User" } // Use entered email
    localStorage.setItem("currentUser", JSON.stringify(mockUser))
    console.log("Logging in with:", email)
    router.push("/dashboard")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-brand p-4">
      <div className="w-full max-w-md space-y-8 p-6 md:p-10 bg-primary-brand/90 rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">Log in!</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-white/10 text-white border border-blue-400/50 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 py-2 px-3 rounded-md"
              placeholder="Enter Password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                id="remember-me"
                name="remember-me"
                className="h-4 w-4 text-white border-gray-400 focus:ring-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-200">
                Remember me
              </Label>
            </div>
            <div className="text-sm">
              <Link href="#" className="font-medium text-gray-200 hover:text-white">
                Forgot Password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-white text-primary-brand hover:bg-gray-100 py-3 text-lg font-semibold rounded-md"
            >
              Log in
            </Button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-gray-200">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
