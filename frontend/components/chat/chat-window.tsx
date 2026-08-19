"use client"
import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageBubble } from "@/components/chat/message-bubble"
import { getInitials } from "@/lib/utils"
import type { Message } from "@/lib/store"
interface ChatWindowProps {
 messages: Message[]
 onSendMessage: (text: string) => void
 userName: string
 userAvatar?: string
 currentUserId: string
}

export function ChatWindow({
 messages,
 onSendMessage,
 userName,
 userAvatar,
 currentUserId,
}: ChatWindowProps) {
 const [input, setInput] = useState("")
 const messagesEndRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
 messagesEndRef.current?.scrollIntoView({ behavior:"smooth"})
 }, [messages])

 const handleSend = () => {
 if (input.trim()) {
 onSendMessage(input.trim())
 setInput("")
 }
 }

 return (
 <div className="flex flex-col h-full">
 <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
 <Avatar className="h-8 w-8">
 <AvatarFallback>{getInitials(userName)}</AvatarFallback>
 </Avatar>
 <h3 className="text-sm font-medium text-slate-900">
 {userName}
 </h3>
 </div>
 <div className="flex-1 overflow-y-auto p-4 space-y-3">
 {messages.map((msg) => (
 <MessageBubble
 key={msg.id}
 text={msg.text}
 createdAt={msg.createdAt}
 isOwn={msg.senderId === currentUserId}
 />
 ))}
 <div ref={messagesEndRef} />
 </div>
 <div className="border-t border-slate-200 p-4">
 <div className="flex items-center gap-2">
 <input
 type="text"value={input}
 onChange={(e) => setInput(e.target.value)}
 onKeyDown={(e) => e.key ==="Enter"&& handleSend()}
 placeholder="Ketik pesan..."className="flex-1 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"/>
 <button
 onClick={handleSend}
 disabled={!input.trim()}
 className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed">
 <Send className="h-4 w-4"/>
 </button>
 </div>
 </div>
 </div>
 )
}
