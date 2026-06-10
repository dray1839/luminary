// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react'

function LiveCounter() {
  const [count, setCount] = useState(3247891)
  useEffect(() => {
    const t = setInterval(() => setCount(c => c + Math.floor(Math.random() * 3) + 1), 1800)
    return () => clearInterval(t)
  }, [])
  return <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem' }}>{count.toLocaleString()}</span>
}

const PROMPTS = [
  "A glowing city floating in the clouds at golden hour",
  "Portrait of a jazz musician made of stained glass",
  "Neon tiger swimming through a galaxy of stars",
  "Ancient temple overgrown with bioluminescent vines",
  "Abstract waves of light colliding in deep space",
]

const FEATURES = [
  { icon: '🖼️', title: 'Image Generation', desc: 'Photorealistic, illustrated, or abstract — any style in seconds.', color: 'var(--amber)' },
  { icon: '🎬', title: 'Video Creation', desc: 'Text-to-video up to 4K resolution with cinematic motion.', color: 'var(--violet)' },
  { icon: '✨', title: 'Animation Studio', desc: 'Bring any still image to life with fluid movement.', color: 'var(--pink)' },
  { icon: '🎨', title: 'Style Transfer', desc: 'Apply any artistic style to your images or clips.', color: 'var(--teal)' },
  { icon: '🔍', title: 'AI Upscaling', desc: 'Sharpen and enhance to ultra-high resolution.', color: 'var(--orange)' },
  { icon: '⚡', title: 'Prompt Remix', desc: 'AI suggests and evolves your prompts automatically.', color: 'var(--violet)' },
]

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Digital Artist', text: 'Luminary replaced 3 tools I was paying for. The quality is insane.', avatar: 'S' },
  { name: 'James M.', role: 'Content Creator', text: 'I went from idea to finished video in under 2 minutes. Wild.', avatar: 'J' },
  { name: 'Priya R.', role: 'Brand Designer', text: 'My clients think I have a whole team. It\'s just me and Luminary.', avatar: 'P' },
]

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [promptIdx, setPromptIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setPromptIdx(i => (i + 1) % PROMPTS.length), 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <Head>
        <title>Luminary AI — Create Images, Animations & Videos</title>
        <meta name="description" content="Turn your imagination into stunning AI-generated images, animations, and videos." />
      </Head>

      <Navbar />

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '6rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,47,240,0.08) 0%, transparent 70%)', top: -200, right: -100, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,40,111,0.07) 0%, transparent 70%)', top: 100, left: -100, pointerEvents: 'none' }} />

        <div className="fade-up-1">
          <span className="tag tag-amber" style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, background: 'var(--amber)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Now with 4K video generation
          </span>
        </div>

        <h1 className="fade-up-2" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.2rem', lineHeight: 1.05 }}>
          Your imagination,<br /><span className="grad">made visible.</span>
        </h1>

        <p className="fade-up-3" style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Generate stunning images, fluid animations, and cinematic videos from a single text prompt. No design skills needed.
        </p>

        {/* Hero prompt box */}
        <div className="fade-up-4" style={{ maxWidth: 680, margin: '0 auto 1rem' }}>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18,
            display: 'flex', alignItems: 'center', gap: 10, padding: '6px 6px 6px 20px',
            boxShadow: 'var(--shadow-lg)', transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <input className="input" style={{ background: 'transparent', border: 'none', flex: 1, fontSize: '1rem', padding: 0, boxShadow: 'none' }}
              placeholder={PROMPTS[promptIdx]} value={prompt} onChange={e => setPrompt(e.target.value)} />
            <Link href={`/create?prompt=${encodeURIComponent(prompt || PROMPTS[promptIdx])}`} className="btn btn-primary" style={{ borderRadius: 13, flexShrink: 0 }}>
              Generate ✦
            </Link>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: 10 }}>
            Free to try — 30 credits included, no card needed
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center' }}>
            <LiveCounter />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>images created</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: 'var(--teal)' }}>147k</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>creators</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: 'var(--pink)' }}>4.9★</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>avg rating</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: 'var(--violet)' }}>2min</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>avg creation time</p>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Viral: Prompt Battle CTA */}
      <section style={{ padding: '3rem 1.5rem', background: 'var(--bg2)', textAlign: 'center' }}>
        <div className="container">
          <span className="tag tag-pink" style={{ marginBottom: '0.8rem' }}>⚔️ New Feature</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '0.6rem' }}>
            Prompt Battle — <span className="grad">Vote for the best</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Two AI images. Same theme. You decide the winner.
          </p>
          <Link href="/battle" className="btn btn-ghost">⚔️ Enter the Arena</Link>
        </div>
      </section>

      <div className="divider" />

      {/* Features */}
      <section className="section">
        <div className="container">
          <span className="tag tag-amber" style={{ marginBottom: '0.8rem' }}>What you can build</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', marginBottom: '0.6rem' }}>
            Every creative tool,<br /><span className="grad-teal">one platform</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem', maxWidth: 480 }}>
            From a rough idea to a finished piece in seconds.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card glow-hover"
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>{f.icon}</div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}>{f.title}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* How it works */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="tag tag-violet" style={{ marginBottom: '0.8rem' }}>How it works</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '3rem' }}>
            Create in <span className="grad">3 simple steps</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { step: '01', title: 'Describe your vision', desc: 'Type what you want to create in plain English. Be as detailed or brief as you like.' },
              { step: '02', title: 'Choose your style', desc: 'Pick a visual style or let Luminary suggest one based on your prompt.' },
              { step: '03', title: 'Download & share', desc: 'Your creation is ready in seconds. Download in full quality or share to the gallery.' },
            ].map(s => (
              <div key={s.step} className="card" style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.5rem', color: 'var(--border-hover)', marginBottom: '0.8rem' }}>{s.step}</div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{s.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <span className="tag tag-teal" style={{ marginBottom: '0.8rem' }}>What creators say</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '2.5rem' }}>
            Loved by <span className="grad">147,000+ creators</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--violet), var(--pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: 'var(--amber)', fontSize: '0.8rem' }}>★★★★★</div>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* CTA */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center', background: 'var(--bg2)' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.7rem' }}>
            Start creating for <span className="grad">free today</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>
            No credit card. No design experience. Just imagination.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" className="btn btn-primary btn-lg">Create your free account →</Link>
            <Link href="/gallery" className="btn btn-ghost btn-lg">Browse the gallery</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.8rem' }}>
              <div className="logo-mark">L</div>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem' }} className="grad">Luminary</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>AI-powered creative studio for everyone.</p>
          </div>
          <div>
            <h5 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Product</h5>
            {['Create', 'Gallery', 'Pricing', 'Battle'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>{l}</Link>
            ))}
          </div>
          <div>
            <h5 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Company</h5>
            {['About', 'Blog', 'Careers', 'Contact'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>{l}</Link>
            ))}
          </div>
          <div>
            <h5 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Legal</h5>
            {['Privacy', 'Terms', 'API'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>{l}</Link>
            ))}
          </div>
        </div>
        <div className="container" style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>© 2026 Luminary AI. All rights reserved.</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>Made with ✦ for creators everywhere</p>
        </div>
      </footer>
    </>
  )
}
