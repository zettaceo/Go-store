import { useState, useEffect } from 'react'
import type { Product } from '../types/product'
import { ProductGallery } from './ProductGallery'

interface Props {
  product: Product
  onClose: () => void
  onSavePrice: (productId: string, variantId: string, price: number | null) => void
}

export function ProductModal({ product, onClose, onSavePrice }: Props) {
  const [variantIdx, setVariantIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [adminOpen, setAdminOpen] = useState(false)
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>(
    Object.fromEntries(product.variants.map(v => [v.id, v.price != null ? String(v.price) : '']))
  )

  const variant = product.variants[variantIdx]

  // Fecha com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Bloqueia scroll do body
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleSave(variantId: string) {
    const val = priceInputs[variantId]
    const num = parseFloat(val.replace(',', '.'))
    onSavePrice(product.id, variantId, isNaN(num) ? null : num)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0d0d0d', borderRadius: 16,
          maxWidth: 880, width: '100%', maxHeight: '92vh',
          overflowY: 'auto', border: '1px solid #1e1e1e',
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 640 ? '1fr' : '1fr 1fr',
        }}
      >
        {/* Galeria */}
        <div style={{ padding: 24 }}>
          <ProductGallery media={variant.media} productName={product.name} />
        </div>

        {/* Detalhes */}
        <div style={{ padding: '24px 24px 24px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#555', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                {product.subcategory}
              </p>
              <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>
                {product.name}
              </h2>
            </div>
            <button onClick={onClose} style={{
              background: '#1a1a1a', border: 'none', color: '#777',
              width: 34, height: 34, borderRadius: 8, cursor: 'pointer',
              fontSize: 18, lineHeight: 1, flexShrink: 0,
            }}>×</button>
          </div>

          {/* Variantes */}
          {product.variants.length > 1 && (
            <div>
              <p style={{ color: '#555', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                Modelo
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.variants.map((v, i) => (
                  <button key={v.id}
                    onClick={() => { setVariantIdx(i); setSelectedSize(null) }}
                    style={{
                      padding: '7px 14px', borderRadius: 6, cursor: 'pointer',
                      border: `1px solid ${i === variantIdx ? '#fff' : '#2a2a2a'}`,
                      background: i === variantIdx ? '#fff' : 'transparent',
                      color: i === variantIdx ? '#000' : '#777',
                      fontSize: 11, letterSpacing: '0.05em', fontFamily: 'inherit',
                    }}
                  >{v.label}</button>
                ))}
              </div>
            </div>
          )}

          {/* Tamanhos */}
          {variant.availableSizes.length > 0 && (
            <div>
              <p style={{ color: '#555', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                Tamanho {selectedSize && <span style={{ color: '#c9a84c' }}>— {selectedSize}</span>}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {variant.availableSizes.map(s => (
                  <button key={s}
                    onClick={() => setSelectedSize(s === selectedSize ? null : s)}
                    style={{
                      width: 46, height: 46, borderRadius: 8, cursor: 'pointer',
                      border: `1px solid ${selectedSize === s ? '#c9a84c' : '#2a2a2a'}`,
                      background: selectedSize === s ? 'rgba(201,168,76,0.1)' : 'transparent',
                      color: selectedSize === s ? '#c9a84c' : '#777',
                      fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                    }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Preço / CTA */}
          <div style={{ marginTop: 'auto' }}>
            {variant.price != null ? (
              <p style={{ color: '#c9a84c', fontSize: 26, fontWeight: 700, margin: '0 0 14px' }}>
                R$ {variant.price.toFixed(2).replace('.', ',')}
              </p>
            ) : (
              <p style={{ color: '#555', fontSize: 12, letterSpacing: '0.08em', margin: '0 0 14px' }}>
                Consulte disponibilidade e valores pelo WhatsApp
              </p>
            )}

            <a
              href={`https://wa.me/55?text=Olá! Tenho interesse no produto: ${encodeURIComponent(product.name + (product.variants.length > 1 ? ' — ' + variant.label : '') + (selectedSize ? ' — Tamanho ' + selectedSize : ''))}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block', width: '100%', background: '#25d366',
                border: 'none', color: '#fff', fontSize: 12,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                fontWeight: 700, padding: '14px 0', borderRadius: 8,
                cursor: 'pointer', textAlign: 'center', textDecoration: 'none',
                boxSizing: 'border-box',
              }}
            >
              📲 Consultar Disponibilidade
            </a>
          </div>

          {/* ===== PAINEL ADMIN ===== */}
          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 14 }}>
            <button
              onClick={() => setAdminOpen(o => !o)}
              style={{
                background: 'transparent', border: '1px solid #222',
                color: '#444', fontSize: 10, letterSpacing: '0.15em',
                textTransform: 'uppercase', padding: '6px 12px',
                borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {adminOpen ? '▲ Fechar Admin' : '⚙ Gerenciar Preços'}
            </button>

            {adminOpen && (
              <div style={{
                marginTop: 12, background: '#111', borderRadius: 8,
                padding: 16, border: '1px solid #1e1e1e',
              }}>
                <p style={{ color: '#c9a84c', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                  ⚙ Painel Admin — Preços
                </p>
                {product.variants.map(v => (
                  <div key={v.id} style={{ marginBottom: 10 }}>
                    <label style={{ color: '#555', fontSize: 11, display: 'block', marginBottom: 4 }}>
                      {v.label}
                      {v.price != null && <span style={{ color: '#c9a84c', marginLeft: 8 }}>
                        R$ {v.price.toFixed(2).replace('.', ',')}
                      </span>}
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Ex: 89.90"
                        value={priceInputs[v.id]}
                        onChange={e => setPriceInputs(p => ({ ...p, [v.id]: e.target.value }))}
                        style={{
                          flex: 1, background: '#0a0a0a', border: '1px solid #222',
                          color: '#fff', padding: '8px 12px', borderRadius: 6,
                          fontSize: 13, fontFamily: 'inherit', outline: 'none',
                        }}
                      />
                      <button
                        onClick={() => handleSave(v.id)}
                        style={{
                          background: '#c9a84c', border: 'none', color: '#000',
                          padding: '8px 14px', borderRadius: 6, cursor: 'pointer',
                          fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
                        }}
                      >Salvar</button>
                      {v.price != null && (
                        <button
                          onClick={() => { onSavePrice(product.id, v.id, null); setPriceInputs(p => ({ ...p, [v.id]: '' })) }}
                          style={{
                            background: 'transparent', border: '1px solid #333', color: '#666',
                            padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                            fontSize: 11, fontFamily: 'inherit',
                          }}
                        >✕</button>
                      )}
                    </div>
                  </div>
                ))}
                <p style={{ color: '#333', fontSize: 10, marginTop: 10 }}>
                  💾 Salvo no navegador. Para persistir, conecte ao Supabase.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
