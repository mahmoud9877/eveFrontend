"use client";

import { useAuth, withAuth } from "@/lib/auth-content";
import HomePage from "@/components/home-page.tsx";

function Home() {
  const { user } = useAuth();
  return <HomePage user={user} />;
}

export default withAuth(Home);
