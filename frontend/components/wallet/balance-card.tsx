"use client"

import { Wallet, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatRupiah } from "@/lib/utils"
import { useState } from "react"

interface BalanceCardProps {
  balance: number
  onDeposit: () => void
  onWithdraw: () => void
}

export function BalanceCard({ balance, onDeposit, onWithdraw }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 p-6 text-white">
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
      <div className="absolute bottom-0 right-0 h-24 w-24 translate-x-4 translate-y-4 rounded-full bg-white/10" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <span className="text-sm font-medium text-violet-100">
              Saldo Dompet
            </span>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-violet-200 hover:text-white transition-colors"
          >
            {showBalance ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight">
          {showBalance ? formatRupiah(balance) : "Rp •••••••"}
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            onClick={onDeposit}
            variant="secondary"
            size="sm"
            className="bg-white/20 text-white hover:bg-white/30 border-0"
          >
            Deposit
          </Button>
          <Button
            onClick={onWithdraw}
            variant="secondary"
            size="sm"
            className="bg-white/20 text-white hover:bg-white/30 border-0"
          >
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  )
}
