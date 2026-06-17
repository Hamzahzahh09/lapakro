"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ShoppingCart,
  MessageCircle,
  LogIn,
  User,
  ChevronDown,
  LayoutDashboard,
  Wallet,
  Menu,
  X,
  Search,
  LogOut,
  Store,
  Bell,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  Gamepad2,
} from "lucide-react"
import { hasSufficientRole } from "@/lib/roles"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/store"
import { cn, getInitials } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [userMenuOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setSearchFocused(false)
    }
  }

  const isSeller = mounted && user && hasSufficientRole(user.role, "seller")

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/products", label: "Produk" },
    { href: "/promo", label: "Promo" },
  ]

  const userMenuItems = [
    { href: "/profile", label: "Profil Saya", icon: User },
    { href: "/wallet", label: "Dompet", icon: Wallet },
    { href: "/transactions", label: "Transaksi", icon: ShoppingCart },
    { href: "/chat", label: "Chat", icon: MessageCircle },
    ...(isSeller ? [{ href: "/seller/dashboard", label: "Dashboard Seller", icon: TrendingUp }] : []),
  ]

  return (
    <header className="sticky top-0 z-40 w-full bg-[#09090b] border-b border-white/5">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-md shadow-violet-600/20 transition-transform group-hover:scale-105">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
          <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            LapakRo
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 ml-4 h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center h-full text-[15px] font-medium transition-colors",
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400" />
                )}
              </Link>
            )
          })}
          {isSeller && (
            <Link
              href="/seller/dashboard"
              className="flex items-center gap-1.5 h-full text-[15px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Jual
            </Link>
          )}
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-[500px] ml-4 mr-auto">
          <div className={cn(
            "relative transition-all duration-200",
            searchFocused && "ring-1 ring-slate-700 rounded-lg"
          )}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Cari Robux, Game Pass, item, akun..."
              className="w-full h-10 rounded-lg border border-transparent bg-slate-800/60 pl-9 pr-10 text-[14px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:bg-slate-800 focus:border-slate-700 transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-[22px] w-[22px] items-center justify-center rounded-md bg-slate-700/50 text-[11px] text-slate-400 font-medium border border-slate-600/50">
              /
            </div>
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Chat icon */}
          {mounted && isAuthenticated && (
            <Link
              href="/chat"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors relative"
            >
              <MessageSquare className="h-[20px] w-[20px] stroke-[1.5]" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-600 border-2 border-[#09090b]" />
            </Link>
          )}

          {/* Notifications */}
          {mounted && isAuthenticated && (
            <button
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors relative"
            >
              <Bell className="h-[20px] w-[20px] stroke-[1.5]" />
            </button>
          )}

          {mounted && isAuthenticated && (
            <div className="h-6 w-px bg-slate-800/80 mx-2 hidden sm:block" />
          )}

          {/* Auth Section */}
          {!mounted ? (
            <div className="w-32 h-10 rounded-full bg-slate-800 animate-pulse" />
          ) : isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  "flex items-center gap-2.5 rounded-full p-1 pr-3 transition-colors",
                  userMenuOpen
                    ? "bg-slate-800"
                    : "hover:bg-slate-800/50"
                )}
              >
                <div className="relative">
                  <Avatar className="h-9 w-9 border-none">
                    <AvatarFallback className="bg-violet-600 text-white text-sm font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-cyan-400 border-2 border-[#09090b]" />
                </div>
                <div className="hidden sm:flex flex-col items-start justify-center">
                  <span className="text-[14px] font-bold text-white leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[12px] text-slate-400 leading-tight capitalize mt-0.5">
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500 ml-1" />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="rounded-xl border border-slate-800 bg-[#09090b] p-1.5 shadow-xl shadow-black/40">
                    {/* User info header */}
                    <div className="px-3 py-3 mb-1">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-violet-600 text-white text-sm font-bold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white truncate">
                              {user.name}
                            </p>
                          </div>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px w-full bg-slate-800 my-1" />

                    {/* Menu Items */}
                    <div className="py-1 space-y-0.5">
                      {userMenuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                              isActive
                                ? "text-cyan-400 bg-cyan-400/10 font-medium"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            )}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        )
                      })}

                      {(user.role === "admin" || user.role === "owner") && (
                        <Link
                          href="/admin"
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            pathname.startsWith("/admin")
                              ? "text-cyan-400 bg-cyan-400/10 font-medium"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          )}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          {user.role === "owner" ? "Owner Panel" : "Admin Panel"}
                        </Link>
                      )}
                    </div>

                    <div className="h-px w-full bg-slate-800 my-1" />

                    {/* Logout */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          logout()
                          setUserMenuOpen(false)
                          router.push("/")
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  size="sm"
                  className="rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium border-none"
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
                >
                  Daftar
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ml-1"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 animate-in slide-in-from-top-1 duration-200">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false) }}>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk Roblox..."
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </form>

            {/* Mobile Nav Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "text-cyan-400 bg-cyan-400/10 font-medium"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
              {isSeller && (
                <Link
                  href="/seller/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-cyan-400 hover:text-cyan-300"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Jual
                </Link>
              )}
            </div>

            {/* Mobile Auth Links */}
            {mounted && isAuthenticated && user && (
              <>
                <hr className="border-slate-100 dark:border-slate-700" />
                <div className="space-y-1">
                  {userMenuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
