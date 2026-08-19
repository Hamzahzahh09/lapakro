"use client"
import { useState, useEffect } from "react"
import { Wallet, ArrowDownToLine, Plus, History, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { formatRupiah, cn } from "@/lib/utils"
import { RobuxCoin, GoldGlow } from "@/components/ui/robux-decorations"// Mock data implementation since backend might not be fully wired
const MOCK_TRANSACTIONS = [
 { id:'1', type:'deposit', amount: 500000, status:'completed', date: new Date().toISOString() },
 { id:'2', type:'withdrawal', amount: 150000, status:'pending', date: new Date(Date.now() - 86400000).toISOString() },
 { id:'3', type:'payment', amount: 25000, status:'completed', date: new Date(Date.now() - 172800000).toISOString() },
]

export default function WalletPage() {
 const { user } = useAuth()
 const [balance, setBalance] = useState(0)
 const [loading, setLoading] = useState(true)
 const [amount, setAmount] = useState("")

 useEffect(() => {
 // Simulated fetch
 setTimeout(() => {
 setBalance(1500000)
 setLoading(false)
 }, 1000)
 }, [])

 return (
 <div className="min-h-screen bg-[#F8FAFC] pt-6 pb-24">
 <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none -z-10"/>
 
 <div className="mx-auto max-w-5xl px-4 sm:px-6">
 <div className="mb-8">
 <h1 className="text-3xl font-black text-[#0F172A] mb-2">Dompet LapakRo</h1>
 <p className="text-[#6B7280]">Kelola saldo, deposit, dan penarikan dana Anda.</p>
 </div>

 <div className="grid gap-6 md:grid-cols-3 mb-8">
 {/* Main Balance Card */}
 <Card variant="premium"className="md:col-span-2 relative overflow-hidden group">
 <GoldGlow intensity="sm"className="top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64"/>
 
 <CardContent className="p-8 relative z-10">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
 <div>
 <div className="flex items-center gap-2 text-[#FFD700] mb-2">
 <Wallet className="h-5 w-5"/>
 <span className="font-bold uppercase tracking-wider text-sm">Total Saldo</span>
 </div>
 {loading ? (
 <div className="h-12 w-48 bg-white/20 rounded-xl animate-pulse"/>
 ) : (
 <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline gap-1">
 <span className="text-2xl text-white/80">Rp</span>
 {balance.toLocaleString('id-ID')}
 </h2>
 )}
 </div>

 <div className="flex gap-3 w-full sm:w-auto">
 <Button variant="gold"className="flex-1 sm:flex-none shadow-gold"onClick={() => {}}>
 <Plus className="mr-2 h-4 w-4"/> Deposit
 </Button>
 <Button variant="outline"className="flex-1 sm:flex-none bg-white/10 border-white/20 text-white hover:bg-white/20"onClick={() => {}}>
 <ArrowDownToLine className="mr-2 h-4 w-4"/> Tarik
 </Button>
 </div>
 </div>
 </CardContent>
 
 {/* Background Icon */}
 <Wallet className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10 pointer-events-none transform -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"/>
 </Card>

 {/* Quick Actions / Info */}
 <Card className="flex flex-col justify-center bg-white border-gray-100 shadow-sm">
 <CardHeader className="pb-2">
 <CardTitle className="text-sm text-[#6B7280]">Estimasi Pendapatan Bulan Ini</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="flex items-center gap-3">
 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]/10">
 <TrendingUp className="h-6 w-6 text-[#22C55E]"/>
 </div>
 <div>
 <p className="text-2xl font-black text-[#0F172A]">Rp 2.500.000</p>
 <p className="text-xs font-bold text-[#22C55E]">+15% dari bulan lalu</p>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>

 <div className="grid gap-6 md:grid-cols-3">
 {/* Form Actions */}
 <Card className="md:col-span-1 h-fit bg-white border-gray-100 shadow-sm">
 <CardHeader>
 <CardTitle className="flex items-center gap-2 text-[#0F172A]">
 <ArrowDownToLine className="h-5 w-5 text-[#D4A017]"/>
 Tarik Dana
 </CardTitle>
 <CardDescription>Tarik saldo ke rekening bank Anda.</CardDescription>
 </CardHeader>
 <CardContent>
 <form className="space-y-4">
 <div className="space-y-2">
 <label className="text-sm font-bold text-[#0F172A]">Jumlah Penarikan</label>
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-bold">Rp</span>
 <Input 
 type="number"placeholder="0"className="pl-12 font-bold text-lg bg-gray-50 border-gray-200 focus:bg-white"value={amount}
 onChange={(e) => setAmount(e.target.value)}
 />
 </div>
 </div>

 <div className="rounded-xl bg-[#FFFBEB] p-3 border border-[#FFD700]/30">
 <div className="flex gap-2">
 <AlertCircle className="h-4 w-4 text-[#D4A017] shrink-0 mt-0.5"/>
 <p className="text-xs text-[#D4A017] font-medium leading-relaxed">
 Penarikan dana diproses maksimal 1x24 jam kerja. Minimal penarikan Rp 50.000.
 </p>
 </div>
 </div>

 <Button variant="gold"className="w-full font-bold shadow-md">
 Proses Penarikan
 </Button>
 </form>
 </CardContent>
 </Card>

 {/* Transaction History */}
 <Card className="md:col-span-2 bg-white border-gray-100 shadow-sm">
 <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
 <div className="space-y-1">
 <CardTitle className="flex items-center gap-2 text-[#0F172A]">
 <History className="h-5 w-5 text-[#D4A017]"/>
 Riwayat Transaksi
 </CardTitle>
 <CardDescription>Transaksi terakhir Anda.</CardDescription>
 </div>
 <Button variant="outline"size="sm"className="hidden sm:flex border-gray-200 text-[#0F172A] bg-white hover:bg-gray-50">Lihat Semua</Button>
 </CardHeader>
 <CardContent className="pt-4 p-0 sm:p-6 sm:pt-4">
 <div className="divide-y divide-gray-100">
 {MOCK_TRANSACTIONS.map((trx) => (
 <div key={trx.id} className="flex items-center justify-between py-4 px-4 sm:px-0 hover:bg-gray-50 transition-colors">
 <div className="flex items-center gap-4">
 <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
 trx.type ==='deposit'?"border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]":
 trx.type ==='withdrawal'?"border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]":"border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#3B82F6]")}>
 {trx.type ==='deposit'? <Plus className="h-5 w-5"/> : 
 trx.type ==='withdrawal'? <ArrowDownToLine className="h-5 w-5"/> : 
 <Wallet className="h-5 w-5"/>}
 </div>
 <div>
 <p className="text-sm font-bold text-[#0F172A] capitalize">
 {trx.type ==='deposit'?'Deposit Saldo': 
 trx.type ==='withdrawal'?'Penarikan Dana':'Pembayaran Pesanan'}
 </p>
 <p className="text-xs text-[#6B7280]">
 {new Date(trx.date).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric'})}
 </p>
 </div>
 </div>
 <div className="text-right">
 <p className={cn("text-sm font-black",
 trx.type ==='deposit'?"text-[#22C55E]":"text-[#0F172A]")}>
 {trx.type ==='deposit'?'+':'-'} {formatRupiah(trx.amount)}
 </p>
 <Badge 
 variant={trx.status ==='completed'?'success':'warning'}
 className="mt-1 text-[10px] px-1.5 py-0 shadow-sm">
 {trx.status ==='completed'?'Berhasil':'Diproses'}
 </Badge>
 </div>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 )
}
