"use client"

import { useAuth } from "@/hooks/use-auth"
import { useAuthStore } from "@/lib/store"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Loader2 } from "lucide-react"

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isRegisterPage = pathname?.startsWith("/seller/register")

  // Tunggu zustand persist selesai rehidrasi dari localStorage.
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true)
      return
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
    return unsub
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (isRegisterPage) return // Jangan redirect di halaman pendaftaran seller

    if (!isAuthenticated) {
      router.push("/login")
    } else if (user?.role !== "seller" && user?.role !== "admin" && user?.role !== "owner") {
      router.push("/seller/register")
    }
  }, [hydrated, isAuthenticated, user, router, isRegisterPage])

  // Di halaman pendaftaran seller, tampilkan langsung tanpa sidebar dashboard
  if (isRegisterPage) {
    return <>{children}</>
  }

  if (!hydrated || !user || !isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#F8FAFC]">
        <div className="relative">
          <div className="absolute inset-0 bg-[#FFD700] blur-xl opacity-40 rounded-full animate-pulse-slow"/>
          <Loader2 className="h-10 w-10 animate-spin text-[#D4A017] relative z-10"/>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1400px] flex-col gap-8 px-4 sm:px-6 py-6 lg:flex-row bg-[#F8FAFC] relative">
      <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none -z-10"/>
      <Sidebar />
      <main className="flex-1 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        {children}
      </main>
    </div>
  )
}
