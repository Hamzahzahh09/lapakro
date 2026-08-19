"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn, getInitials, getTimeAgo } from "@/lib/utils"
interface ChatListProps {
 chats: {
 id: string
 userName: string
 userAvatar?: string
 lastMessage?: string
 lastMessageAt?: string
 unread: number
 }[]
}

export function ChatList({ chats }: ChatListProps) {
 const pathname = usePathname()

 return (
 <div className="divide-y divide-slate-100">
 {chats.map((chat) => {
 const isActive = pathname === `/chat/${chat.id}`
 return (
 <Link
 key={chat.id}
 href={`/chat/${chat.id}`}
 className={cn("flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 :bg-slate-800",
 isActive &&"bg-violet-50")}
 >
 <Avatar className="h-10 w-10 shrink-0">
 <AvatarFallback>{getInitials(chat.userName)}</AvatarFallback>
 </Avatar>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-medium text-slate-900 truncate">
 {chat.userName}
 </h3>
 {chat.lastMessageAt && (
 <span className="text-xs text-slate-400 shrink-0 ml-2">
 {getTimeAgo(chat.lastMessageAt)}
 </span>
 )}
 </div>
 <p className="text-xs text-slate-500 truncate mt-0.5">
 {chat.lastMessage ||"Belum ada pesan"}
 </p>
 </div>
 {chat.unread > 0 && (
 <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-medium text-white">
 {chat.unread}
 </span>
 )}
 </Link>
 )
 })}
 {chats.length === 0 && (
 <div className="px-4 py-8 text-center text-sm text-slate-500">
 Belum ada percakapan
 </div>
 )}
 </div>
 )
}
