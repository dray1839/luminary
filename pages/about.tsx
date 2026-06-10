// pages/about.tsx
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      <Head><title>About — Luminary AI</title></Head>
      <Navbar />
      <div className="container" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <span className="tag tag-violet" style={{ marginBottom: '1rem' }}>Our story</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            We believe creativity<br />belongs to <span className="grad">everyone</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
            Luminary was built on a simple idea: the tools to create stunning visuals shouldn't require years of design training or expensive software. We've combined the latest AI models into one intuitive platform so anyone — from a student in Nairobi to a studio in New York — can bring their imagination to life.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '3rem' }}>
            Our team is a small group of designers, engineers, and artists who believe the future of creativity is collaborative — between humans and AI, working together to make something neither could alone.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: '3rem' }}>
            {[
              { label: 'Founded', value: '2025' },
              { label: 'Creators', value: '147,000+' },
              { label: 'Images created', value: '3.2M+' },
              { label: 'Countries', value: '89' },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }} className="grad">{s.value}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/auth/register" className="btn btn-primary">Start creating free</Link>
            <Link href="/contact" className="btn btn-ghost">Get in touch</Link>
          </div>
        </div>
      </div>
    </>
  )
}
