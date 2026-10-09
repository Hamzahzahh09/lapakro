"use client"
import { useAuth } from "@/hooks/use-auth"
import { useAuthStore } from "@/lib/store"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LayoutDashboard, Users, ShoppingCart, Settings, ShieldAlert, ArrowLeft, Shield, Store } from "lucide-react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
const { user, isAuthenticated } = useAuth()
const router = useRouter()
const pathname = usePathname()
// Tunggu zustand persist selesai rehidrasi dari localStorage.
// Tanpa ini, isAuthenticated=false sesaat saat refresh/direct-visit
// sehingga user yang sebenarnya sudah login malah ditendang ke /login.
const [hydrated, setHydrated] = useState(false)

useEffect(() => {
if (useAuthStore.persist.hasHydrated()) {
setHydrated(true)
return
}
const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
return unsub
}, [])

  const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true, danger: false },
  { href: "/admin/sellers", label: "Aplikasi Seller", icon: Store, exact: false, danger: false },
  { href: "/admin/users", label: "Users & Sellers", icon: Users, exact: false, danger: false },
  { href: "/admin/transactions", label: "Semua Transaksi", icon: ShoppingCart, exact: false, danger: false },
  { href: "/admin/disputes", label: "Sengketa / Komplain", icon: ShieldAlert, exact: false, danger: true },
  { href: "/admin/settings", label: "Pengaturan Sistem", icon: Settings, exact: false, danger: false },
  ]

  const isActive = (href: string, exact?: boolean) =>
  exact ? pathname === href : pathname === href || pathname.startsWith(href + "/")

useEffect(() => {
if (!hydrated) return
if (!isAuthenticated) {
router.push("/login")
} else if (user?.role !=="admin"&& user?.role !=="owner") {
router.push("/")
}
}, [hydrated, isAuthenticated, user, router])

if (!hydrated || !user || !isAuthenticated) {
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
  {adminLinks.slice(0, 4).map((link) => {
  const Icon = link.icon
  const active = isActive(link.href, link.exact)
  return (
  <Link
  key={link.href}
  href={link.href}
  className={cn(
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
  active
  ? "font-semibold text-[#111827] bg-[#F5F5F5]"
  : link.danger
  ? "font-medium text-[#EF4444] hover:bg-[#FEF2F2]"
  : "font-medium text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#111827]"
  )}
  >
  <Icon className="h-4 w-4" />
  {link.label}
  </Link>
  )
  })}
  <div className="pt-4 mt-4 border-t border-[#EAEAEA]">
  {adminLinks.slice(4).map((link) => {
  const Icon = link.icon
  const active = isActive(link.href, link.exact)
  return (
  <Link
  key={link.href}
  href={link.href}
  className={cn(
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
  active
  ? "font-semibold text-[#111827] bg-[#F5F5F5]"
  : "font-medium text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#111827]"
  )}
  >
  <Icon className="h-4 w-4" />
  {link.label}
  </Link>
  )
  })}
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
