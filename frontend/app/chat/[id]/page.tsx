"use client"

import { useParams } from "next/navigation"
import { ChatWindow } from "@/components/chat/chat-window"
import type { Message } from "@/lib/store"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

const messages: Message[] = [
  { id: "1", chatId: "1", senderId: "seller1", text: "Halo kak, ada yang bisa dibantu?", createdAt: "2024-06-10T09:55:00Z" },
  { id: "2", chatId: "1", senderId: "user1", text: "Halo, saya mau order Robux 1000", createdAt: "2024-06-10T10:00:00Z" },
  { id: "3", chatId: "1", senderId: "seller1", text: "Baik kak, silakan langsung order saja ya", createdAt: "2024-06-10T10:01:00Z" },
  { id: "4", chatId: "1", senderId: "seller1", text: "Nanti akan diproses max 10 menit", createdAt: "2024-06-10T10:01:30Z" },
]

const chatUsers: Record<string, { name: string }> = {
  "1": { name: "RobuxPrime" },
  "2": { name: "GameMaster" },
  "3": { name: "ItemHunter" },
  "4": { name: "BoostPro" },
}

export default function ChatDetailPage() {
  const params = useParams()
  const chatId = params.id as string
  const userInfo = chatUsers[chatId] || { name: "Unknown" }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Link
        href="/chat"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        Kembali
      </Link>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden h-[600px]">
        <ChatWindow
          messages={messages}
          onSendMessage={(text) => console.log("Send:", text)}
          userName={userInfo.name}
          currentUserId="user1"
        />
      </div>
    </div>
  )
}
