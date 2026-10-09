"use client"
import { useState, useEffect } from "react"
import { BarChart3, ShoppingBag, Wallet, TrendingUp, Package, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { formatRupiah } from "@/lib/utils"
import Link from "next/link"
interface DashboardTransaction {
  id: string
  status: string
  totalPrice: number
  sellerId?: string
  buyerId?: string
  createdAt: string
  product?: { name?: string; title?: string }
  buyer?: { name?: string }
  seller?: { name?: string }
}

interface MineProduct {
  id: string
  status: string
}

export default function SellerDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
  totalSales: 0,
  totalOrders: 0,
  activeProducts: 0,
  pendingOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState<DashboardTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  let cancelled = false
  const load = async () => {
  try {
  const [trxRes, prodRes] = await Promise.all([
  api.get<{ success: boolean; data: DashboardTransaction[]; total?: number }>(
  "/transactions",
  { params: { page: 1, limit: 100 } }
  ),
  api.get<{ success: boolean; data: MineProduct[] }>("/products/mine"),
  ])
  if (cancelled) return
  const allTrx = trxRes.data || []
  // Hanya hitung sebagai seller (pesanan masuk ke toko saya)
  const mySales = user?.id
  ? allTrx.filter((t) => t.sellerId === user.id)
  : allTrx
  const pending = mySales.filter((t) => t.status === "pending")
  const completed = mySales.filter((t) => t.status === "completed")
  const totalSales = completed.reduce((sum, t) => sum + (t.totalPrice || 0), 0)
  const products = prodRes.data || []
  const activeProducts = products.filter((p) => p.status === "active").length
  setStats({
  totalSales,
  totalOrders: mySales.length,
  activeProducts,
  pendingOrders: pending.length,
  })
  setRecentOrders(mySales.slice(0, 4))
  } catch {
  // Biarkan 0 jika API gagal, jangan tampilkan angka palsu
  if (!cancelled) setRecentOrders([])
  } finally {
  if (!cancelled) setLoading(false)
  }
  }
  load()
  return () => { cancelled = true }
  }, [user?.id])

 return (
 <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-[#F8FAFC]">
 {/* Header Banner */}
 <div className="rounded-3xl bg-gradient-to-r from-white to-[#F8FAFC] p-8 text-[#0F172A] relative overflow-hidden shadow-sm border border-gray-100">
 <div className="absolute inset-0 bg-cubes opacity-20 pointer-events-none"/>
 <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700] rounded-full blur-[100px] opacity-20 pointer-events-none"/>
 
 <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
 <div>
 <h1 className="text-3xl font-black mb-2">Halo, {user?.name}! 👋</h1>
 <p className="text-[#6B7280] text-lg">Pantau performa toko dan pesanan Anda hari ini.</p>
 </div>
 
 <div className="flex gap-3 w-full md:w-auto">
 <Link href="/seller/products/new"className="w-full md:w-auto">
 <Button variant="gold"size="lg"className="w-full font-bold shadow-gold-lg">
 <Package className="mr-2 h-5 w-5"/>
 Tambah Produk
 </Button>
 </Link>
 </div>
 </div>
 </div>

 {/* Warning/Alert if any */}
 {stats.pendingOrders > 0 && (
 <div className="rounded-2xl border border-[#FFD700]/30 bg-[#FFFBEB] p-4 flex items-start gap-3 shadow-sm">
 <AlertCircle className="h-5 w-5 text-[#D4A017] shrink-0 mt-0.5"/>
 <div>
 <h3 className="text-sm font-bold text-[#D4A017]">Pesanan Menunggu Diproses</h3>
 <p className="text-sm text-[#D4A017]/80 mt-1">Anda memiliki {stats.pendingOrders} pesanan yang harus segera diproses agar performa toko tetap baik.</p>
 <Link href="/transactions">
 <Button variant="link"className="px-0 h-auto text-sm mt-2 font-bold text-[#D4A017]">Lihat Pesanan →</Button>
 </Link>
 </div>
 </div>
 )}

 {/* Stats Grid */}
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
 {[
  {
  title:"Total Pendapatan",
  value: formatRupiah(stats.totalSales),
  icon: Wallet,
  color:"text-[#22C55E]",
  bg:"bg-[#22C55E]/10",
  },
  {
  title:"Total Pesanan",
  value: stats.totalOrders.toLocaleString('id-ID'),
  icon: ShoppingBag,
  color:"text-[#3B82F6]",
  bg:"bg-[#3B82F6]/10",
  },
  {
  title:"Produk Aktif",
  value: stats.activeProducts,
  icon: Package,
color:"text-[#0F172A]",
bg:"bg-[#0F172A]/10",
  },
  {
  title:"Pesanan Menunggu",
  value: stats.pendingOrders,
  icon: AlertCircle,
  color:"text-[#F59E0B]",
  bg:"bg-[#F59E0B]/10",
  },
  ].map((stat, i) => {
  const Icon = stat.icon
  return (
  <Card key={i} className="bg-white border border-gray-100 shadow-sm border-t-4 hover:-translate-y-1 transition-transform duration-300"style={{ borderTopColor: i === 0 ?'#22C55E': i === 1 ?'#3B82F6': i === 2 ?'#0F172A':'#F59E0B'}}>
  <CardContent className="p-6">
  <div className="flex items-center justify-between mb-4">
  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
  <Icon className={`h-6 w-6 ${stat.color}`} />
  </div>
  </div>
 <div>
 <p className="text-sm font-bold text-[#6B7280] mb-1">{stat.title}</p>
 {loading ? (
 <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse"/>
 ) : (
 <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">{stat.value}</h3>
 )}
 </div>
 </CardContent>
 </Card>
 )
 })}
 </div>

 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
 {/* Chart Area */}
 <Card className="md:col-span-2 lg:col-span-4 min-h-[400px] flex flex-col bg-white border border-gray-100 shadow-sm">
 <CardHeader>
 <CardTitle className="text-lg flex items-center gap-2 text-[#0F172A]">
 <BarChart3 className="h-5 w-5 text-[#D4A017]"/>
 Statistik Penjualan
 </CardTitle>
 </CardHeader>
 <CardContent className="flex-1 flex items-center justify-center border-t border-gray-100 m-6 rounded-2xl bg-[#F8FAFC]">
 <div className="text-center text-[#6B7280]">
 <BarChart3 className="mx-auto h-12 w-12 mb-3 opacity-20"/>
 <p className="font-medium">Grafik penjualan akan tampil di sini</p>
 </div>
 </CardContent>
 </Card>

 {/* Recent Orders List */}
 <Card className="md:col-span-2 lg:col-span-3 bg-white border border-gray-100 shadow-sm">
 <CardHeader className="flex flex-row items-center justify-between">
  <CardTitle className="text-lg text-[#0F172A]">Pesanan Terbaru</CardTitle>
  <Link href="/transactions">
  <Button variant="ghost"size="sm"className="text-[#D4A017] hover:text-[#FFB800] hover:bg-[#FFFBEB]">Lihat Semua</Button>
  </Link>
 </CardHeader>
  <CardContent>
  {loading ? (
  <div className="space-y-4">
  {[1, 2, 3].map((i) => (
  <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
  ))}
  </div>
  ) : recentOrders.length === 0 ? (
  <div className="py-8 text-center text-sm text-[#6B7280]">
  Belum ada pesanan masuk.
  </div>
  ) : (
  <div className="space-y-4">
  {recentOrders.map((trx) => (
  <div key={trx.id} className="flex items-center gap-4 rounded-2xl border border-gray-100 p-3 hover:border-[#FFD700] transition-colors bg-white">
  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#D4A017] shrink-0 opacity-20"/>
  <div className="flex-1 min-w-0">
  <p className="text-sm font-bold text-[#0F172A] truncate">{trx.product?.title || trx.product?.name || "Produk"}</p>
  <p className="text-xs text-[#6B7280] mt-0.5">Pembeli: {trx.buyer?.name || "-"}</p>
  </div>
  <div className="text-right shrink-0">
  <Badge variant={trx.status === "completed" ? "success" : trx.status === "cancelled" ? "destructive" : "warning"} className="mb-1 block w-fit ml-auto">
  {trx.status === "pending" ? "Menunggu" : trx.status === "awaiting_buyer" ? "Diproses" : trx.status === "completed" ? "Selesai" : trx.status}
  </Badge>
  <p className="text-xs font-bold text-[#0F172A]">{formatRupiah(trx.totalPrice)}</p>
  </div>
  </div>
  ))}
  </div>
  )}
  </CardContent>
 </Card>
 </div>
 </div>
 )
}
