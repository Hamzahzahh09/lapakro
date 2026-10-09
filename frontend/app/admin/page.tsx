"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Store, ShoppingBag, DollarSign, AlertTriangle, Shield, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { formatRupiah } from "@/lib/utils"
interface DashboardStats {
 totalUsers: number
 totalSellers: number
 totalTransactions: number
 gmv: number
 disputeRate: number
 pendingProducts: number
 openDisputes: number
 pendingSellerApps: number
}

export default function AdminDashboardPage() {
 const [stats, setStats] = useState<DashboardStats | null>(null)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 api.get<{ success: boolean; data: { stats: DashboardStats } }>("/admin/dashboard")
 .then((res) => setStats(res.data.stats))
 .catch(() => {})
 .finally(() => setLoading(false))
 }, [])

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[60vh]">
 <Loader2 className="h-8 w-8 animate-spin text-[#D4A017]"/>
 </div>
 )
 }

 const statCards = [
 { icon: Users, label:"Total Users", value: stats?.totalUsers?.toLocaleString() ||"0", color:"text-blue-500", bg:"bg-blue-50"},
 { icon: Store, label:"Total Sellers", value: stats?.totalSellers?.toLocaleString() ||"0", color:"text-[#0F172A]", bg:"bg-[#0F172A]/10"},
 { icon: ShoppingBag, label:"Transaksi", value: stats?.totalTransactions?.toLocaleString() ||"0", color:"text-emerald-500", bg:"bg-emerald-50"},
 { icon: DollarSign, label:"GMV", value: stats ? formatRupiah(stats.gmv) :"Rp 0", color:"text-[#D4A017]", bg:"bg-[#FFD700]/10"},
 ]

 return (
 <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
 <div className="mb-6">
 <h1 className="text-2xl font-bold text-slate-900">
 Admin Dashboard
 </h1>
 <p className="text-sm text-slate-500 mt-1">
 Pantau aktivitas marketplace
 </p>
 </div>

 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
 {statCards.map((stat) => {
 const Icon = stat.icon
 return (
 <Card key={stat.label}>
 <CardContent className="p-4">
 <div className="flex items-start justify-between">
 <div>
 <p className="text-xs text-slate-500">{stat.label}</p>
 <p className="mt-1 text-xl font-bold text-slate-900">{stat.value}</p>
 </div>
 <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
 <Icon className={`h-5 w-5 ${stat.color}`} />
 </div>
 </div>
 </CardContent>
 </Card>
 )
 })}
 </div>

 <div className="grid gap-6 lg:grid-cols-2">
 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3 mb-4">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
 <Shield className="h-5 w-5 text-amber-500"/>
 </div>
 <div>
 <p className="text-sm font-semibold text-slate-900">Pending Reviews</p>
 <p className="text-xs text-slate-500">{stats?.pendingProducts || 0} produk menunggu review</p>
 </div>
 </div>
 <Link href="/admin/listings">
 <Button variant="outline"size="sm"className="w-full gap-2">
 Review Sekarang <ArrowRight className="h-3 w-3"/>
 </Button>
 </Link>
 </CardContent>
 </Card>

 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3 mb-4">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
 <AlertTriangle className="h-5 w-5 text-red-500"/>
 </div>
 <div>
 <p className="text-sm font-semibold text-slate-900">Active Disputes</p>
 <p className="text-xs text-slate-500">{stats?.openDisputes || 0} dispute perlu ditangani</p>
 </div>
 </div>
 <Link href="/admin/disputes">
 <Button variant="outline"size="sm"className="w-full gap-2">
 Lihat Dispute <ArrowRight className="h-3 w-3"/>
 </Button>
 </Link>
 </CardContent>
 </Card>

 <Card>
 <CardContent className="p-4">
 <div className="flex items-center gap-3 mb-4">
 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
 <Users className="h-5 w-5 text-blue-500"/>
 </div>
 <div>
 <p className="text-sm font-semibold text-slate-900">Seller Applications</p>
 <p className="text-xs text-slate-500">{stats?.pendingSellerApps || 0} aplikasi menunggu review</p>
 </div>
 </div>
 <Link href="/admin/sellers">
 <Button variant="outline"size="sm"className="w-full gap-2">
 Review Sekarang <ArrowRight className="h-3 w-3"/>
 </Button>
 </Link>
 </CardContent>
 </Card>
 </div>
 </div>
 )
}
