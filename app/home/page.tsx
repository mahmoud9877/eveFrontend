"use client"

import { useAuth, withAuth } from "@/lib/auth-context"
import HomePage from "@/components/home-page"

function Home() {
  const { user } = useAuth()
  return <HomePage user={user} />
}

export default withAuth(Home)
