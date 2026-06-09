// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useEffect, useState } from 'react'

// Viral feature: live counter that increments
function LiveCounter() {
  const [count, setCount] = useState(2847391)
  useEffect(() => {
    const t = setInterval(() => setCount(c => c + Math.floor(Math.random() * 3) + 1), 1800)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#F5A623' }}>
      {count.toLocaleString()}
    </span>
  )
}

// Viral feature: rotating prompt suggestions
const PROMPTS = [
  "A neon tiger floating in space, cyberpunk style",
  "Watercolor painting of Nairobi at golden hour",
  "Abstract portrait of a jazz musician in motion",
  "Futuristic city built inside a giant tree",
  "A glowing jellyfish made of stained glass",
  "Epic battle between clouds and mountains",
]

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [promptIdx, setPromptIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setPromptIdx(i => (i + 1) % PROMPTS.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <Head>
        <title>Luminary AI — Create Images, Animations & Videos</title>
        <meta name="description" content="Turn your imagination into stunning AI-generated images, animations, and videos in seconds." />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background orbs */}
        <div className="orb" style={{ width: 500, height: 500, background: 'rgba(123,63,242,0.15)', top: -100, right: -100, animationDuration: '14s' }} />
        <div className="orb" style={{ width: 400, height: 400, background: 'rgba(230,56,135,0.1)', top: 200, left: -150, animationDuration: '18s', animationDelay: '2s' }} />

        <Navbar />

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '5rem 1.5rem 3rem', position: 'relative' }}>
          <div className="fade-up-1">
            <span className="tag tag-amber" style={{ marginBottom: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, background: '#F5A623', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Now with 4K video generation
            </span>
          </div>

          <h1 className="fade-up-2" style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '1.2rem', lineHeight: 1.05 }}>
            Your imagination,<br /><span className="grad">made visible.</span>
          </h1>

          <p className="fade-up-3" style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Generate stunning images, fluid animations, and cinematic videos from a single text prompt. No design skills needed.
          </p>

          {/* Giant prompt input — the viral hero element */}
          <div className="fade-up-3" style={{ maxWidth: 680, margin: '0 auto 1rem', position: 'relative' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 6px 6px 20px',
              transition: 'border-color 0.2s',
            }}>
              <input
                className="input"
                style={{ background: 'transparent', border: 'none', flex: 1, fontSize: '1rem', padding: 0 }}
                placeholder={PROMPTS[promptIdx]}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
              <Link
                href={`/create?prompt=${encodeURIComponent(prompt || PROMPTS[promptIdx])}`}
                className="btn btn-primary"
                style={{ flexShrink: 0, borderRadius: 11 }}
              >
                Generate ✦
              </Link>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
              Free to try — no account needed for your first 3 generations
            </p>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', marginTop: '3rem', padding: '2rem 0', borderTop: '0.5px solid rgba(255,255,255,0.07)' }}>
            <div style={{ textAlign: 'center' }}>
              <LiveCounter />
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>images created</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: '#1AB8A0' }}>147k</span>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>creators</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: '#E63887' }}>4.9★</span>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>avg rating</p>
            </div>
          </div>
        </section>

        {/* Viral feature: Prompt Battle */}
        <section style={{ padding: '3rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <span className="tag tag-violet" style={{ marginBottom: '0.8rem' }}>⚡ Viral Feature</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '0.6rem' }}>
              Prompt Battle <span className="grad">— Vote for the best</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Two AI images. Same theme. You decide which one wins. Results shared live.
            </p>
            <Link href="/battle" className="btn btn-ghost">
              ⚔️ Enter the Arena
            </Link>
          </div>
        </section>

        {/* Tools grid */}
        <section className="section">
          <div className="container">
            <span className="tag tag-amber" style={{ marginBottom: '0.8rem' }}>What you can build</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: '0.6rem' }}>
              Every creative tool, <span className="grad-teal">one platform</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '2.5rem', fontSize: '0.95rem', maxWidth: 480 }}>
              From a rough idea to a finished piece in seconds.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              {[
                { icon: '🖼️', title: 'Image Generation', desc: 'Photo-real or illustrated, any style.', tag: 'tag-amber', color: '#F5A623' },
                { icon: '🎬', title: 'Video Creation', desc: 'Text-to-video up to 4K, 2 min.', tag: 'tag-violet', color: '#7B3FF2' },
                { icon: '✨', title: 'Animation Studio', desc: 'Bring any image to life.', tag: 'tag-pink', color: '#E63887' },
                { icon: '🎨', title: 'Style Transfer', desc: 'Apply any art style to your media.', tag: 'tag-teal', color: '#1AB8A0' },
                { icon: '🔍', title: 'AI Upscaling', desc: 'Sharpen images to ultra HD.', tag: 'tag-amber', color: '#F5A623' },
                { icon: '⚡', title: 'Prompt Remix', desc: 'Evolve prompts with AI suggestions.', tag: 'tag-violet', color: '#a67eff' },
              ].map(tool => (
                <div key={tool.title} className="card glow-hover" style={{ cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '0.7rem' }}>{tool.icon}</div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}>{tool.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '4rem 1.5rem', textAlign: 'center', borderTop: '0.5px solid rgba(255,255,255,0.07)' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', marginBottom: '0.7rem' }}>
            Start creating for <span className="grad">free today</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem' }}>No credit card. No design experience. Just imagination.</p>
          <Link href="/auth/register" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2.2rem' }}>
            Create your free account →
          </Link>
        </section>

        <footer style={{ padding: '1.5rem 2rem', borderTop: '0.5px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span className="nav-logo grad">Luminary</span>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/api-docs">API</Link>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>© 2026 Luminary AI</p>
        </footer>
      </div>
    </>
  )
}
