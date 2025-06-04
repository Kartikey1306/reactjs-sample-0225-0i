"use client" // Assuming this might be a client component

import type React from "react"

interface AlertMessageProps {
  message: string
  type?: "success" | "error" | "warning" | "info"
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type = "info" }) => {
  const baseClasses = "p-4 rounded-md text-sm"
  let typeClasses = ""

  switch (type) {
    case "success":
      typeClasses = "bg-green-100 text-green-700"
      break
    case "error":
      typeClasses = "bg-red-100 text-red-700"
      break
    case "warning":
      typeClasses = "bg-yellow-100 text-yellow-700"
      break
    case "info":
    default:
      typeClasses = "bg-blue-100 text-blue-700"
      break
  }

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      {message}
    </div>
  )
}

export default AlertMessage
