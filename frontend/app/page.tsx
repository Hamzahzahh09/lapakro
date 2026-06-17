"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import type { ProductItem } from "@/components/products/product-grid"
import { ArrowRight, Shield, HeadphonesIcon, Zap, Gamepad2, ShoppingBag, Users, Star, Search, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

const categories = [
  { id: "robux", name: "Robux", icon: Gamepad2, color: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400" },
  { id: "gamepass", name: "Game Pass", icon: Zap, color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400" },
  { id: "avatar", name: "Item Avatar", icon: ShoppingBag, color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400" },
  { id: "account", name: "Akun", icon: Users, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
  { id: "boosting", name: "Boosting", icon: Zap, color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400" },
  { id: "joki", name: "Joki", icon: Star, color: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400" },
]

const steps = [
  { icon: ShoppingBag, title: "Pesan", description: "Pilih produk dan lakukan pemesanan" },
  { icon: Shield, title: "Escrow", description: "Pembayaran aman direkening escrow" },
  { icon: HeadphonesIcon, title: "Terima", description: "Konfirmasi dan dana dilepaskan" },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<{ success: boolean; data: ProductItem[]; total: number }>("/products", {
        params: { limit: 8, sortBy: "newest" },
      })
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Marketplace Produk
              <span className="block text-violet-400">Roblox Indonesia</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-300 sm:text-lg">
              Beli Robux, Game Pass, Item Avatar, Akun, dan jasa boosting dengan
              sistem escrow aman. Terpercaya di Indonesia.
            </p>
            <form onSubmit={handleSearch} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk atau jasa Roblox..."
                  className="w-full h-12 rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-white placeholder:text-slate-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>
              <Link href="/products">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
                  Jelajahi Semua
                </Button>
              </Link>
            </form>
          </div>
        </div>
      </section>

      {/* Kategori */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          Kategori Produk
        </h2>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">
                  {cat.name}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Produk Terbaru */}
      <section className="bg-slate-50 py-12 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              Produk Terbaru
            </h2>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-medium text-violet-500 hover:text-violet-600"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                <p className="mt-4 text-slate-500">Belum ada produk tersedia.</p>
                <p className="mt-1 text-sm text-slate-400">Jadilah seller pertama yang membuat listing!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="text-center text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          Cara Kerja
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Transaksi aman dengan sistem escrow
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="absolute left-[60%] top-8 hidden h-0.5 w-[60%] bg-violet-200 sm:block dark:bg-violet-800" />
                )}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-500 dark:bg-violet-950">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-violet-500 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 py-12 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Shield, label: "Sistem Escrow", desc: "Pembayaran 100% aman" },
              { icon: Users, label: "10.000+", desc: "Pengguna aktif" },
              { icon: Star, label: "4.9 Rating", desc: "Kepuasan pelanggan" },
              { icon: Zap, label: "Proses Cepat", desc: "Transaksi real-time" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="text-center rounded-xl bg-white p-6 border border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-500 dark:bg-violet-950">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                    {item.label}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
