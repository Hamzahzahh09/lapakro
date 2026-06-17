"use client"

import Link from "next/link"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatRupiah, truncate } from "@/lib/utils"
import type { ProductItem } from "./product-grid"

interface ProductCardProps {
  product: ProductItem
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0] || ""

  return (
    <Link
      href={`/products/${product.id}`}
      className="group rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300 dark:text-slate-600">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        <Badge className="absolute top-2 left-2 text-xs">{product.category}</Badge>
      </div>
      <div className="p-3 space-y-2">
        <h3 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
          {truncate(product.title, 60)}
        </h3>
        <p className="text-lg font-bold text-violet-500">
          {formatRupiah(product.price)}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>{product.soldCount} terjual</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {product.averageRating?.toFixed(1) || "0.0"}
            </span>
            <span className="text-xs text-slate-400">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
