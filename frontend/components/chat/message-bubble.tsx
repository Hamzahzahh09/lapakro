"use client"
import { cn, formatDate } from "@/lib/utils"
interface MessageBubbleProps {
 text: string
 createdAt: string
 isOwn: boolean
}

export function MessageBubble({ text, createdAt, isOwn }: MessageBubbleProps) {
 return (
 <div className={cn("flex", isOwn ?"justify-end":"justify-start")}>
 <div
 className={cn("max-w-[75%] rounded-2xl px-4 py-2.5",
 isOwn
 ?"bg-violet-500 text-white rounded-br-md":"bg-slate-100 text-slate-900 rounded-bl-md")}
 >
 <p className="text-sm">{text}</p>
 <p
 className={cn("mt-1 text-[10px]",
 isOwn ?"text-violet-100":"text-slate-400")}
 >
 {formatDate(createdAt)}
 </p>
 </div>
 </div>
 )
}
