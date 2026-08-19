"use client"
import { Badge } from "@/components/ui/badge"
import { formatRupiah, formatDate } from "@/lib/utils"
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react"
interface Mutation {
 id: string
 type: "deposit" | "withdrawal" | "refund"
 amount: number
 status: "success" | "pending" | "failed"
 description: string
 createdAt: string
}

interface MutationTableProps {
 mutations: Mutation[]
}

const typeConfig = {
 deposit: { icon: ArrowDownLeft, color:"text-emerald-500", bg:"bg-emerald-50", label:"Deposit"},
 withdrawal: { icon: ArrowUpRight, color:"text-red-500", bg:"bg-red-50", label:"Withdraw"},
 refund: { icon: RefreshCw, color:"text-blue-500", bg:"bg-blue-50", label:"Refund"},
}

const statusMap: Record<string,"success"|"warning"|"destructive"|"secondary"> = {
 success:"success",
 pending:"warning",
 failed:"destructive",
}

export function MutationTable({ mutations }: MutationTableProps) {
 if (mutations.length === 0) {
 return (
 <div className="py-8 text-center text-sm text-slate-500">
 Belum ada riwayat transaksi
 </div>
 )
 }

 return (
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-slate-200">
 <th className="py-3 px-4 text-left font-medium text-slate-500">Tipe</th>
 <th className="py-3 px-4 text-left font-medium text-slate-500">Deskripsi</th>
 <th className="py-3 px-4 text-right font-medium text-slate-500">Jumlah</th>
 <th className="py-3 px-4 text-center font-medium text-slate-500">Status</th>
 <th className="py-3 px-4 text-right font-medium text-slate-500">Tanggal</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {mutations.map((m) => {
 const config = typeConfig[m.type]
 const Icon = config.icon
 return (
 <tr key={m.id} className="hover:bg-slate-50 :bg-slate-800">
 <td className="py-3 px-4">
 <div className="flex items-center gap-2">
 <div className={`flex h-8 w-8 items-center justify-center rounded-full ${config.bg}`}>
 <Icon className={`h-4 w-4 ${config.color}`} />
 </div>
 <span className="text-xs font-medium text-slate-600">
 {config.label}
 </span>
 </div>
 </td>
 <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">
 {m.description}
 </td>
 <td className="py-3 px-4 text-right font-medium">
 <span className={m.type ==="deposit"?"text-emerald-600":"text-red-600"}>
 {m.type ==="deposit"?"+":"-"}
 {formatRupiah(m.amount)}
 </span>
 </td>
 <td className="py-3 px-4 text-center">
 <Badge variant={statusMap[m.status] ||"secondary"} className="text-xs">
 {m.status}
 </Badge>
 </td>
 <td className="py-3 px-4 text-right text-xs text-slate-400">
 {formatDate(m.createdAt)}
 </td>
 </tr>
 )
 })}
 </tbody>
 </table>
 </div>
 )
}
