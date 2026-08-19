import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2",
 {
 variants: {
 variant: {
 default: "border-transparent bg-[#FFD700] text-[#111827] shadow font-medium",
 secondary: "border-transparent bg-[#F5F5F5] text-[#111827]",
 destructive:"border-transparent bg-[#EF4444] text-white shadow hover:bg-[#DC2626]",
 outline:"border-[#EAEAEA] text-[#111827]",
 gold:"border-transparent bg-gradient-to-r from-[#FFD700] to-[#FFB800] text-[#111827] shadow-[0_0_10px_rgba(255,215,0,0.3)] font-bold",
 premium:"border-[rgba(255,215,0,0.3)] bg-[#111827] text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.15)]",
 success:"border-transparent bg-[#22C55E] text-white shadow-sm",
 warning:"border-transparent bg-[#F59E0B] text-white shadow-sm",
 glass:"border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.1)] backdrop-blur-md text-[#111827]",
 },
 },
 defaultVariants: {
 variant:"default",
 },
 }
)

export interface BadgeProps
 extends React.HTMLAttributes<HTMLDivElement>,
 VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
 return (
 <div className={cn(badgeVariants({ variant }), className)} {...props} />
 )
}

export { Badge, badgeVariants }
