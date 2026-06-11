import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') { setDark(true); document.documentElement.setAttribute('data-theme', 'dark') }
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <nav className="nav">
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        {/* Luminary Logo Mark */}
        <div style={{ width: 36, height: 36, borderRadius: 9, background: '#0E0C15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 8, top: 7, width: 7, height: 22, background: 'linear-gradient(180deg,#E05C1A,#D4286F)', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: 8, top: 22, width: 20, height: 7, background: 'linear-gradient(90deg,#E05C1A,#D4286F)', borderRadius: 2 }} />
          <div style={{ position: 'absolute', right: 6, top: 7, width: 9, height: 9, borderRadius: '50%', background: '#F5A623', boxShadow: '0 0 6px #F5A623' }} />
        </div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(90deg,#F5A623,#D4286F,#6B2FF0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Luminary
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }}>
        {['Gallery', 'Pricing', 'About'].map(item => (
          <Link key={item} href={`/${item.toLowerCase()}`}
            style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            {item}
          </Link>
        ))}
        {session && (
          <Link href="/create"
            style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            Create
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Theme toggle */}
        <button onClick={toggleTheme} title="Toggle theme" style={{
          width: 42, height: 24, borderRadius: 12,
          background: dark ? 'linear-gradient(90deg,#6B2FF0,#D4286F)' : 'rgba(0,0,0,0.15)',
          border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', padding: 2, transition: 'background 0.3s'
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%', background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 11, transform: dark ? 'translateX(18px)' : 'translateX(0)', transition: 'transform 0.3s'
          }}>
            {dark ? '🌙' : '☀️'}
          </div>
        </button>

        {session ? (
          <>
            <Link href="/dashboard">
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg,#6B2FF0,#D4286F)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', color: '#fff',
              }}>
                {(session.user?.name?.[0] ?? 'U').toUpperCase()}
              </div>
            </Link>
            <button className="btn btn-ghost btn-sm" onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm">Start free</Link>
          </>
        )}
      </div>
    </nav>
  )
}