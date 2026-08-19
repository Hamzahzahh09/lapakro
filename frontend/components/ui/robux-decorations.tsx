"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
export function RobuxCoin({ className, ...props }: React.SVGProps<SVGSVGElement>) {
 return (
 <svg
 viewBox="0 0 24 24"fill="none"xmlns="http://www.w3.org/2000/svg"className={cn("w-6 h-6", className)}
 {...props}
 >
 <path
 d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"fill="url(#gold_grad)"/>
 <path
 d="M12 5.5L16.5 10L12 14.5L7.5 10L12 5.5Z"fill="white"fillOpacity="0.9"/>
 <path
 d="M12 18.5L16.5 14L12 9.5L7.5 14L12 18.5Z"fill="white"fillOpacity="0.6"/>
 <defs>
 <linearGradient
 id="gold_grad"x1="3"y1="3"x2="21"y2="21"gradientUnits="userSpaceOnUse">
 <stop stopColor="#FFE44D"/>
 <stop offset="0.5"stopColor="#FFD700"/>
 <stop offset="1"stopColor="#D4A017"/>
 </linearGradient>
 </defs>
 </svg>
 )
}

export function FloatingRobux({
 className,
 size ="md",
 delay = 0,
 duration = 4,
}: {
 className?: string
 size?:"sm"|"md"|"lg"
delay?: number
 duration?: number
}) {
 const sizeMap = {
 sm:"w-8 h-8",
 md:"w-12 h-12",
 lg:"w-16 h-16",
 }

 return (
 <motion.div
 className={cn("absolute opacity-80 pointer-events-none", className)}
 initial={{ y: 0, rotate: 0 }}
 animate={{
 y: [-10, 10, -10],
 rotate: [-5, 5, -5],
 }}
 transition={{
 duration: duration,
 delay: delay,
 repeat: Infinity,
 repeatType:"reverse",
 ease:"easeInOut",
 }}
 >
 <RobuxCoin className={cn("drop-shadow-gold", sizeMap[size])} />
 </motion.div>
 )
}

export function GoldGlow({
 className,
 intensity ="md",
}: {
 className?: string
 intensity?:"sm"|"md"|"lg"}) {
 const opacityMap = {
 sm:"opacity-20",
 md:"opacity-40",
 lg:"opacity-60",
 }

 return (
 <motion.div
 className={cn("absolute rounded-full blur-[60px] pointer-events-none bg-[#FFD700]",
 opacityMap[intensity],
 className
 )}
 animate={{
 scale: [1, 1.1, 1],
 opacity: intensity ==="sm"? [0.15, 0.25, 0.15] : [0.3, 0.5, 0.3],
 }}
 transition={{
 duration: 4,
 repeat: Infinity,
 ease:"easeInOut",
 }}
 />
 )
}

export function TrustBadge({
 icon: Icon,
 title,
 description,
 className,
}: {
 icon: React.ElementType
 title: string
 description: string
 className?: string
}) {
 return (
 <motion.div
 whileHover={{ y: -4, scale: 1.02 }}
 className={cn("flex items-center gap-4 rounded-2xl glass p-4 shadow-card hover:shadow-gold-lg border border-transparent hover:border-[#FFD700]/30 transition-colors cursor-default",
 className
 )}
 >
 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFB800] text-[#0F172A] shadow-md">
 <Icon className="h-6 w-6"/>
 </div>
 <div>
 <h4 className="text-sm font-bold text-[#0F172A]">{title}</h4>
 <p className="text-xs text-[#475569] mt-0.5">{description}</p>
 </div>
 </motion.div>
 )
}
