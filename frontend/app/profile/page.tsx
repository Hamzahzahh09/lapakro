"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { TransactionCard } from "@/components/transaction/transaction-card"
import { getInitials, formatDateShort } from "@/lib/utils"
import { api } from "@/lib/api"
import { Loader2, Star, Settings, ShoppingBag, Calendar } from "lucide-react"

import { useAuthStore } from "@/lib/store"

interface Transaction {
  id: string
  productId: string
  totalPrice: number
  status: string
  createdAt: string
}

const statusMap: Record<string, string> = {
  pending: "pending",
  awaiting_seller: "paid",
  awaiting_buyer: "delivered",
  completed: "completed",
  cancelled: "cancelled",
  disputed: "dispute",
  refunded: "cancelled",
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      api.get<{ success: boolean; data: Transaction[] }>("/transactions")
        .then((res) => setTransactions((res.data || []).slice(0, 3)))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [isAuthenticated])

  if (!isAuthenticated || !user) {
    return <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 text-center text-slate-500">Anda harus masuk untuk melihat profil.</div>
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                {user.isVerified && (
                  <Badge variant="success" className="text-xs">Terverifikasi</Badge>
                )}
              </div>
              <p className="text-sm text-slate-500">{user.email}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Bergabung {user.createdAt ? formatDateShort(user.createdAt) : "-"}
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Role: {user.role}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Edit Profil
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
            Informasi Akun
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Nama</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Role</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Status</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {user.isVerified ? "Terverifikasi" : "Belum Verifikasi"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
          Transaksi Terbaru
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">Belum ada transaksi</p>
            )}
            {transactions.map((trx) => (
              <TransactionCard
                key={trx.id}
                id={trx.id}
                productTitle={`Transaksi ${trx.id?.slice(0, 8)}...`}
                amount={trx.totalPrice}
                status={(statusMap[trx.status] || trx.status) as any}
                createdAt={trx.createdAt}
                isBuyer={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
