import { useState, useRef, useEffect } from 'react'
import type { Product } from '../types/product'

interface Props {
  product: Product
  onSelect: (p: Product) => void
}

export function ProductCard({ product, onSelect }: Props) {
  const [hovered, setHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const firstVariant = product.variants[0]
  const allMedia = firstVariant?.media ?? []
  const videoItem = allMedia.find(m => m.type === 'video')

  useEffect(() => {
    if (!videoRef.current) return
    if (hovered && videoItem) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current?.pause()
      if (videoRef.current) videoRef.current.currentTime = 0
    }
  }, [hovered, videoItem])

  return (
    <article
      className="product-card"
      onClick={() => onSelect(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#0d0d0d',
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid #1a1a1a',
      }}
    >
      {/* Foto/Vídeo */}
      <div style={{ position: 'relative', paddingBottom: '100%', background: '#111', overflow: 'hidden' }}>
        {/* Imagem principal */}
        <img
          src={product.coverImage}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: hovered && videoItem ? 0 : 1,
            transition: 'opacity 0.4s ease',
          }}
          onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
        />

        {/* Vídeo no hover */}
        {videoItem && (
          <video
            ref={videoRef}
            muted loop playsInline
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          >
            <source src={videoItem.url} type="video/mp4" />
          </video>
        )}

        {/* Badge novo */}
        {product.isNew && (
          <span style={{
            position: 'absolute', top: 8, left: 8,
            background: '#fff', color: '#000',
            fontSize: 8, fontWeight: 700,
            letterSpacing: '0.15em', padding: '2px 7px',
            textTransform: 'uppercase',
          }}>NOVO</span>
        )}

        {/* Contagem de variantes */}
        {product.variants.length > 1 && (
          <span style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'rgba(0,0,0,0.75)', color: '#aaa',
            fontSize: 9, padding: '2px 7px', borderRadius: 10,
          }}>{product.variants.length} modelos</span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{
          color: '#555', fontSize: 9, letterSpacing: '0.18em',
          textTransform: 'uppercase', marginBottom: 3,
        }}>{product.subcategory}</p>

        <h3 style={{
          color: '#e8e8e8', fontSize: 13, fontWeight: 600,
          marginBottom: 8, lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{product.name}</h3>

        {/* Tamanhos — só se existem */}
        {firstVariant?.availableSizes && firstVariant.availableSizes.length > 0 && (
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: 10 }}>
            {firstVariant.availableSizes.slice(0, 5).map(s => (
              <span key={s} style={{
                border: '1px solid #222', color: '#555',
                fontSize: 8, padding: '1px 4px', borderRadius: 2,
              }}>{s}</span>
            ))}
            {firstVariant.availableSizes.length > 5 && (
              <span style={{ color: '#444', fontSize: 8, alignSelf: 'center' }}>
                +{firstVariant.availableSizes.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Preço */}
        {firstVariant?.price != null && (
          <p style={{ color: '#c9a84c', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
            R$ {firstVariant.price.toFixed(2).replace('.', ',')}
          </p>
        )}

        <button
          onClick={e => { e.stopPropagation(); onSelect(product) }}
          style={{
            width: '100%', border: '1px solid #222', background: 'transparent',
            color: '#666', fontSize: 9, letterSpacing: '0.2em',
            textTransform: 'uppercase', padding: '8px 0',
            cursor: 'pointer', borderRadius: 5,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#fff'
            e.currentTarget.style.color = '#000'
            e.currentTarget.style.borderColor = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#666'
            e.currentTarget.style.borderColor = '#222'
          }}
        >
          Ver Detalhes
        </button>
      </div>
    </article>
  )
}
