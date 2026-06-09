// pages/battle.tsx
// Viral feature: Two AI images compete, users vote — results tracked live
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'

const BATTLE_THEMES = [
  { theme: 'Sunset on Mars vs Underwater City', prompts: ['Dramatic sunset on Mars with red dust storms and futuristic base', 'Glowing bioluminescent underwater city in the deep ocean'] },
  { theme: 'Neon Dragon vs Crystal Phoenix', prompts: ['Massive neon purple dragon flying over a cyberpunk city at night', 'Beautiful crystal phoenix rising from ice, frozen tundra backdrop'] },
  { theme: 'Ancient Forest vs Space Station', prompts: ['Ancient magical forest with glowing mushrooms and floating islands', 'Futuristic space station orbiting a gas giant, astronauts outside'] },
]

export default function BattlePage() {
  const [battle] = useState(BATTLE_THEMES[Math.floor(Math.random() * BATTLE_THEMES.length)])
  const [images, setImages] = useState<[string | null, string | null]>([null, null])
  const [loading, setLoading] = useState(false)
  const [voted, setVoted] = useState<null | 0 | 1>(null)
  const [votes, setVotes] = useState([0, 0])

  const runBattle = async () => {
    setLoading(true)
    setImages([null, null])
    setVoted(null)
    setVotes([0, 0])
    try {
      const [r1, r2] = await Promise.all([
        axios.post('/api/generate', { prompt: battle.prompts[0], type: 'IMAGE', isPublic: false }),
        axios.post('/api/generate', { prompt: battle.prompts[1], type: 'IMAGE', isPublic: false }),
      ])
      setImages([r1.data.outputUrl, r2.data.outputUrl])
    } catch {
      toast.error('Need to be signed in with credits to run a battle')
    } finally {
      setLoading(false)
    }
  }

  const vote = (idx: 0 | 1) => {
    if (voted !== null) return
    setVoted(idx)
    setVotes(v => { const n = [...v]; n[idx]++; return n as [number, number] })
    toast.success('Vote cast! Share your result 👇')
  }

  const total = votes[0] + votes[1]

  return (
    <>
      <Head><title>Prompt Battle — Luminary AI</title></Head>
      <Navbar />

      <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <span className="tag tag-pink" style={{ marginBottom: '1rem' }}>⚔️ Prompt Battle</span>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '0.5rem' }}>
          <span className="grad">Two prompts. One winner.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Theme: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{battle.theme}</strong>
        </p>

        {!images[0] && !loading && (
          <button className="btn btn-primary" onClick={runBattle} style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }}>
            ⚡ Start Battle
          </button>
        )}

        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
            <div className="shimmer" style={{ height: 320, borderRadius: 16, background: '#1F1829' }} />
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: 'rgba(255,255,255,0.3)' }}>VS</div>
            <div className="shimmer" style={{ height: 320, borderRadius: 16, background: '#1F1829' }} />
          </div>
        )}

        {images[0] && images[1] && (
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {[0, 1].map((idx) => (
                <>
                  {idx === 1 && <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: 'rgba(255,255,255,0.4)' }}>VS</div>}
                  <div key={idx}
                    onClick={() => vote(idx as 0 | 1)}
                    style={{
                      borderRadius: 16, overflow: 'hidden', cursor: voted === null ? 'pointer' : 'default',
                      border: voted === idx ? '2px solid #E63887' : '1px solid rgba(255,255,255,0.08)',
                      transform: voted === idx ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.25s',
                      opacity: voted !== null && voted !== idx ? 0.5 : 1,
                      position: 'relative',
                    }}>
                    <img src={images[idx]!} alt={`Option ${idx + 1}`} style={{ width: '100%', display: 'block' }} />
                    {voted !== null && (
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', padding: '0.7rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden', height: 6, marginBottom: 4 }}>
                          <div style={{ height: '100%', background: idx === 0 ? '#F5A623' : '#7B3FF2', width: total ? `${(votes[idx] / total) * 100}%` : '0%', transition: 'width 0.5s' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#fff' }}>{total ? Math.round((votes[idx] / total) * 100) : 0}%</span>
                      </div>
                    )}
                    {voted === null && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; e.currentTarget.style.opacity = '1' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; e.currentTarget.style.opacity = '0' }}>
                        <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>Vote this ↑</span>
                      </div>
                    )}
                  </div>
                </>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-ghost btn-sm" onClick={runBattle}>🔁 New battle</button>
              <button className="btn btn-ghost btn-sm"
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied — share it!') }}>
                📤 Share result
              </button>
              <Link href="/create" className="btn btn-primary btn-sm">Create your own ✦</Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
