"use client"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatRupiah, formatDate } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
interface Dispute {
 id: string
 transactionId: string
 buyerId: string
 sellerId: string
 reason: string
 description: string
 status: string
 resolution: string | null
 adminNote: string
 createdAt: string
}

const statusVariant: Record<string,"destructive"|"warning"|"success"|"default"> = {
 open:"destructive",
 under_review:"warning",
 escalated:"destructive",
 resolved:"success",
}

const statusLabel: Record<string, string> = {
 open:"Terbuka",
 under_review:"Investigasi",
 escalated:"Ditingkatkan",
 resolved:"Selesai",
}

export default function AdminDisputesPage() {
 const [disputes, setDisputes] = useState<Dispute[]>([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 api.get<{ success: boolean; data: Dispute[] }>("/admin/disputes")
 .then((res) => setDisputes(res.data || []))
 .catch(() => {})
 .finally(() => setLoading(false))
 }, [])

 const activeCount = disputes.filter((d) => d.status !=="resolved").length

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[60vh]">
 <Loader2 className="h-8 w-8 animate-spin text-violet-500"/>
 </div>
 )
 }

 return (
 <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
 <div className="mb-6">
 <h1 className="text-2xl font-bold text-slate-900">
 Manajemen Dispute
 </h1>
 <p className="text-sm text-slate-500 mt-1">
 {activeCount} dispute aktif
 </p>
 </div>

 <div className="space-y-3">
 {disputes.map((dispute) => (
 <Card key={dispute.id}>
 <CardContent className="p-4">
 <div className="flex items-start justify-between">
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <h3 className="text-sm font-medium text-slate-900">
 Dispute {dispute.id?.slice(0, 8)}...
 </h3>
 <Badge variant={statusVariant[dispute.status] ||"default"} className="text-xs">
 {statusLabel[dispute.status] || dispute.status}
 </Badge>
 </div>
 <p className="text-xs text-slate-500 mb-2">
 ID: {dispute.id?.slice(0, 8)}... | Transaksi: {dispute.transactionId?.slice(0, 8)}...
 </p>
 <div className="space-y-0.5 text-xs text-slate-600">
 <p>Pembeli ID: {dispute.buyerId?.slice(0, 8)}...</p>
 <p>Penjual ID: {dispute.sellerId?.slice(0, 8)}...</p>
 <p>Alasan: {dispute.reason}</p>
 <p>Dibuka: {formatDate(dispute.createdAt)}</p>
 </div>
 </div>
 {dispute.status !=="resolved"&& (
 <Button variant="outline"size="sm"className="gap-2 shrink-0 ml-4">
 Tangani
 </Button>
 )}
 </div>
 </CardContent>
 </Card>
 ))}
 {disputes.length === 0 && (
 <div className="py-12 text-center text-sm text-slate-500">
 Tidak ada dispute
 </div>
 )}
 </div>
 </div>
 )
}
