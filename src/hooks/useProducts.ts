import { useState, useEffect, useMemo } from 'react'
import type { Product, NavGroup } from '../types/product'

interface UseProductsReturn {
  products: Product[]
  navGroups: NavGroup[]
  loading: boolean
  error: string | null
  updatePrice: (productId: string, variantId: string, price: number | null) => void
}

const PRICES_KEY = 'sportelite_prices'

function loadSavedPrices(): Record<string, number | null> {
  try {
    return JSON.parse(localStorage.getItem(PRICES_KEY) || '{}')
  } catch {
    return {}
  }
}

function applyPrices(products: Product[], prices: Record<string, number | null>): Product[] {
  return products.map(p => ({
    ...p,
    variants: p.variants.map(v => ({
      ...v,
      price: prices[`${p.id}__${v.id}`] ?? v.price,
    })),
  }))
}

export function useProducts(): UseProductsReturn {
  const [raw, setRaw] = useState<Product[]>([])
  const [navGroups, setNavGroups] = useState<NavGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [prices, setPrices] = useState<Record<string, number | null>>(loadSavedPrices)

  useEffect(() => {
    fetch('/db.json')
      .then(r => {
        if (!r.ok) throw new Error('Erro ao carregar db.json')
        return r.json()
      })
      .then(data => {
        setRaw(data.products || [])
        setNavGroups(data.navGroups || [])
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  const products = useMemo(() => applyPrices(raw, prices), [raw, prices])

  function updatePrice(productId: string, variantId: string, price: number | null) {
    const key = `${productId}__${variantId}`
    const next = { ...prices, [key]: price }
    setPrices(next)
    localStorage.setItem(PRICES_KEY, JSON.stringify(next))
  }

  return { products, navGroups, loading, error, updatePrice }
}
