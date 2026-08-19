"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

export function Pagination({ page, totalPages, onPageChange, siblingCount = 1 }: PaginationProps) {
  if (totalPages <= 1) return null

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const getPageNumbers = (): (number | "ellipsis")[] => {
    const totalNumbers = siblingCount * 2 + 5
    const totalBlocks = totalNumbers + 2

    if (totalPages <= totalBlocks) {
      return range(1, totalPages)
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1)
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages)

    const showLeftEllipsis = leftSiblingIndex > 2
    const showRightEllipsis = rightSiblingIndex < totalPages - 1

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftItemCount = 3 + 2 * siblingCount
      return [...range(1, leftItemCount), "ellipsis", totalPages]
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightItemCount = 3 + 2 * siblingCount
      return [1, "ellipsis", ...range(totalPages - rightItemCount + 1, totalPages)]
    }

    return [
      1,
      "ellipsis",
      ...range(leftSiblingIndex, rightSiblingIndex),
      "ellipsis",
      totalPages,
    ]
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-8" aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-xl border-gray-200"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((pageNum, idx) =>
        pageNum === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-[#6B7280] select-none">...</span>
        ) : (
          <Button
            key={pageNum}
            variant={pageNum === page ? "gold" : "outline"}
            size="icon"
            className={cn(
              "h-10 w-10 rounded-xl font-bold",
              pageNum === page
                ? "shadow-md"
                : "border-gray-200 text-[#0F172A] hover:bg-gray-50"
            )}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-xl border-gray-200"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}
