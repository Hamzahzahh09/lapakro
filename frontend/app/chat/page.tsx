"use client"

import { useState, useEffect } from "react"
import { ChatList } from "@/components/chat/chat-list"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface Conversation {
  id: string
  transactionId: string
  otherUserId: string
  lastMessage: string | null
  lastMessageAt: string
  unread: number
  status: string
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ success: boolean; data: Conversation[] }>("/chat/conversations")
      .then((res) => setConversations(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const chats = conversations.map((c) => ({
    id: c.id,
    userName: `User ${c.otherUserId?.slice(0, 8)}...`,
    lastMessage: c.lastMessage || "Belum ada pesan",
    lastMessageAt: c.lastMessageAt,
    unread: c.unread,
  }))

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
        Pesan
      </h1>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {conversations.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Belum ada percakapan
          </div>
        ) : (
          <ChatList chats={chats} />
        )}
      </div>
    </div>
  )
}
