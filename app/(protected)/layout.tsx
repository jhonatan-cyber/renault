import type React from "react"
import ProtectedLayout from "@/app/layout-protected"

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}
