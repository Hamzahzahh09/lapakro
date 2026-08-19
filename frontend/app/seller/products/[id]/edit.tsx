"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/store"
import { hasSufficientRole } from "@/lib/roles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@radix-ui/react-label"
const categories = [
 { value:"robux", label:"Robux"},
 { value:"gamepass", label:"Game Pass"},
 { value:"avatar", label:"Item Avatar"},
 { value:"account", label:"Akun"},
 { value:"boosting", label:"Boosting"},
 { value:"joki", label:"Joki"},
]

export default function EditProductPage() {
 const params = useParams()
 const router = useRouter()
 const user = useAuthStore((s) => s.user)
 const token = useAuthStore((s) => s.token)
 const [loading, setLoading] = useState(false)
 const [fetching, setFetching] = useState(true)
 const [error, setError] = useState("")
 const [form, setForm] = useState({
 title:"",
 description:"",
 price:"",
 category:"",
 stock:"1",
 })

  useEffect(() => {
  if (!token || !user) {
  router.push("/login")
  return
  }
  if (!hasSufficientRole(user.role,"seller")) {
  router.push("/")
  return
  }

  let cancelled = false

  const load = async () => {
  try {
  const res = await api.get<{ success: boolean; data: { title: string; description: string; price: number; category: string; stock: number } }>(`/products/${params.id}`)
  const p = res.data
  if (cancelled) return
  setForm({
  title: p.title ||"",
  description: p.description ||"",
  price: String(p.price ||""),
  category: p.category ||"",
  stock: String(p.stock ??"1"),
  })
  } catch (err: unknown) {
  if (cancelled) return
  console.error(err)
  setError("Gagal memuat data produk")
  } finally {
  if (!cancelled) setFetching(false)
  }
  }

  load()
  return () => { cancelled = true }
  }, [token, user, params?.id, router])

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setLoading(true)
 setError("")
 try {
 await api.patch(`/products/${params.id}`, {
 title: form.title,
 description: form.description,
 price: Number(form.price),
 category: form.category,
 stock: Number(form.stock) || 1,
 })
 router.push("/seller/products")
 } catch (err: unknown) {
 const e = err as { response?: { data?: { error?: { message?: string | string[] } } } };
 const msg = e.response?.data?.error?.message || "Gagal menyimpan"
 setError(Array.isArray(msg) ? msg.join(",") : msg)
 } finally {
 setLoading(false)
 }
 }

 if (fetching) {
 return (
 <div className="flex items-center justify-center min-h-[60vh]">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"/>
 </div>
 )
 }

 return (
 <div className="min-h-screen bg-gray-50">
 <div className="bg-white border-b">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
 <div className="flex items-center gap-3">
 <Link href="/seller/products"className="text-gray-400 hover:text-gray-600">
 &larr; Kembali
 </Link>
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Edit Produk</h1>
 <p className="text-sm text-gray-500 mt-0.5">Perbarui informasi produk Anda</p>
 </div>
 </div>
 </div>
 </div>

 <div className="max-w-2xl mx-auto px-4 py-8">
 <Card>
 <CardContent className="p-6">
 {error && (
 <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
 <p className="text-sm text-red-700">{error}</p>
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-5">
 <Input
 label="Nama Produk"placeholder="Contoh: Robux 1000 + Bonus 50"value={form.title}
 onChange={(e) => setForm({ ...form, title: e.target.value })}
 required
 />

 <div className="space-y-1.5">
 <Label className="text-sm font-medium text-slate-700">
 Deskripsi
 </Label>
 <textarea
 value={form.description}
 onChange={(e) => setForm({ ...form, description: e.target.value })}
 placeholder="Deskripsikan produk Anda..."rows={5}
 required
 className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"/>
 </div>

 <div className="grid gap-4 sm:grid-cols-2">
 <Input
 label="Harga (Rp)"type="number"placeholder="25000"value={form.price}
 onChange={(e) => setForm({ ...form, price: e.target.value })}
 required
 />
 <Input
 label="Stok"type="number"placeholder="1"value={form.stock}
 onChange={(e) => setForm({ ...form, stock: e.target.value })}
 />
 </div>

 <div className="space-y-1.5">
 <Label className="text-sm font-medium text-slate-700">
 Kategori
 </Label>
 <Select
 value={form.category}
 onValueChange={(value) => setForm({ ...form, category: value })}
 >
 <SelectTrigger>
 <SelectValue placeholder="Pilih kategori"/>
 </SelectTrigger>
 <SelectContent>
 {categories.map((cat) => (
 <SelectItem key={cat.value} value={cat.value}>
 {cat.label}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>

 <div className="flex gap-3 pt-2">
 <Button type="submit"className="flex-1"disabled={loading}>
 {loading ?"Menyimpan...":"Simpan Perubahan"}
 </Button>
 <Button
 type="button"variant="outline"onClick={() => router.back()}
 >
 Batal
 </Button>
 </div>
 </form>
 </CardContent>
 </Card>
 </div>
 </div>
 )
}
