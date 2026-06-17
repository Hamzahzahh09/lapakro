"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatRupiah } from "@/lib/utils"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/store"
import { hasSufficientRole } from "@/lib/roles"
import { Plus, Pencil, Trash2, Eye, Loader2 } from "lucide-react"

interface Product {
  id: string
  title: string
  price: number
  category: string
  status: string
  soldCount: number
  stock: number
  images: string[]
}

export default function SellerProductsPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !user) {
      router.push("/login")
      return
    }
    if (!hasSufficientRole(user.role, "seller")) {
      router.push("/")
      return
    }
    fetchProducts()
  }, [token, user])

  const fetchProducts = () => {
    setLoading(true)
    api.get<{ success: boolean; data: Product[] }>("/products/mine")
      .then((res) => setProducts(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return
    try {
      await api.delete(`/products/${id}`)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch {}
  }

  const badgeVariant = (status: string): "success" | "warning" | "secondary" | "destructive" => {
    switch (status) {
      case "active": return "success"
      case "pending": return "warning"
      case "rejected": return "destructive"
      default: return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Produk Saya
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola daftar produk Anda
          </p>
        </div>
        <Link href="/seller/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 dark:bg-slate-700 overflow-hidden">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-slate-900 truncate dark:text-white">
                      {product.title}
                    </h3>
                    <Badge variant={badgeVariant(product.status)} className="text-xs shrink-0">
                      {product.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span>{product.category}</span>
                    <span>{product.soldCount} terjual</span>
                    <span>Sisa: {product.stock}</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-violet-500">
                    {formatRupiah(product.price)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/products/${product.id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/seller/products/${product.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {products.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">
            Belum ada produk. Klik "Tambah Produk" untuk mulai menjual.
          </div>
        )}
      </div>
    </div>
  )
}
