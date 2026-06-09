// pages/create.tsx
import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'
import axios from 'axios'

const GEN_TYPES = [
  { id: 'IMAGE', label: 'Image', icon: '🖼️', cost: 1 },
  { id: 'VIDEO', label: 'Video', icon: '🎬', cost: 5 },
  { id: 'ANIMATION', label: 'Animation', icon: '✨', cost: 3 },
  { id: 'STYLE_TRANSFER', label: 'Style Transfer', icon: '🎨', cost: 2 },
]

const STYLES = ['Photorealistic', 'Anime', 'Oil Painting', 'Watercolor', 'Pixel Art', 'Cinematic', 'Neon', '3D Render']

export default function CreatePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [prompt, setPrompt] = useState((router.query.prompt as string) ?? '')
  const [type, setType] = useState('IMAGE')
  const [style, setStyle] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!session) { router.push('/auth/login'); return }
    if (!prompt.trim()) { toast.error('Enter a prompt first'); return }

    setLoading(true)
    setResult(null)
    try {
      const fullPrompt = style ? `${prompt}, ${style} style` : prompt
      const { data } = await axios.post('/api/generate', { prompt: fullPrompt, type, isPublic })
      setResult(data.outputUrl)
      toast.success(`Done! Used ${data.creditsUsed} credit${data.creditsUsed > 1 ? 's' : ''}`)
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Create — Luminary AI</title></Head>
      <Navbar />

      <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minHeight: '85vh' }}>
        {/* Left: Controls */}
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>Create</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', marginBottom: '2rem' }}>
            {session ? `${(session.user as any).credits ?? 0} credits remaining` : 'Sign in to save your creations'}
          </p>

          {/* Generation type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.6rem', display: 'block' }}>TYPE</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {GEN_TYPES.map(t => (
                <button key={t.id}
                  onClick={() => setType(t.id)}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 12,
                    border: `0.5px solid ${type === t.id ? 'rgba(230,56,135,0.6)' : 'rgba(255,255,255,0.1)'}`,
                    background: type === t.id ? 'rgba(230,56,135,0.1)' : 'rgba(255,255,255,0.03)',
                    color: type === t.id ? '#fff' : 'rgba(255,255,255,0.5)',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'DM Sans, sans-serif',
                    textAlign: 'center',
                  }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: 3 }}>{t.icon}</div>
                  {t.label}
                  <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{t.cost} credit{t.cost > 1 ? 's' : ''}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.6rem', display: 'block' }}>PROMPT</label>
            <textarea
              className="input"
              rows={4}
              placeholder="Describe what you want to create..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              style={{ resize: 'none', lineHeight: 1.6 }}
            />
          </div>

          {/* Style selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.6rem', display: 'block' }}>STYLE (optional)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {STYLES.map(s => (
                <button key={s}
                  onClick={() => setStyle(style === s ? '' : s)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 999,
                    border: `0.5px solid ${style === s ? 'rgba(123,63,242,0.6)' : 'rgba(255,255,255,0.1)'}`,
                    background: style === s ? 'rgba(123,63,242,0.15)' : 'transparent',
                    color: style === s ? '#a67eff' : 'rgba(255,255,255,0.45)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'all 0.2s',
                  }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Public toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
            <div
              onClick={() => setIsPublic(!isPublic)}
              style={{
                width: 40, height: 22, borderRadius: 11,
                background: isPublic ? 'linear-gradient(90deg,#E05C1A,#E63887)' : 'rgba(255,255,255,0.1)',
                position: 'relative', cursor: 'pointer', transition: 'background 0.25s',
              }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3, left: isPublic ? 21 : 3, transition: 'left 0.25s',
              }} />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Share to public gallery</span>
          </div>

          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}
            style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '0.9rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Generating...' : '✦ Generate'}
          </button>
        </div>

        {/* Right: Output */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {loading && (
            <div style={{ width: '100%', aspectRatio: '1', borderRadius: 16, overflow: 'hidden' }}>
              <div className="shimmer" style={{ width: '100%', height: '100%', background: '#1F1829' }} />
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.88rem', marginTop: '1rem' }}>
                Generating your {type.toLowerCase()}...
              </p>
            </div>
          )}
          {result && !loading && (
            <div style={{ width: '100%' }}>
              {type === 'VIDEO' || type === 'ANIMATION' ? (
                <video src={result} controls style={{ width: '100%', borderRadius: 16 }} />
              ) : (
                <img src={result} alt={prompt} style={{ width: '100%', borderRadius: 16, border: '0.5px solid rgba(255,255,255,0.08)' }} />
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: '1rem', justifyContent: 'center' }}>
                <a href={result} download className="btn btn-ghost btn-sm">⬇ Download</a>
                <button className="btn btn-ghost btn-sm" onClick={() => { setPrompt(prompt); setResult(null); }}>🔁 Regenerate</button>
              </div>
            </div>
          )}
          {!result && !loading && (
            <div style={{
              width: '100%', aspectRatio: '1', borderRadius: 16,
              background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.25)', fontSize: '0.88rem', gap: 8,
            }}>
              <span style={{ fontSize: '2.5rem' }}>✦</span>
              Your creation will appear here
            </div>
          )}
        </div>
      </div>
    </>
  )
}
