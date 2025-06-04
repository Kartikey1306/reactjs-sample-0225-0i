import type React from "react"
import AppHeader from "@/components/app-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <AppHeader />
      <main className="flex-grow p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  )
}
