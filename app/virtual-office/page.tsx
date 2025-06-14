"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import VirtualOfficeClient from "@/components/virtual-office/virtual-office-client"

export default function VirtualOfficePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/")
    }
    setIsClient(true)
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isClient) {
    return (
        <div className="min-h-screen flex items-center justify-center dark:from-gray-900 dark:to-gray-800">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <VirtualOfficeClient />
}
