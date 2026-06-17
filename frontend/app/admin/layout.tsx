"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/store"
import { hasSufficientRole } from "@/lib/roles"
import {
  BarChart3,
  ClipboardList,
  Scale,
  ArrowLeft,
  Menu,
  X,
  Shield,
  Loader2,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/listings", label: "Review Produk", icon: ClipboardList },
  { href: "/admin/disputes", label: "Sengketa", icon: Scale },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!token || !user) {
      router.push("/login")
      return
    }
    if (!hasSufficientRole(user.role, "admin")) {
      router.push("/")
    }
  }, [token, user])

  if (!user || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-fuchsia-500" />
      </div>
    )
  }

  return (
    <div className="flex items-start">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`
          fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64
          bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
          transform transition-transform duration-200 ease-in-out overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-600 to-purple-600 shadow-sm">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </Link>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 capitalize">{user.role}</p>
        </div>
        <nav className="p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-400"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200 dark:border-slate-700">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:hover:text-white rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Toko
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-semibold text-slate-900 dark:text-white">Admin Panel</span>
        </div>
        {children}
      </div>
    </div>
  )
}
