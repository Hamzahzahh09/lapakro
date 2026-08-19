"use client"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
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

  useEffect(() => {
  if (!isAuthenticated) {
  router.push("/login")
  } else if (user?.role !=="seller"&& user?.role !=="admin"&& user?.role !=="owner") {
  router.push("/")
  }
  }, [isAuthenticated, user, router])

  if (!user || !isAuthenticated) {
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
