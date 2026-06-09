// pages/dashboard.tsx
import Head from 'next/head'
import { useSession, getSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  if (!session) return { redirect: { destination: '/auth/login', permanent: false } }
  return { props: {} }
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [gens, setGens] = useState<any[]>([])
  const user = session?.user as any

  useEffect(() => {
    axios.get('/api/user/generations').then(r => setGens(r.data)).catch(() => {})
  }, [])

  const planColors: Record<string, string> = { STARTER: '#888', CREATOR: '#E63887', PRO: '#7B3FF2' }

  return (
    <>
      <Head><title>Dashboard — Luminary AI</title></Head>
      <Navbar />

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#7B3FF2,#E63887)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem' }}>
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>Hey, {user?.name?.split(' ')[0] ?? 'Creator'} 👋</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: planColors[user?.plan ?? 'STARTER'], background: `${planColors[user?.plan ?? 'STARTER']}18`, padding: '2px 10px', borderRadius: 999 }}>
                {user?.plan ?? 'STARTER'} plan
              </span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{user?.credits ?? 0} credits left</span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            {user?.plan === 'STARTER' && <Link href="/pricing" className="btn btn-primary btn-sm">Upgrade plan ↗</Link>}
            <Link href="/create" className="btn btn-ghost btn-sm">+ New creation</Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 12, marginBottom: '2.5rem' }}>
          {[
            { label: 'Total generations', value: gens.length },
            { label: 'This month', value: gens.filter(g => new Date(g.createdAt) > new Date(Date.now() - 30 * 864e5)).length },
            { label: 'Public gallery', value: gens.filter(g => g.isPublic).length },
            { label: 'Total likes', value: gens.reduce((s, g) => s + g.likes, 0) },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '1rem', border: '0.5px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontFamily: 'Syne', fontSize: '1.8rem', fontWeight: 800 }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Creations */}
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Your creations</h2>
        {gens.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✦</p>
            <p>You haven't created anything yet.</p>
            <Link href="/create" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Start creating</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {gens.map(g => (
              <div key={g.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {g.outputUrl ? (
                  g.type === 'VIDEO' || g.type === 'ANIMATION'
                    ? <video src={g.outputUrl} muted loop style={{ width: '100%', height: 180, objectFit: 'cover' }} onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play()} onMouseLeave={e => (e.currentTarget as HTMLVideoElement).pause()} />
                    : <img src={g.outputUrl} alt={g.prompt} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                ) : (
                  <div className={g.status === 'PROCESSING' ? 'shimmer' : ''} style={{ width: '100%', height: 180, background: '#1F1829', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                    {g.status === 'FAILED' ? '✗ Failed' : '⏳ Processing'}
                  </div>
                )}
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.prompt}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)' }}>{new Date(g.createdAt).toLocaleDateString()}</span>
                    {g.outputUrl && <a href={g.outputUrl} download style={{ fontSize: '0.72rem', color: '#1AB8A0' }}>Download</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
