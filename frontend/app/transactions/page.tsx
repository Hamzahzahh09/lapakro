"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination } from "@/components/ui/pagination"
import { EmptyState } from "@/components/ui/empty-state"
import { formatRupiah, formatDate } from "@/lib/utils"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/store"
import { Package, Search, Clock, CheckCircle2, XCircle, ChevronRight, MessageCircle, Loader2, RefreshCw } from "lucide-react"

interface Transaction {
  id: string
  createdAt: string
  status: string
  totalPrice: number
  product: {
    name: string
    category: string
  }
  seller: { name: string }
}

export default function TransactionsPage() {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchTransactions = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError("")
    try {
      const statusParam = tab === "all" ? undefined : tab
      const res = await api.get<{ success: boolean; data: Transaction[]; total: number; page: number; totalPages: number }>(
        "/transactions",
        { params: { search: search || undefined, status: statusParam, page, limit: 10 } }
      )
      setTransactions(res.data || [])
      setTotalPages(res.totalPages || 1)
      setPage(res.page || 1)
    } catch (err: unknown) {
      console.error(err)
      setError("Gagal memuat transaksi")
    } finally {
      setLoading(false)
    }
  }, [token, search, tab, page])

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions()
  }, [fetchTransactions, router, token])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Selesai</Badge>
      case "pending": return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Menunggu</Badge>
      case "awaiting_seller": return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Menunggu Penjual</Badge>
      case "awaiting_buyer": return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Menunggu Pembeli</Badge>
      case "cancelled": return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Dibatalkan</Badge>
      case "disputed": return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Dispute</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-6 pb-24">
      <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h1 className="text-3xl font-black text-[#0F172A] mb-2">Riwayat Transaksi</h1>
        <p className="text-[#6B7280] mb-8">Lacak semua pesanan pembelian dan penjualan Anda.</p>

        <Card className="bg-white border border-gray-100 shadow-sm mb-6">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Tabs value={tab} onValueChange={(v) => { setTab(v); setPage(1) }} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="pending">Berlangsung</TabsTrigger>
                <TabsTrigger value="completed">Berhasil</TabsTrigger>
                <TabsTrigger value="cancelled">Dibatalkan</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Cari transaksi..."
                className="pl-9 h-10 rounded-xl"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <div className="relative">
              <div className="absolute inset-0 bg-[#FFD700] blur-xl opacity-40 rounded-full animate-pulse-slow" />
              <Loader2 className="h-10 w-10 animate-spin text-[#D4A017] relative z-10" />
            </div>
            <p className="text-[#6B7280] font-bold">Memuat transaksi...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <RefreshCw className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-[#0F172A] font-bold text-lg mb-2">{error}</p>
            <Button variant="outline" onClick={fetchTransactions} className="mt-4 rounded-xl border-gray-200">
              Coba Lagi
            </Button>
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="Belum ada transaksi"
            description="Anda belum memiliki transaksi apapun. Mulai belanja di marketplace kami."
            action={{ label: "Mulai Belanja", href: "/products" }}
          />
        ) : (
          <>
            <div className="space-y-4">
              {transactions.map((trx) => (
                <Card key={trx.id} className="bg-white border border-gray-100 shadow-sm overflow-hidden hover:border-[#D4A017] transition-colors group">
                  <div className="bg-[#F9FAFB] px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-bold text-[#0F172A]">{trx.id}</span>
                      <span className="text-[#6B7280] hidden sm:inline">•</span>
                      <span className="text-[#6B7280]">{formatDate(trx.createdAt)}</span>
                    </div>
                    <div>{getStatusBadge(trx.status)}</div>
                  </div>

                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex gap-4">
                        <div className="h-20 w-20 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                          <Package className="h-8 w-8 text-[#D4A017]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-[#0F172A] line-clamp-2 leading-tight mb-1 group-hover:text-[#D4A017] transition-colors">
                            {trx.product.name}
                          </h3>
                          <p className="text-sm text-[#6B7280] mb-2">
                            Penjual: <span className="font-semibold text-[#0F172A]">{trx.seller.name}</span>
                          </p>
                          <Badge variant="outline" className="text-xs bg-gray-50 border-transparent">{trx.product.category}</Badge>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-start md:items-end md:text-right border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Total Pembayaran</p>
                          <p className="text-xl font-black text-[#0F172A]">{formatRupiah(trx.totalPrice)}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                          <Button variant="outline" size="sm" className="rounded-xl h-9 border-gray-200">
                            <MessageCircle className="h-4 w-4 mr-2" /> Chat
                          </Button>
                          <Button
                            variant="gold"
                            size="sm"
                            className="rounded-xl h-9"
                            onClick={() => router.push(`/transactions/${trx.id}`)}
                          >
                            Detail <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
