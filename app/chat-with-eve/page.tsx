"use client"

import { useAuth, withAuth } from "@/lib/auth-context"
import ChatWithEve from "@/components/chat-with-eve"

function ChatWithEvePage() {
  const { user } = useAuth()
  return <ChatWithEve user={user} />
}

export default withAuth(ChatWithEvePage)
