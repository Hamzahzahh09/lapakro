"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatRupiah, formatDate } from "@/lib/utils"
import { Package } from "lucide-react"

interface TransactionCardProps {
  id: string
  productTitle: string
  productImage?: string
  amount: number
  status: "pending" | "paid" | "delivered" | "confirmed" | "completed" | "cancelled" | "dispute"
  createdAt: string
  isBuyer: boolean
}

const statusMap: Record<string, { label: string; variant: "warning" | "success" | "default" | "destructive" | "secondary" }> = {
  pending: { label: "Menunggu", variant: "warning" },
  paid: { label: "Dibayar", variant: "default" },
  delivered: { label: "Dikirim", variant: "default" },
  confirmed: { label: "Dikonfirmasi", variant: "default" },
  completed: { label: "Selesai", variant: "success" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
  dispute: { label: "Dispute", variant: "destructive" },
}

export function TransactionCard({
  id,
  productTitle,
  productImage,
  amount,
  status,
  createdAt,
  isBuyer,
}: TransactionCardProps) {
  const statusInfo = statusMap[status] || { label: status, variant: "secondary" as const }

  return (
    <Link
      href={`/transactions/${id}`}
      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
        {productImage ? (
          <img src={productImage} alt={productTitle} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center"><Package className="h-6 w-6 text-slate-300 dark:text-slate-500" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-slate-900 truncate dark:text-white">
          {productTitle}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">{formatDate(createdAt)}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {formatRupiah(amount)}
          </span>
          <Badge variant={statusInfo.variant} className="text-xs">
            {statusInfo.label}
          </Badge>
        </div>
      </div>
      <div className="hidden sm:block text-xs text-slate-400">
        {isBuyer ? "Pembelian" : "Penjualan"}
      </div>
    </Link>
  )
}
