"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/store"
import { hasSufficientRole } from "@/lib/roles"
import { formatRupiah } from "@/lib/utils"
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  PlusCircle,
  Settings,
  ArrowRight,
  Loader2,
  AlertCircle,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  RefreshCw,
} from "lucide-react"

interface Transaction {
  id: string
  productId: string
  buyerId: string
  totalPrice: number
  status: string
  createdAt: string
}

interface Product {
  id: string
  title: string
  price: number
  status: string
  soldCount: number
  isDeleted?: boolean
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  completed: { label: "Selesai", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400", icon: CheckCircle2 },
  pending: { label: "Menunggu", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400", icon: Clock },
  awaiting_seller: { label: "Konfirmasi Seller", color: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400", icon: Clock },
  awaiting_buyer: { label: "Konfirmasi Buyer", color: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400", icon: Clock },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400", icon: XCircle },
  disputed: { label: "Dispute", color: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400", icon: AlertCircle },
}

export default function SellerDashboardPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token || !user) {
      router.push("/login")
      return
    }
    if (!hasSufficientRole(user.role, "seller")) {
      router.push("/")
      return
    }
    loadData()
  }, [token, user])

  const loadData = async () => {
    setError("")
    setLoading(true)
    try {
      const [txRes, prodRes] = await Promise.all([
        api.get<{ success: boolean; data: Transaction[] }>("/transactions"),
        api.get<{ success: boolean; data: Product[] }>("/products/mine"),
      ])
      setTransactions(txRes.data || [])
      setProducts(prodRes.data || [])
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
          <p className="text-sm text-slate-500">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-8 rounded-2xl max-w-md text-center border border-red-200 dark:border-red-800">
          <AlertCircle className="h-10 w-10 mx-auto mb-3" />
          <p className="font-semibold text-lg">Gagal memuat dashboard</p>
          <p className="text-sm mt-1 opacity-80">{error}</p>
          <button
            onClick={loadData}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  const activeProducts = products.filter((p) => p.status === "active" && !p.isDeleted).length
  const pendingProducts = products.filter((p) => p.status === "pending").length
  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + Number(t.totalPrice), 0)
  const totalSold = products.reduce((sum, p) => sum + (p.soldCount || 0), 0)
  const completedTx = transactions.filter((t) => t.status === "completed").length
  const pendingTx = transactions.filter((t) => ["pending", "awaiting_seller", "awaiting_buyer"].includes(t.status)).length

  const stats = [
    {
      label: "Total Pendapatan",
      value: formatRupiah(totalRevenue),
      sub: `Dari ${completedTx} transaksi selesai`,
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20",
    },
    {
      label: "Produk Terjual",
      value: totalSold.toString(),
      sub: `${activeProducts} produk aktif`,
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
    },
    {
      label: "Transaksi",
      value: transactions.length.toString(),
      sub: `${pendingTx} menunggu konfirmasi`,
      icon: ShoppingCart,
      color: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/20",
    },
    {
      label: "Produk",
      value: activeProducts.toString(),
      sub: pendingProducts > 0 ? `+${pendingProducts} pending review` : `${products.length} total produk`,
      icon: Package,
      color: "from-violet-500 to-violet-600",
      shadow: "shadow-violet-500/20",
    },
  ]

  const quickActions = [
    { href: "/seller/products/new", label: "Tambah Produk", icon: PlusCircle, desc: "Buat listing baru" },
    { href: "/seller/products", label: "Kelola Produk", icon: Package, desc: "Edit & atur stok" },
    { href: "/transactions", label: "Lihat Transaksi", icon: ShoppingCart, desc: "Pantau pesanan" },
    { href: "/profile", label: "Pengaturan Toko", icon: Settings, desc: "Atur profil seller" },
  ]

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="border-b border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-md shadow-violet-500/20">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Seller Dashboard
                </h1>
              </div>
              <p className="text-slate-500 mt-2 text-sm">
                Kelola toko dan produk Anda di LapakRo
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/seller/products/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl hover:from-violet-600 hover:to-violet-700 font-medium transition-all shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30 text-sm"
              >
                <PlusCircle className="h-4 w-4" />
                Tambah Produk
              </Link>
              <Link
                href="/seller/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors text-sm"
              >
                <Package className="h-4 w-4" />
                Kelola Produk
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} shadow-md ${stat.shadow}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{stat.sub}</p>
              </div>
            )
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaksi Terbaru */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Transaksi Terbaru</h2>
              {transactions.length > 5 && (
                <Link
                  href="/transactions"
                  className="inline-flex items-center gap-1 text-sm text-violet-500 hover:text-violet-600 font-medium"
                >
                  Lihat Semua
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="mt-3 text-slate-500 dark:text-slate-400">Belum ada transaksi</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Promosikan produk Anda untuk mendapatkan pembeli</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-left">
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">ID</th>
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Total</th>
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Status</th>
                      <th className="pb-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {transactions.slice(0, 5).map((tx) => {
                      const config = statusConfig[tx.status] || { label: tx.status, color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300", icon: Clock }
                      return (
                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="py-3.5 text-slate-900 dark:text-slate-200 font-mono text-xs">#{tx.id.slice(0, 8)}</td>
                          <td className="py-3.5 text-slate-900 dark:text-slate-200 font-medium">{formatRupiah(Number(tx.totalPrice))}</td>
                          <td className="py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                              {config.label}
                            </span>
                          </td>
                          <td className="py-3.5 text-slate-500 dark:text-slate-400 text-xs">{new Date(tx.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Produk Saya */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Produk Saya</h2>
              {products.length > 5 && (
                <Link
                  href="/seller/products"
                  className="inline-flex items-center gap-1 text-sm text-violet-500 hover:text-violet-600 font-medium"
                >
                  Semua
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
            {products.length === 0 ? (
              <div className="text-center py-10">
                <Package className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="mt-3 text-slate-500 dark:text-slate-400">Belum ada produk</p>
                <Link
                  href="/seller/products/new"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-violet-500 hover:text-violet-600 font-medium"
                >
                  Tambah produk sekarang
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {products.slice(0, 5).map((p) => {
                  const statusColors: Record<string, string> = {
                    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
                    pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
                    rejected: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
                  }
                  const statusLabels: Record<string, string> = {
                    active: "Aktif",
                    pending: "Pending",
                    rejected: "Ditolak",
                  }
                  return (
                    <Link
                      key={p.id}
                      href={`/seller/products/${p.id}/edit`}
                      className="block p-3.5 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-950/10 transition-all"
                    >
                      <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{p.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formatRupiah(Number(p.price))}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status] || "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                          {statusLabels[p.status] || p.status}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-950/10 transition-all group"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 group-hover:bg-violet-100 dark:group-hover:bg-violet-950/50 transition-colors">
                    <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{action.label}</span>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{action.desc}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
