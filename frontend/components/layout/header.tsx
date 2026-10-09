"use client"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
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
 Bell,
 MessageSquare,
 ShoppingBag,
 TrendingUp,
 Home,
 Grid,
 Store,
} from "lucide-react"
import { hasSufficientRole } from "@/lib/roles"
import { useState, useEffect, useRef, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/store"
import { cn, getInitials, formatRupiah } from "@/lib/utils"
import { RobuxCoin } from "@/components/ui/robux-decorations"

interface NavLinkItem {
  href: string
  label: string
}

function DesktopNav({ navLinks }: { navLinks: NavLinkItem[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isLinkActive = (link: NavLinkItem) => {
    const [targetPath, targetQueryString] = link.href.split("?")

    if (targetQueryString) {
      if (pathname !== targetPath) return false
      const targetParams = new URLSearchParams(targetQueryString)
      for (const [key, value] of targetParams.entries()) {
        if (searchParams.get(key) !== value) {
          return false
        }
      }
      return true
    }

    if (pathname === targetPath || (targetPath !== "/" && pathname.startsWith(targetPath + "/"))) {
      if (targetPath === "/products") {
        const currentCategory = searchParams.get("category")
        if (currentCategory && ["gamepass", "robux"].includes(currentCategory)) {
          return false
        }
      }
      return true
    }

    return false
  }

  return (
    <nav className="hidden lg:flex items-center gap-6 ml-6 h-full">
      {navLinks.map((link) => {
        const isActive = isLinkActive(link)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative flex items-center h-full text-[15px] font-semibold transition-colors duration-200",
              isActive
                ? "text-[#111827]"
                : "text-[#6B7280] hover:text-[#111827]"
            )}
          >
            {link.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-gradient-to-r from-[#FFD700] to-[#FFB800] animate-scale-in" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

function DesktopNavFallback({ navLinks }: { navLinks: NavLinkItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="hidden lg:flex items-center gap-6 ml-6 h-full">
      {navLinks.map((link) => {
        const isActive = pathname === link.href && !link.href.includes("?")
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative flex items-center h-full text-[15px] font-semibold transition-colors duration-200",
              isActive
                ? "text-[#111827]"
                : "text-[#6B7280] hover:text-[#111827]"
            )}
          >
            {link.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-gradient-to-r from-[#FFD700] to-[#FFB800]" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

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

 // Dummy balance for preview
 const walletBalance = 150000

 useEffect(() => {
 const t = setTimeout(() => setMounted(true), 0)
 return () => clearTimeout(t)
 }, [])

 useEffect(() => {
 const handleScroll = () => setScrolled(window.scrollY > 10)
 window.addEventListener("scroll", handleScroll, { passive: true })
 return () => window.removeEventListener("scroll", handleScroll)
 }, [])

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

 const isSeller = mounted && user && hasSufficientRole(user.role,"seller")

 const navLinks = [
 { href:"/products", label:"Marketplace"},
 { href:"/products?category=gamepass", label:"Gamepass"},
 { href:"/products?category=robux", label:"Robux"},
 { href:"/promo", label:"Promo"},
 ]

 const userMenuItems = [
 { href:"/profile", label:"Profil Saya", icon: User },
 { href:"/wallet", label:"Dompet", icon: Wallet },
 { href:"/transactions", label:"Transaksi", icon: ShoppingCart },
 { href:"/chat", label:"Pesan", icon: MessageCircle },
 ...(isSeller ? [{ href:"/seller/dashboard", label:"Dashboard Seller", icon: TrendingUp }] : []),
 ]

 // Mobile bottom nav links
 const mobileNavLinks = [
 { href:"/", label:"Beranda", icon: Home },
 { href:"/products", label:"Eksplor", icon: Grid },
 { href:"/chat", label:"Chat", icon: MessageSquare, badge: 2 },
 { href:"/transactions", label:"Transaksi", icon: ShoppingCart },
 { href: user ?"/profile":"/login", label:"Profil", icon: User },
 ]

 return (
 <>
 <header
 className={cn("sticky top-0 z-50 w-full transition-all duration-300",
 scrolled
 ?"glass-strong shadow-sm border-b border-[rgba(255,255,255,0.2)]":"bg-white/80 backdrop-blur-md border-b border-[#EAEAEA]")}
 >
 <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
 {/* Logo */}
 <Link
 href="/"className="flex items-center gap-2.5 shrink-0 group hover-lift">
 <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#111827] to-[#1F2937] shadow-sm">
 <RobuxCoin className="h-6 w-6 transform transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300"/>
 <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-[rgba(255,215,0,0.3)] pointer-events-none"/>
 </div>
 <span className="hidden sm:block text-xl font-black tracking-tight text-[#111827]">
 Lapak<span className="text-[#D4A017]">Ro</span>
 </span>
 </Link>

        {/* Desktop Nav Links */}
        <Suspense fallback={<DesktopNavFallback navLinks={navLinks} />}>
          <DesktopNav navLinks={navLinks} />
        </Suspense>

 {/* Search Bar */}
 <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[500px] ml-auto lg:ml-8 mr-4">
 <div className={cn("relative w-full transition-all duration-300 group",
 searchFocused ?"scale-[1.02]":"")}>
 <div className="absolute inset-y-0 left-0 flex items-center pl-3">
 <Search className={cn("h-4 w-4 transition-colors",
 searchFocused ?"text-[#D4A017]":"text-[#6B7280]")} />
 </div>
 <input
 type="text"value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 onFocus={() => setSearchFocused(true)}
 onBlur={() => setSearchFocused(false)}
  placeholder="Cari Robux, Game Pass, item..."className="w-full h-11 rounded-2xl border border-[#EAEAEA] bg-[#F5F5F5] pl-10 pr-12 text-[14px] text-[#111827] placeholder:text-[#6B7280] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all shadow-inner"/>
 <div className="absolute inset-y-0 right-0 flex items-center pr-2">
 <div className="flex h-6 items-center rounded-lg border border-[#EAEAEA] bg-white px-2 text-[10px] font-semibold text-[#6B7280] shadow-sm">
 ⌘K
 </div>
 </div>
 </div>
 </form>

 {/* Right Actions */}
 <div className="flex items-center gap-1 sm:gap-2 ml-auto md:ml-0">
 {/* Wallet Preview (Desktop) */}
 {mounted && isAuthenticated && (
 <Link
  href="/wallet"className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#EAEAEA] bg-white hover:bg-[#F5F5F5] hover:border-[#D1D5DB] transition-all mr-2">
 <Wallet className="h-4 w-4 text-[#D4A017]"/>
 <span className="text-sm font-bold text-[#111827]">
 {formatRupiah(walletBalance)}
 </span>
 </Link>
 )}

 {/* Quick Icons */}
 {mounted && isAuthenticated && (
 <div className="hidden sm:flex items-center gap-1">
 <Link
  href="/chat"className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#111827] transition-colors">
 <MessageSquare className="h-5 w-5"/>
 <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#EF4444] border-2 border-white"/>
 </Link>
 <button
  className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#111827] transition-colors">
 <Bell className="h-5 w-5"/>
 </button>
 <div className="h-6 w-px bg-[#EAEAEA] mx-1"/>
 </div>
 )}

 {/* Auth Section */}
 {!mounted ? (
 <div className="w-32 h-10 rounded-2xl bg-[#F5F5F5] animate-shimmer"/>
 ) : isAuthenticated && user ? (
 <div className="relative"ref={menuRef}>
 <button
 onClick={() => setUserMenuOpen(!userMenuOpen)}
 className={cn("flex items-center gap-2 rounded-full p-1 pr-3 border transition-all hover-lift",
 userMenuOpen
  ?"bg-white border-[#D1D5DB] shadow-sm":"bg-[#F5F5F5] border-transparent hover:bg-white hover:border-[#EAEAEA]")}
 >
 <div className="relative">
 <Avatar className="h-8 w-8 border border-[#EAEAEA]">
 <AvatarFallback className="bg-gradient-to-br from-[#111827] to-[#1F2937] text-white text-xs font-bold">
 {getInitials(user.name)}
 </AvatarFallback>
 </Avatar>
 <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#22C55E] border-2 border-white"/>
 </div>
 <div className="hidden sm:flex flex-col items-start justify-center">
 <span className="text-sm font-bold text-[#111827] leading-none">
  {user.name.split(' ')[0]}
 </span>
 </div>
 <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-[#6B7280] ml-1"/>
 </button>

 {/* User Dropdown */}
 {userMenuOpen && (
 <div className="absolute right-0 z-50 mt-3 w-64 origin-top-right animate-scale-in">
 <div className="rounded-2xl border border-[#EAEAEA] bg-white p-2 shadow-premium-xl">
 {/* User info header */}
 <div className="px-3 py-3 mb-1">
 <div className="flex items-center gap-3">
 <Avatar className="h-10 w-10 border border-[#EAEAEA]">
 <AvatarFallback className="bg-gradient-to-br from-[#111827] to-[#1F2937] text-white text-sm font-bold">
 {getInitials(user.name)}
 </AvatarFallback>
 </Avatar>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-bold text-[#111827] truncate">
 {user.name}
 </p>
 <Badge variant="gold"className="mt-1 text-[10px] px-1.5 py-0">
  {hasSufficientRole(user.role, 'seller') ? (user.role === 'admin' || user.role === 'owner' ? 'Admin' : 'Seller') : 'Member'}
 </Badge>
 </div>
 </div>
 </div>

 <div className="h-px w-full bg-[#EAEAEA] my-1"/>

 {/* Menu Items */}
 <div className="py-1 space-y-0.5">
 {userMenuItems.map((item) => {
 const Icon = item.icon
 return (
 <Link
 key={item.href}
 href={item.href}
  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#111827] transition-colors"onClick={() => setUserMenuOpen(false)}
 >
 <Icon className="h-4 w-4"/>
 {item.label}
 </Link>
 )
 })}

 {(user.role ==="admin"|| user.role ==="owner") && (
 <Link
 href="/admin"className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-[#D4A017] bg-[rgba(255,215,0,0.1)] hover:bg-[rgba(255,215,0,0.2)] transition-colors mt-1"onClick={() => setUserMenuOpen(false)}
 >
 <LayoutDashboard className="h-4 w-4"/>
 {user.role ==="owner"?"Owner Panel":"Admin Panel"}
 </Link>
 )}
 </div>

 <div className="h-px w-full bg-[#EAEAEA] my-1"/>

 {/* Logout */}
 <div className="py-1">
 <button
 onClick={() => {
 logout()
 setUserMenuOpen(false)
 router.push("/")
 }}
  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#EF4444] hover:bg-[#FEE2E2] transition-colors">
 <LogOut className="h-4 w-4"/>
 Keluar
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 ) : (
 <div className="flex items-center gap-2">
 <Link href="/login"className="hidden sm:block">
 <Button variant="ghost"className="font-bold">Masuk</Button>
 </Link>
 <Link href="/register">
 <Button variant="gold"className="font-bold">Daftar</Button>
 </Link>
 </div>
 )}
 </div>
 </div>
 </header>

 {/* Mobile Bottom Navigation Bar */}
 <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-[rgba(255,255,255,0.2)] pb-safe">
 <div className="flex items-center justify-around h-16 px-2">
 {mobileNavLinks.map((link) => {
 const Icon = link.icon
  const isActive = pathname === link.href || (link.href !=="/"&& (pathname.startsWith(link.href +"/") || pathname.startsWith(link.href +"?")))
 return (
 <Link
 key={link.href}
 href={link.href}
 className="relative flex flex-col items-center justify-center w-full h-full space-y-1">
 <div className={cn("flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
 isActive ?"bg-[rgba(255,215,0,0.15)] text-[#D4A017]":"text-[#6B7280]")}>
 <Icon className="h-5 w-5"/>
 {link.badge && (
 <span className="absolute top-1 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#EF4444] text-[8px] font-bold text-white border-2 border-white">
 {link.badge}
 </span>
 )}
 </div>
 <span className={cn("text-[10px] font-bold transition-colors",
 isActive ?"text-[#D4A017]":"text-[#6B7280]")}>
 {link.label}
 </span>
 </Link>
 )
 })}
 </div>
 </div>
 </>
 )
}
