"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EscrowTimeline } from "@/components/transaction/escrow-timeline"
import { formatRupiah, formatDate } from "@/lib/utils"
import { MessageCircle, AlertTriangle, Clock, Package } from "lucide-react"

const transaction = {
  id: "TRX001",
  productTitle: "Robux 1000 + Bonus 50",
  amount: 25000,
  status: "paid",
  createdAt: "2024-06-10T10:00:00Z",
  buyerName: "Budi Santoso",
  sellerName: "RobuxPrime",
  escrowStatus: "paid",
  isDispute: false,
  autoReleaseAt: "2024-06-13T10:00:00Z",
}

export default function TransactionDetailPage() {
  const params = useParams()

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Detail Transaksi
        </h1>
        <p className="text-sm text-slate-500 mt-1">ID: {transaction.id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Escrow</CardTitle>
            </CardHeader>
            <CardContent>
              <EscrowTimeline
                currentStatus={transaction.escrowStatus}
                isDispute={transaction.isDispute}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pesan dengan Seller</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Ketik pesan..."
                    className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <Button size="sm">Kirim</Button>
              </div>
              <div className="text-center text-sm text-slate-500 py-4">
                Belum ada pesan
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                  <Package className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {transaction.productTitle}
                  </p>
                  <Badge variant="warning" className="text-xs mt-1">
                    Menunggu Pembayaran
                  </Badge>
                </div>
              </div>
              <hr className="border-slate-100 dark:border-slate-700" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total</span>
                  <span className="font-semibold">{formatRupiah(transaction.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Penjual</span>
                  <span>{transaction.sellerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal</span>
                  <span className="text-xs">{formatDate(transaction.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                <Clock className="h-4 w-4 shrink-0" />
                <span>
                  Dana otomatis dirilis ke seller pada {formatDate(transaction.autoReleaseAt)} jika tidak dikonfirmasi
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button className="w-full" size="lg">
              Konfirmasi Penerimaan
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <MessageCircle className="h-4 w-4" />
              Hubungi Seller
            </Button>
            <Button variant="destructive" className="w-full gap-2">
              <AlertTriangle className="h-4 w-4" />
              Buka Dispute
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
