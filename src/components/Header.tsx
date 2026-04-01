import { useState } from 'react'
import type { NavGroup } from '../types/product'

interface Props {
  navGroups: NavGroup[]
  activeCategory: string | null
  onCategorySelect: (slug: string | null) => void
  search: string
  onSearch: (v: string) => void
  totalProducts: number
}

export function Header({ navGroups, activeCategory, onCategorySelect, search, onSearch, totalProducts }: Props) {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCatLabel = navGroups
    .flatMap(g => g.categories)
    .find(c => c.slug === activeCategory)?.label

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #161616',
    }}>
      {/* Top bar */}
      <div style={{
        maxWidth: 1400, margin: '0 auto', padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        {/* Logo */}
        <button
          onClick={() => onCategorySelect(null)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
        >
          <div>
            <div style={{
              fontSize: 18, fontWeight: 900, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#fff', lineHeight: 1,
            }}>
              SPORT<span style={{ color: '#c9a84c' }}>ELITE</span>
            </div>
            <div style={{ fontSize: 8, letterSpacing: '0.3em', color: '#444', textTransform: 'uppercase', marginTop: 2 }}>
              Catálogo Premium · {totalProducts} produtos
            </div>
          </div>
        </button>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: '#444', fontSize: 13, pointerEvents: 'none',
          }}>🔍</span>
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Buscar — Flamengo, Lakers, Mercurial..."
            style={{
              width: '100%', background: '#111', border: '1px solid #1e1e1e',
              color: '#fff', padding: '9px 16px 9px 36px', borderRadius: 8,
              fontSize: 12, outline: 'none', fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14,
              }}
            >×</button>
          )}
        </div>

        {/* Reset filter */}
        {activeCategory && (
          <button
            onClick={() => onCategorySelect(null)}
            style={{
              background: 'transparent', border: '1px solid #2a2a2a', color: '#888',
              padding: '7px 14px', borderRadius: 6, cursor: 'pointer',
              fontSize: 11, letterSpacing: '0.1em', fontFamily: 'inherit', flexShrink: 0,
            }}
          >← {activeCatLabel}</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{
        maxWidth: 1400, margin: '0 auto', padding: '0 24px 12px',
        display: 'flex', gap: 0, overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {navGroups.map(group => (
          <div
            key={group.slug}
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredGroup(group.slug)}
            onMouseLeave={() => setHoveredGroup(null)}
          >
            <button style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: hoveredGroup === group.slug ? '#fff' : '#555',
              fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '6px 16px', whiteSpace: 'nowrap', fontFamily: 'inherit',
              borderBottom: group.categories.some(c => c.slug === activeCategory)
                ? '1px solid #c9a84c' : '1px solid transparent',
              transition: 'color 0.2s',
            }}>
              {group.label}
            </button>

            {/* Dropdown */}
            {hoveredGroup === group.slug && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 200,
                background: '#0d0d0d', border: '1px solid #1e1e1e',
                borderRadius: '0 0 10px 10px', minWidth: 200, padding: '6px 0',
                boxShadow: '0 24px 48px rgba(0,0,0,0.8)',
              }}>
                {group.categories.map(cat => (
                  <button key={cat.slug}
                    onClick={() => { onCategorySelect(cat.slug === activeCategory ? null : cat.slug); setHoveredGroup(null) }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      width: '100%', textAlign: 'left', padding: '9px 20px',
                      background: cat.slug === activeCategory ? '#1a1a1a' : 'transparent',
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      color: cat.slug === activeCategory ? '#fff' : '#777',
                      fontSize: 12, letterSpacing: '0.04em',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#161616'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = cat.slug === activeCategory ? '#1a1a1a' : 'transparent'
                      e.currentTarget.style.color = cat.slug === activeCategory ? '#fff' : '#777'
                    }}
                  >
                    <span>{cat.label}</span>
                    {cat.count > 0 && (
                      <span style={{ color: '#333', fontSize: 10, marginLeft: 12 }}>{cat.count}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  )
}
