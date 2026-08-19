import { cn } from "@/lib/utils"
function Skeleton({
 className,
 ...props
}: React.HTMLAttributes<HTMLDivElement>) {
 return (
 <div
 className={cn("animate-pulse rounded-xl bg-[#F3F4F6] relative overflow-hidden","after:absolute after:inset-0 after:translate-x-[-100%] after:animate-shimmer","after:bg-gradient-to-r after:from-transparent after:via-[rgba(255,255,255,0.4)] after:to-transparent",":via-[rgba(255,255,255,0.05)]",
 className
 )}
 {...props}
 />
 )
}

export { Skeleton }
