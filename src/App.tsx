import { useState, useMemo } from 'react'
import { useProducts } from './hooks/useProducts'
import { ProductCard } from './components/ProductCard'
import { ProductModal } from './components/ProductModal'
import type { Product, NavGroup } from './types/product'
import './index.css'

/* ─── Sidebar ────────────────────────────────────────────── */
function Sidebar({ navGroups, activeCategory, onSelect, open, onClose }: {
  navGroups: NavGroup[]
  activeCategory: string | null
  onSelect: (s: string | null) => void
  open: boolean
  onClose: () => void
}) {
  const [expanded, setExpanded] = useState<string | null>(() => {
    // Abre o grupo da categoria ativa por padrão
    for (const g of navGroups)
      if (g.categories.some(c => c.slug === activeCategory)) return g.slug
    return null
  })

  return (
    <>
      {open && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          zIndex: 199, backdropFilter: 'blur(4px)',
        }} />
      )}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 256,
        background: '#080808', borderRight: '1px solid #1a1a1a',
        zIndex: 200, overflowY: 'auto',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Topo */}
        <div style={{
          padding: '20px 18px 16px',
          borderBottom: '1px solid #141414',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button onClick={() => { onSelect(null); onClose() }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.2em', color: '#fff' }}>
              SPORT<span style={{ color: '#c9a84c' }}>ELITE</span>
            </span>
          </button>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid #222',
            color: '#666', width: 30, height: 30, borderRadius: 6,
            cursor: 'pointer', fontSize: 16, lineHeight: 1,
          }}>×</button>
        </div>

        {/* Ver tudo */}
        <div style={{ padding: '10px 12px 6px' }}>
          <button onClick={() => { onSelect(null); onClose() }} style={{
            width: '100%', textAlign: 'left', padding: '9px 12px',
            background: !activeCategory ? '#161616' : 'transparent',
            border: `1px solid ${!activeCategory ? '#2a2a2a' : 'transparent'}`,
            color: !activeCategory ? '#fff' : '#666',
            borderRadius: 7, cursor: 'pointer', fontSize: 12,
            letterSpacing: '0.05em', transition: 'all 0.15s',
          }}>
            ☰ &nbsp;Todos os produtos
          </button>
        </div>

        {/* Grupos */}
        <nav style={{ padding: '4px 12px 32px' }}>
          {navGroups.map(g => {
            const isOpen = expanded === g.slug
            const hasActive = g.categories.some(c => c.slug === activeCategory)
            return (
              <div key={g.slug} style={{ marginBottom: 2 }}>
                <button
                  onClick={() => setExpanded(isOpen ? null : g.slug)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '9px 12px', borderRadius: 7,
                    background: hasActive ? 'rgba(201,168,76,0.07)' : 'transparent',
                    border: `1px solid ${hasActive ? 'rgba(201,168,76,0.18)' : 'transparent'}`,
                    color: hasActive ? '#c9a84c' : '#777',
                    cursor: 'pointer', fontSize: 11,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    textAlign: 'left', transition: 'all 0.15s',
                  }}
                >
                  <span>{g.label}</span>
                  <span style={{
                    fontSize: 9, transition: 'transform 0.2s',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    color: '#444',
                  }}>▼</span>
                </button>

                {isOpen && (
                  <div style={{ paddingLeft: 8, paddingTop: 2, paddingBottom: 4 }}>
                    {g.categories.map(cat => (
                      <button key={cat.slug}
                        onClick={() => { onSelect(cat.slug); onClose() }}
                        style={{
                          width: '100%', textAlign: 'left',
                          padding: '7px 12px', borderRadius: 6,
                          background: activeCategory === cat.slug ? '#161616' : 'transparent',
                          border: 'none', cursor: 'pointer',
                          color: activeCategory === cat.slug ? '#fff' : '#666',
                          fontSize: 12, letterSpacing: '0.03em',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#141414'; e.currentTarget.style.color = '#ccc' }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = activeCategory === cat.slug ? '#161616' : 'transparent'
                          e.currentTarget.style.color = activeCategory === cat.slug ? '#fff' : '#666'
                        }}
                      >
                        <span>{cat.label}</span>
                        <span style={{
                          fontSize: 10, color: '#333',
                          background: '#141414', padding: '1px 6px', borderRadius: 8,
                        }}>{cat.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

/* ─── Topbar ─────────────────────────────────────────────── */
function Topbar({ onMenu, search, onSearch, activeCategory, navGroups, onClear }: {
  onMenu: () => void
  search: string
  onSearch: (v: string) => void
  activeCategory: string | null
  navGroups: NavGroup[]
  onClear: () => void
}) {
  const label = navGroups.flatMap(g => g.categories).find(c => c.slug === activeCategory)?.label

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(8,8,8,0.96)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #141414',
    }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onMenu} style={{
          background: '#111', border: '1px solid #1e1e1e', color: '#888',
          width: 38, height: 38, borderRadius: 8, cursor: 'pointer',
          fontSize: 15, flexShrink: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>☰</button>

        <span style={{
          fontSize: 15, fontWeight: 900, letterSpacing: '0.2em',
          flexShrink: 0, display: 'none',
        }} className="logo-desktop">
          SPORT<span style={{ color: '#c9a84c' }}>ELITE</span>
        </span>

        {activeCategory && label && (
          <button onClick={onClear} style={{
            background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
            color: '#c9a84c', padding: '5px 12px', borderRadius: 20,
            cursor: 'pointer', fontSize: 11, flexShrink: 0, fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}>
            {label} ×
          </button>
        )}

        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{
            position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
            color: '#444', fontSize: 14, pointerEvents: 'none',
          }}>🔍</span>
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Buscar produto..."
            style={{
              width: '100%', background: '#111', border: '1px solid #1e1e1e',
              color: '#fff', padding: '9px 32px 9px 34px',
              borderRadius: 8, fontSize: 13, boxSizing: 'border-box',
            }}
          />
          {search && (
            <button onClick={() => onSearch('')} style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16,
            }}>×</button>
          )}
        </div>
      </div>
    </header>
  )
}

/* ─── App ────────────────────────────────────────────────── */
export default function App() {
  const { products, navGroups, loading, error, updatePrice } = useProducts()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selected, setSelected] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filtered = useMemo(() => products.filter(p => {
    if (!p.active) return false
    if (activeCategory && p.category !== activeCategory) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.tags?.some(t => t.includes(q)) ||
        p.variants.some(v => v.label.toLowerCase().includes(q))
      )
    }
    return true
  }), [products, activeCategory, search])

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#080808',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 14,
    }}>
      <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '0.25em', color: '#fff' }}>
        SPORT<span style={{ color: '#c9a84c' }}>ELITE</span>
      </span>
      <span style={{ color: '#333', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
        carregando...
      </span>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#666' }}>Erro ao carregar produtos. Verifique o db.json.</p>
    </div>
  )

  const activeCatLabel = navGroups.flatMap(g => g.categories).find(c => c.slug === activeCategory)?.label

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <Sidebar
        navGroups={navGroups}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Topbar
        onMenu={() => setSidebarOpen(true)}
        search={search}
        onSearch={setSearch}
        activeCategory={activeCategory}
        navGroups={navGroups}
        onClear={() => setActiveCategory(null)}
      />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 16px 48px' }}>
        {/* Título da seção */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>
            {activeCatLabel ?? 'Catálogo'}
          </h2>
          <span style={{ color: '#444', fontSize: 12 }}>
            {filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏷️</div>
            <p style={{ color: '#555', fontSize: 14 }}>Nenhum produto encontrado</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory(null) }}
              style={{
                marginTop: 16, background: 'transparent', border: '1px solid #222',
                color: '#666', padding: '8px 20px', borderRadius: 6,
                cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
              }}
            >Ver tudo</button>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                <ProductCard product={p} onSelect={setSelected} />
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ borderTop: '1px solid #111', padding: '20px 16px', textAlign: 'center' }}>
        <p style={{ color: '#252525', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          SPORTELITE © {new Date().getFullYear()}
        </p>
      </footer>

      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onSavePrice={updatePrice}
        />
      )}
    </div>
  )
}
