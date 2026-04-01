import { useState, useRef, useEffect } from 'react'
import type { MediaItem } from '../types/product'

interface Props {
  media: MediaItem[]
  productName: string
}

export function ProductGallery({ media, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const active = media[activeIndex]

  useEffect(() => { setActiveIndex(0) }, [media])

  useEffect(() => {
    if (active?.type === 'video' && videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {})
    }
  }, [activeIndex, active])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Mídia principal */}
      <div style={{
        position: 'relative', width: '100%', paddingBottom: '100%',
        background: '#0a0a0a', borderRadius: 12, overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {active?.type === 'video' ? (
            <video
              ref={videoRef}
              controls
              playsInline
              muted
              loop
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            >
              <source src={active.url} type="video/mp4" />
            </video>
          ) : (
            <img
              src={active?.url}
              alt={active?.alt || productName}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
            />
          )}
          {active?.type === 'video' && (
            <div style={{
              position: 'absolute', bottom: 10, right: 10,
              background: 'rgba(0,0,0,0.65)', borderRadius: 4,
              padding: '2px 8px', fontSize: 10, color: '#fff', letterSpacing: '0.1em',
              pointerEvents: 'none',
            }}>▶ VÍDEO</div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {media.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              style={{
                flexShrink: 0, width: 60, height: 60, padding: 0,
                borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
                border: `2px solid ${i === activeIndex ? '#c9a84c' : 'transparent'}`,
                background: '#111', position: 'relative',
              }}
            >
              <img
                src={item.thumbnailUrl || item.url}
                alt={item.alt}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
              />
              {item.type === 'video' && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.5)', fontSize: 16, color: '#fff',
                }}>▶</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
