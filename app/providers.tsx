"use client";

import { AuthProvider } from "@/lib/auth-context";
import "@/lib/i18n";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
