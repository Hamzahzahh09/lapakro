"use client"
import { ShoppingCart, ArrowRight, Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatRupiah } from "@/lib/utils"
import { useCartStore } from "@/lib/store"
import Link from "next/link"
import { EmptyState } from "@/components/ui/empty-state"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const serviceFee = items.length > 0 ? 2500 : 0

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-6 pb-24">
        <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none -z-10" />
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#FFD700]/10 to-transparent pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm font-bold text-[#D4A017] mb-2">
              <ShoppingCart className="h-4 w-4" />
              <span>KERANJANG BELANJA</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A]">Keranjang Anda</h1>
          </div>

          <EmptyState
            icon={<ShoppingBag className="h-12 w-12" />}
            title="Keranjang kosong"
            description="Belum ada produk di keranjang Anda. Yuk mulai belanja!"
            action={{
              label: "Lihat Produk",
              href: "/products",
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-6 pb-24">
      <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none -z-10" />
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#FFD700]/10 to-transparent pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#D4A017] mb-2">
              <ShoppingCart className="h-4 w-4" />
              <span>KERANJANG BELANJA</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A]">
              Keranjang Anda
            </h1>
            <p className="text-[#6B7280] mt-1">{items.length} produk</p>
          </div>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={clearCart}>
            <Trash2 className="h-4 w-4 mr-1" />
            Hapus Semua
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="h-20 w-20 bg-gray-50 rounded-xl shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover rounded-xl" />
                    ) : (
                      <ShoppingCart className="h-8 w-8 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#0F172A]">{item.title}</h3>
                    <p className="text-sm text-[#6B7280]">Penjual: {item.seller}</p>
                    <p className="font-black text-[#D4A017] mt-1">{formatRupiah(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t border-gray-100 sm:border-0 pt-4 sm:pt-0 mt-4 sm:mt-0">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-gray-200"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-bold w-6 text-center text-[#0F172A]">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-gray-200"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white border border-gray-100 shadow-sm sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-[#0F172A]">Ringkasan Belanja</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Total Harga ({items.length} barang)</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Biaya Layanan</span>
                    <span>{formatRupiah(serviceFee)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between">
                    <span className="font-bold text-[#0F172A]">Total Tagihan</span>
                    <span className="font-black text-xl text-[#0F172A]">{formatRupiah(total + serviceFee)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="block w-full">
                  <Button variant="gold" className="w-full shadow-md font-bold" size="lg">
                    Beli ({items.length}) <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
