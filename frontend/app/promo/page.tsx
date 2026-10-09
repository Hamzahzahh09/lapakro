"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import type { ProductItem } from "@/components/products/product-grid"
import { BadgePercent, Loader2, ShoppingBag, ArrowRight, Ticket } from "lucide-react"
import { api } from "@/lib/api"

export default function PromoPage() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<{ success: boolean; data: ProductItem[]; total: number }>("/products", {
        params: { limit: 8, sortBy: "sold" },
      })
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-6 pb-24">
      <div className="fixed inset-0 bg-cubes opacity-30 pointer-events-none -z-10" />
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#FFD700]/10 to-transparent pointer-events-none -z-10" />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-bold text-[#D4A017] mb-2">
            <BadgePercent className="h-4 w-4" />
            <span>PROMO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A]">
            Promo Spesial
          </h1>
          <p className="mt-2 text-[#6B7280] max-w-2xl">
            Penawaran terbaik untuk Robux, Game Pass, dan aset Roblox lainnya dari penjual terpercaya.
          </p>
        </div>

        <div className="bg-gradient-to-r from-[#FFD700] to-[#FFB800] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-gold-lg overflow-hidden relative mb-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl" />
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F172A]/10 mb-4">
              <Ticket className="h-4 w-4 text-[#0F172A]" />
              <span className="text-xs font-bold text-[#0F172A] tracking-wide uppercase">
                Penawaran terbatas
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] mb-2">
              Diskon s.d. 50% Produk Pilihan
            </h2>
            <p className="text-[#0F172A]/80 font-medium">
              Jangan lewatkan produk terlaris dengan harga spesial minggu ini.
            </p>
          </div>
          <div className="relative z-10">
            <Link href="/products">
              <Button size="xl" className="bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-xl font-bold">
                Belanja Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#0F172A]">Produk Terlaris</h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#D4A017] hover:text-[#FFB800] transition-colors"
          >
            Lihat Semua
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-[#D4A017]" />
            <p className="text-[#6B7280] font-medium">Memuat promo...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#6B7280] mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">Belum ada promo</h3>
            <p className="text-[#6B7280] mb-6">Promo spesial segera hadir. Pantau terus halaman ini!</p>
            <Link href="/products">
              <Button variant="gold">Jelajahi Produk</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
