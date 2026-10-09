"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
 BarChart3,
 Package,
 PlusCircle,
 Settings,
 ShoppingCart,
 MessageSquare,
 Wallet,
 Store,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
const sidebarLinks = [
 {
 title:"Overview",
 href:"/seller/dashboard",
 icon: BarChart3,
 },
 {
 title:"Kelola Produk",
 href:"/seller/products",
 icon: Package,
 },
 {
 title:"Tambah Produk",
 href:"/seller/products/new",
 icon: PlusCircle,
 },
 {
 title:"Pesanan Masuk",
 href:"/transactions",
 icon: ShoppingCart,
 },
 {
 title:"Pesan",
 href:"/chat",
 icon: MessageSquare,
 },
 {
 title:"Dompet & Penarikan",
 href:"/wallet",
 icon: Wallet,
 },
 {
 title:"Pengaturan Toko",
 href:"/profile",
 icon: Settings,
 },
]

export function Sidebar() {
 const pathname = usePathname()

 return (
 <aside className="hidden lg:block w-64 shrink-0">
 <div className="sticky top-24 rounded-3xl glass p-4">
 <div className="mb-6 px-2 flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#111827] to-[#1F2937] shadow-sm">
 <Store className="h-5 w-5 text-white"/>
 </div>
 <div>
 <h3 className="font-bold text-[#111827]">Seller Center</h3>
 <p className="text-xs text-[#6B7280]">Manage your store</p>
 </div>
 </div>

  <nav className="space-y-1.5">
  {sidebarLinks.map((link) => {
  const Icon = link.icon
  // Fix: gunakan longest-prefix match dengan segment boundary.
  // Sebelumnya pathname.startsWith(link.href) membuat
  // "/seller/products/new" mengaktifkan BOTH "/seller/products"
  // dan "/seller/products/new" sekaligus.
  const matches = (href: string) =>
  pathname === href || pathname.startsWith(href + "/")
  const isActive =
  matches(link.href) &&
  !sidebarLinks.some(
  (other) =>
  other.href.length > link.href.length && matches(other.href)
  )

 return (
 <Link
 key={link.href}
 href={link.href}
  className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 group relative overflow-hidden",
  isActive
  ?"text-[#111827] shadow-sm":"text-[#6B7280] hover:text-[#111827] hover:bg-white/50")}
 >
 {isActive && (
 <span className="absolute inset-0 bg-white rounded-xl -z-10"/>
 )}
 {isActive && (
 <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#FFD700] rounded-r-full"/>
 )}
  <Icon className={cn("h-4 w-4 transition-colors",
  isActive ?"text-[#FFD700]":"group-hover:text-[#111827]")} />
 {link.title}
 </Link>
 )
 })}
 </nav>

 <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1A1A2E] text-white">
 <h4 className="text-sm font-bold text-[#FFD700] mb-1">Butuh Bantuan?</h4>
 <p className="text-xs text-[#6B7280] mb-3">
 Pelajari panduan berjualan di LapakRo untuk tingkatkan penjualan.
 </p>
 <Button variant="outline"size="sm"className="w-full h-8 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20">
 Pusat Bantuan
 </Button>
 </div>
 </div>
 </aside>
 )
}
