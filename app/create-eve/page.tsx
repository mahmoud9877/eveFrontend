"use client"

import { useAuth, withAuth } from "@/lib/auth-context"
import CreateEveForm from "@/components/create-eve-form"

function CreateEvePage() {
  const { user } = useAuth()
  return <CreateEveForm user={user} />
}

export default withAuth(CreateEvePage)
