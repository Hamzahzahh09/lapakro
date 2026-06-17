"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionCard } from "@/components/transaction/transaction-card"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface Transaction {
  id: string
  productId: string
  totalPrice: number
  status: string
  notes: string
  createdAt: string
  quantity: number
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("all")

  useEffect(() => {
    api.get<{ success: boolean; data: Transaction[] }>("/transactions")
      .then((res) => setTransactions(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusMap: Record<string, string> = {
    pending: "pending",
    awaiting_seller: "paid",
    awaiting_buyer: "delivered",
    completed: "completed",
    cancelled: "cancelled",
    disputed: "dispute",
    refunded: "cancelled",
  }

  const filtered = tab === "all"
    ? transactions
    : transactions.filter((t) => {
        const mapped = statusMap[t.status] || t.status
        if (tab === "pending") return ["pending", "awaiting_seller", "awaiting_buyer"].includes(t.status)
        if (tab === "completed") return t.status === "completed"
        if (tab === "cancelled") return ["cancelled", "refunded"].includes(t.status)
        return true
      })

  const tabs = [
    { value: "all", label: "Semua" },
    { value: "pending", label: "Menunggu" },
    { value: "completed", label: "Selesai" },
    { value: "cancelled", label: "Dibatalkan" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Riwayat Transaksi
      </h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full sm:w-auto">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="flex-1 sm:flex-none">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.value} value={t.value} className="mt-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">
                Tidak ada transaksi
              </div>
            ) : (
              filtered.map((trx) => (
                <TransactionCard
                  key={trx.id}
                  id={trx.id}
                  productTitle={`Transaksi ${trx.id?.slice(0, 8)}...`}
                  amount={trx.totalPrice}
                  status={(statusMap[trx.status] || trx.status) as any}
                  createdAt={trx.createdAt}
                  isBuyer={true}
                />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
