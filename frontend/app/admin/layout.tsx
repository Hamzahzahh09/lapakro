"use client"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LayoutDashboard, Users, ShoppingCart, Settings, ShieldAlert, ArrowLeft, Shield } from "lucide-react"
import { Loader2 } from "lucide-react"
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
  if (!isAuthenticated) {
  router.push("/login")
  } else if (user?.role !=="admin"&& user?.role !=="owner") {
  router.push("/")
  }
  }, [isAuthenticated, user, router])

  if (!user || !isAuthenticated) {
  return (
  <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#F5F5F5]">
  <Loader2 className="h-10 w-10 animate-spin text-[#D4A017]"/>
  </div>
  )
  }

 return (
 <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
 {/* Admin specific header */}
 <header className="sticky top-0 z-40 w-full border-b border-[#EAEAEA] bg-white shadow-sm">
 <div className="flex h-16 items-center px-6 gap-4">
 <Link href="/"className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition-colors">
 <ArrowLeft className="h-4 w-4"/>
 <span className="text-sm font-medium hidden sm:inline">Keluar Admin</span>
 </Link>
 
 <div className="h-6 w-px bg-[#EAEAEA] mx-2"/>
 
 <div className="flex items-center gap-2">
 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(212,160,23,0.1)]">
 <Shield className="h-5 w-5 text-[#D4A017]"/>
 </div>
 <span className="font-bold text-[#111827] hidden sm:inline">Admin Panel</span>
 </div>

 <div className="ml-auto flex items-center gap-4">
 <span className="text-sm text-[#6B7280]">Masuk sebagai: <strong className="text-[#111827]">{user?.name}</strong></span>
 </div>
 </div>
 </header>

 <div className="flex flex-1">
 {/* Admin Sidebar */}
 <aside className="hidden w-64 flex-col border-r border-[#EAEAEA] bg-white lg:flex">
 <nav className="flex-1 space-y-1 p-4">
 <Link href="/admin"className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#111827] bg-[#F5F5F5]">
 <LayoutDashboard className="h-4 w-4"/>
 Overview
 </Link>
 <Link href="/admin/users"className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#6B7280] hover:bg-[#F5F5F5] :bg-white">
 <Users className="h-4 w-4"/>
 Users & Sellers
 </Link>
 <Link href="/admin/transactions"className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#6B7280] hover:bg-[#F5F5F5] :bg-white">
 <ShoppingCart className="h-4 w-4"/>
 Semua Transaksi
 </Link>
 <Link href="/admin/disputes"className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#EF4444] hover:bg-[#FEF2F2] :bg-[#FEF2F2]/10">
 <ShieldAlert className="h-4 w-4"/>
 Sengketa / Komplain
 </Link>
 <div className="pt-4 mt-4 border-t border-[#EAEAEA]">
 <Link href="/admin/settings"className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#6B7280] hover:bg-[#F5F5F5] :bg-white">
 <Settings className="h-4 w-4"/>
 Pengaturan Sistem
 </Link>
 </div>
 </nav>
 </aside>

 {/* Main Content */}
 <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
 {children}
 </main>
 </div>
 </div>
 )
}
