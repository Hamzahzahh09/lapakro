"use client"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { formatRupiah } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShoppingBag, CheckCircle, AlertCircle } from "lucide-react"

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  stock: number
  seller?: { name: string }
}

function NewTransactionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const productId = searchParams.get("productId")
  const quantity = parseInt(searchParams.get("quantity") || "1", 10)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    if (!productId) {
      router.push("/products")
      return
    }
    api
      .get<{ success: boolean; data: Product }>(`/products/${productId}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Produk tidak ditemukan."))
      .finally(() => setLoading(false))
  }, [productId, isAuthenticated, router])

  const handleOrder = async () => {
    if (!product || !user) return
    setSubmitting(true)
    setError("")
    try {
      const res = await api.post<{ success: boolean; data: { id: string } }>("/transactions", {
        productId: product.id,
        quantity,
        notes,
      })
      if (res.success) {
        setSuccess(res.data.id)
      }
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e?.message || "Gagal membuat pesanan, coba lagi.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A017]" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Pesanan Berhasil Dibuat!</h1>
        <p className="text-slate-500 mb-6">ID Transaksi: <span className="font-mono font-semibold text-slate-700">{success}</span></p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => router.push(`/transactions/${success}`)}>
            Lihat Detail Transaksi
          </Button>
          <Button variant="outline" onClick={() => router.push("/transactions")}>
            Semua Transaksi
          </Button>
        </div>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-slate-600 mb-4">{error}</p>
        <Button variant="outline" onClick={() => router.push("/products")}>
          Kembali ke Produk
        </Button>
      </div>
    )
  }

  if (!product) return null

  const totalPrice = product.price * quantity

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Konfirmasi Pesanan</h1>
        <p className="text-sm text-slate-500 mt-1">Periksa detail pesanan sebelum melanjutkan</p>
      </div>

      <div className="space-y-4">
        {/* Product Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Detail Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="h-20 w-20 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{product.title}</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Penjual: {product.seller?.name || "—"}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-slate-500">{quantity} x {formatRupiah(product.price)}</span>
                  <span className="font-bold text-[#A67C0A]">{formatRupiah(totalPrice)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Catatan untuk Seller <span className="text-slate-400 font-normal text-sm">(opsional)</span></CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Tulis catatan atau permintaan khusus..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700] resize-none"
            />
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-slate-500">Subtotal</span>
              <span>{formatRupiah(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-base border-t border-slate-100 pt-2 mt-2">
              <span>Total</span>
              <span className="text-[#A67C0A]">{formatRupiah(totalPrice)}</span>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => router.back()} disabled={submitting}>
            Kembali
          </Button>
          <Button className="flex-1" onClick={handleOrder} disabled={submitting}>
            {submitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
            ) : (
              "Buat Pesanan"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function NewTransactionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A017]" />
      </div>
    }>
      <NewTransactionForm />
    </Suspense>
  )
}
