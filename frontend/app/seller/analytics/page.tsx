"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRupiah } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

const monthlyData = [
  { month: "Jan", revenue: 150000, orders: 12 },
  { month: "Feb", revenue: 200000, orders: 18 },
  { month: "Mar", revenue: 175000, orders: 15 },
  { month: "Apr", revenue: 300000, orders: 25 },
  { month: "Mei", revenue: 250000, orders: 22 },
  { month: "Jun", revenue: 350000, orders: 30 },
]

const topProducts = [
  { name: "Robux 1000 + Bonus 50", sales: 45, revenue: 1125000 },
  { name: "Game Pass Premium VIP", sales: 32, revenue: 480000 },
  { name: "Jasa Boosting Rank", sales: 28, revenue: 2800000 },
  { name: "Item Avatar Limited", sales: 12, revenue: 600000 },
  { name: "Robux 400 + Bonus 25", sales: 10, revenue: 120000 },
]

const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue))

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Lihat performa penjualan Anda
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">Total Pendapatan</p>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {formatRupiah(1425000)}
            </p>
            <p className="mt-1 text-xs text-emerald-500">+12.5% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">Total Pesanan</p>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">122</p>
            <p className="mt-1 text-xs text-emerald-500">+8.2% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">Konversi</p>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">4.2%</p>
            <p className="mt-1 text-xs text-red-500">-0.5% dari bulan lalu</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pendapatan Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {monthlyData.map((d) => {
                const height = (d.revenue / maxRevenue) * 100
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-slate-400">
                      {formatRupiah(d.revenue).replace("Rp", "").trim()}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-violet-500 transition-all hover:bg-violet-600"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-slate-500">{d.month}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-400 w-5">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {product.sales} terjual
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatRupiah(product.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
