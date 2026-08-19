import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
      {icon && (
        <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 text-[#6B7280]">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-[#0F172A] mb-2">{title}</h3>
      {description && (
        <p className="text-[#6B7280] max-w-md mx-auto mb-6">{description}</p>
      )}
      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button variant="gold" className="rounded-xl shadow-md font-bold">
              {action.label}
            </Button>
          </Link>
        ) : (
          <Button variant="gold" className="rounded-xl shadow-md font-bold" onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  )
}
