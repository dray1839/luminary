// pages/gallery.tsx
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import axios from 'axios'
import Link from 'next/link'

const FILTERS = ['ALL', 'IMAGE', 'VIDEO', 'ANIMATION']

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/gallery?type=${filter}`)
      .then(r => setItems(r.data.items))
      .finally(() => setLoading(false))
  }, [filter])

  const handleLike = async (id: string) => {
    await axios.post('/api/gallery', { id })
    setItems(prev => prev.map(i => i.id === id ? { ...i, likes: i.likes + 1 } : i))
  }

  return (
    <>
      <Head><title>Gallery — Luminary AI</title></Head>
      <Navbar />

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="tag tag-teal" style={{ marginBottom: '0.5rem' }}>Community</span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
              The <span className="grad">Gallery</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
              Creations made by the Luminary community
            </p>
          </div>
          <Link href="/create" className="btn btn-primary btn-sm">+ Create yours</Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '2rem', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 16px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 500,
                border: `0.5px solid ${filter === f ? 'rgba(230,56,135,0.5)' : 'rgba(255,255,255,0.1)'}`,
                background: filter === f ? 'rgba(230,56,135,0.1)' : 'transparent',
                color: filter === f ? '#E63887' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="shimmer" style={{ height: 260, borderRadius: 14, background: '#1F1829' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {items.map(item => (
              <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>

                {item.type === 'VIDEO' || item.type === 'ANIMATION' ? (
                  <video src={item.outputUrl} muted loop style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                    onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play()}
                    onMouseLeave={e => (e.currentTarget as HTMLVideoElement).pause()}
                  />
                ) : (
                  <img src={item.outputUrl} alt={item.prompt} style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />
                )}

                <div style={{ padding: '0.85rem' }}>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', marginBottom: 8, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {item.prompt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                      {item.user?.name ?? 'Anonymous'}
                    </span>
                    <button onClick={() => handleLike(item.id)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.15s', fontFamily: 'DM Sans' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#E63887')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
                      ♥ {item.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✦</p>
            <p>No public creations yet. Be the first!</p>
            <Link href="/create" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Create now</Link>
          </div>
        )}
      </div>
    </>
  )
}
