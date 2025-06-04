"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar" // Added AvatarImage
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Brain, LogOut, LucideUser, Wallet } from "lucide-react"
import { ethers } from "ethers"

interface User {
  name?: string
  email: string
}

interface PicsumInfo {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

export default function AppHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [walletAccount, setWalletAccount] = useState<string | null>(null)
  const [walletError, setWalletError] = useState<string | null>(null)
  const router = useRouter()

  const fetchRandomAvatar = async (currentUser: User | null, maxRetries = 3) => {
    if (!currentUser) {
      setAvatarUrl(null) // Clear avatar if no user
      return
    }

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const randomId = Math.floor(Math.random() * 1000) // Picsum IDs are generally in this range
        const response = await fetch(`https://picsum.photos/id/${randomId}/info`)

        if (response.ok) {
          const data: PicsumInfo = await response.json()
          setAvatarUrl(data.download_url)
          return // Success, exit the loop
        }

        if (response.status === 404 && attempt < maxRetries - 1) {
          console.warn(`Picsum API: ID ${randomId} not found. Retrying... (Attempt ${attempt + 1}/${maxRetries})`)
          await new Promise((resolve) => setTimeout(resolve, 200)) // Small delay before retrying
          continue // Try next attempt
        }

        // For other errors or if it's the last attempt and still 404
        throw new Error(
          `Picsum API request failed for ID ${randomId} with status ${response.status} after ${attempt + 1} attempts.`,
        )
      } catch (error) {
        console.error(`Error fetching avatar (Attempt ${attempt + 1}/${maxRetries}):`, error)
        if (attempt === maxRetries - 1) {
          // If all retries fail
          setAvatarUrl(null) // Fallback to initials
        }
      }
    }
  }

  const updateUserFromStorage = () => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser)
      setUser(parsedUser)
      if (!avatarUrl) {
        // Fetch avatar only if not already set for this session or user
        fetchRandomAvatar(parsedUser)
      }
    } else {
      setUser(null)
      setAvatarUrl(null) // Clear avatar if no user
    }
  }

  useEffect(() => {
    updateUserFromStorage() // Initial load

    window.addEventListener("storage", updateUserFromStorage)
    window.addEventListener("profileUpdated", updateUserFromStorage)

    // Check for existing wallet connection
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await provider.listAccounts()
          if (accounts.length > 0 && accounts[0]) {
            setWalletAccount(accounts[0].address)
          }
        } catch (err) {
          console.error("Error checking wallet connection:", err)
        }
      }
    }
    checkWalletConnection()

    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAccount(accounts[0])
        } else {
          setWalletAccount(null)
        }
      }
      window.ethereum.on("accountsChanged", handleAccountsChanged)

      // Cleanup
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        }
      }
    }

    return () => {
      window.removeEventListener("storage", updateUserFromStorage)
      window.removeEventListener("profileUpdated", updateUserFromStorage)
    }
  }, []) // Empty dependency array means this effect runs once on mount and cleans up on unmount

  const getInitials = (name?: string, email?: string): string => {
    if (name) {
      const parts = name.split(" ")
      if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      }
      if (parts[0] && parts[0].length >= 2) return parts[0].substring(0, 2).toUpperCase()
      if (parts[0]) return parts[0][0].toUpperCase()
    }
    if (email && email.length >= 2) {
      return email.substring(0, 2).toUpperCase()
    }
    if (email && email.length === 1) {
      return email[0].toUpperCase()
    }
    return "U"
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setUser(null)
    setAvatarUrl(null)
    router.push("/login")
  }

  const connectWallet = async () => {
    setWalletError(null)
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        // Request accounts explicitly
        await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        setWalletAccount(address)
      } catch (err: any) {
        console.error("Wallet connection error:", err)
        setWalletError(err.message || "Failed to connect wallet.")
        setWalletAccount(null)
      }
    } else {
      setWalletError("MetaMask (or other Web3 wallet) not detected. Please install it.")
    }
  }

  const disconnectWallet = () => {
    setWalletAccount(null)
    setWalletError(null)
  }

  return (
    <header className="bg-primary-brand text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Brain size={32} />
          <h1 className="text-2xl font-bold hidden sm:block">TasksBoard</h1>
        </Link>

        <div className="flex items-center gap-4">
          {/* Web3 Connect Button */}
          <div>
            {walletAccount ? (
              <div className="flex items-center gap-2">
                <span className="text-sm hidden md:inline">
                  {`${walletAccount.substring(0, 6)}...${walletAccount.substring(walletAccount.length - 4)}`}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 border-red-500 text-white"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={connectWallet}
                className="text-primary-brand bg-white hover:bg-gray-100"
              >
                <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
              </Button>
            )}
            {walletError && <p className="text-xs text-red-300 mt-1">{walletError}</p>}
          </div>

          {/* User Avatar and Dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={user.name || user.email} />
                    ) : null}
                    <AvatarFallback className="bg-slate-200 text-primary-brand font-semibold">
                      {getInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    {user.name && <p className="text-sm font-medium leading-none">{user.name}</p>}
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <LucideUser className="mr-2 h-4 w-4" />
                    <span>Manage Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="text-primary-brand bg-white hover:bg-gray-100">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
