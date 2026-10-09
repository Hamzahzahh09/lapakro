"use client"
import { cn } from "@/lib/utils"
import { Check, Clock, AlertTriangle, ShoppingBag, CreditCard, PackageCheck, ThumbsUp } from "lucide-react"
interface EscrowStep {
 key: string
 label: string
 description: string
 icon: React.ReactNode
}

const steps: EscrowStep[] = [
 {
 key:"ordered",
 label:"Pesanan Dibuat",
 description:"Pembeli membuat pesanan",
 icon: <ShoppingBag className="h-5 w-5"/>,
 },
 {
 key:"paid",
  label: "Pembayaran Diterima",
  description: "Dana diamankan oleh LapakRo",
 icon: <CreditCard className="h-5 w-5"/>,
 },
 {
 key:"delivered",
 label:"Seller Kirim",
 description: "Penjual memproses pesanan",
 icon: <PackageCheck className="h-5 w-5"/>,
 },
 {
 key:"confirmed",
 label:"Pembeli Konfirmasi",
 description:"Pembeli konfirmasi penerimaan",
 icon: <ThumbsUp className="h-5 w-5"/>,
 },
 {
 key:"completed",
 label:"Selesai",
 description: "Dana diteruskan ke penjual",
 icon: <Check className="h-5 w-5"/>,
 },
]

interface EscrowTimelineProps {
 currentStatus: string
 isDispute?: boolean
}

export function EscrowTimeline({ currentStatus, isDispute }: EscrowTimelineProps) {
 const statusOrder = steps.map((s) => s.key)
 const currentIndex = statusOrder.indexOf(currentStatus)

 return (
 <div className="space-y-4">
 {isDispute && (
 <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
 <AlertTriangle className="h-5 w-5 shrink-0"/>
 <span>Transaksi ini sedang dalam peninjauan bantuan / komplain</span>
 </div>
 )}
 <div className="relative">
 {steps.map((step, index) => {
 const isCompleted = index <= currentIndex
 const isCurrent = index === currentIndex
 return (
 <div key={step.key} className="flex gap-3 pb-6 last:pb-0">
 <div className="flex flex-col items-center">
 <div
 className={cn("flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
 isCompleted
 ?"border-emerald-500 bg-emerald-500 text-white": isCurrent
 ?"border-[#D4A017] bg-[#FFD700]/10 text-[#D4A017]":"border-slate-300 bg-white text-slate-400")}
 >
 {isCompleted ? (
 <Check className="h-4 w-4"/>
 ) : (
 step.icon
 )}
 </div>
 {index < steps.length - 1 && (
 <div
 className={cn("mt-1 w-0.5 flex-1",
 index < currentIndex
 ?"bg-emerald-500":"bg-slate-200")}
 />
 )}
 </div>
 <div className="pt-1">
 <p
 className={cn("text-sm font-medium",
 isCompleted
 ?"text-emerald-600": isCurrent
 ?"text-[#A67C0A]":"text-slate-500")}
 >
 {step.label}
 </p>
 <p className="text-xs text-slate-400">{step.description}</p>
 </div>
 </div>
 )
 })}
 </div>
 </div>
 )
}
