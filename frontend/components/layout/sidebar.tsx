"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Shield,
  AlertTriangle,
  Users,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  type: "seller" | "admin"
}

const sellerLinks = [
  { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/products", label: "Produk Saya", icon: Package },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
]

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/listings", label: "Listing Review", icon: Shield },
  { href: "/admin/disputes", label: "Disputes", icon: AlertTriangle },
  { href: "/admin/users", label: "Users", icon: Users },
]

export function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname()
  const links = type === "seller" ? sellerLinks : adminLinks

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-700">
        <Link
          href={type === "seller" ? "/seller/dashboard" : "/admin"}
          className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"
        >
          <ChevronLeft className="h-4 w-4 text-slate-400" />
          {type === "seller" ? "Panel Penjual" : "Panel Admin"}
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/")
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
