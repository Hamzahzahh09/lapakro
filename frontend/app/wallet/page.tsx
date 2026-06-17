"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BalanceCard } from "@/components/wallet/balance-card"
import { MutationTable } from "@/components/wallet/mutation-table"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface HistoryItem {
  id: string
  type: "deposit" | "withdrawal" | "refund" | "payment"
  amount: number
  status: string
  description: string
  createdAt: string
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("all")
  const [depositOpen, setDepositOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [processing, setProcessing] = useState(false)

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      api.get<{ success: boolean; data: { balance: number } }>("/wallet/balance"),
      api.get<{ success: boolean; data: HistoryItem[] }>("/wallet/history"),
    ])
      .then(([balanceRes, historyRes]) => {
        setBalance(balanceRes.data?.balance ?? 0)
        setHistory(historyRes.data || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeposit = async () => {
    const amount = Number(depositAmount)
    if (amount < 5000) return
    setProcessing(true)
    try {
      await api.post("/wallet/deposit", { amount, paymentMethod: "manual" })
      setDepositOpen(false)
      setDepositAmount("")
      fetchData()
    } catch {}
    setProcessing(false)
  }

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount)
    if (amount < 20000) return
    setProcessing(true)
    try {
      await api.post("/wallet/withdraw", {
        amount,
        bankName: "Bank Transfer",
        bankAccount: "",
        accountHolder: "",
      })
      setWithdrawOpen(false)
      setWithdrawAmount("")
      fetchData()
    } catch {}
    setProcessing(false)
  }

  const mutations: HistoryItem[] = tab === "all"
    ? history
    : history.filter((m) => {
        if (tab === "deposit") return m.type === "deposit"
        if (tab === "withdrawal") return m.type === "withdrawal"
        if (tab === "refund") return m.type === "refund" || m.type === "payment"
        return true
      })

  const tabs = [
    { value: "all", label: "Semua" },
    { value: "deposit", label: "Deposit" },
    { value: "withdrawal", label: "Withdraw" },
    { value: "refund", label: "Lainnya" },
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
        Dompet
      </h1>

      <BalanceCard
        balance={balance}
        onDeposit={() => setDepositOpen(true)}
        onWithdraw={() => setWithdrawOpen(true)}
      />

      <div className="mt-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full sm:w-auto">
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="flex-1 sm:flex-none">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t.value} value={t.value} className="mt-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <MutationTable mutations={mutations as any} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Modal open={depositOpen} onOpenChange={setDepositOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Deposit Saldo</ModalTitle>
            <ModalDescription>
              Masukkan jumlah yang ingin didepositkan (min Rp 5.000)
            </ModalDescription>
          </ModalHeader>
          <div className="space-y-4">
            <Input
              label="Jumlah Deposit"
              type="number"
              placeholder="Masukkan nominal"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <div className="grid grid-cols-3 gap-2">
              {[50000, 100000, 250000].map((nom) => (
                <Button
                  key={nom}
                  variant="outline"
                  size="sm"
                  onClick={() => setDepositAmount(String(nom))}
                >
                  Rp {nom.toLocaleString()}
                </Button>
              ))}
            </div>
            <Button
              className="w-full"
              disabled={!depositAmount || Number(depositAmount) < 5000 || processing}
              onClick={handleDeposit}
            >
              {processing ? "Memproses..." : "Deposit Sekarang"}
            </Button>
          </div>
        </ModalContent>
      </Modal>

      <Modal open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Tarik Saldo</ModalTitle>
            <ModalDescription>
              Tarik saldo ke rekening atau e-wallet Anda (min Rp 20.000)
            </ModalDescription>
          </ModalHeader>
          <div className="space-y-4">
            <Input
              label="Jumlah Penarikan"
              type="number"
              placeholder="Masukkan nominal"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <Input
              label="Tujuan (Rekening/E-Wallet)"
              type="text"
              placeholder="Contoh: BCA 123456789 a/n Budi"
            />
            <Button
              className="w-full"
              disabled={!withdrawAmount || Number(withdrawAmount) < 20000 || processing}
              onClick={handleWithdraw}
            >
              {processing ? "Memproses..." : "Tarik Saldo"}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  )
}
