"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // For this example, we'll always redirect to the login page.
    // In a real app, you'd check for an existing session.
    router.replace("/login")
  }, [router])

  // You can show a loading spinner or a blank page while redirecting
  return null
}
