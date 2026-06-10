// components/Navbar.tsx
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="logo-mark">L</div>
        <span className="nav-logo grad">Luminary</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }}>
        <Link href="/gallery" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 500, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          Gallery
        </Link>
        <Link href="/pricing" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 500, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          Pricing
        </Link>
        <Link href="/about" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 500, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          About
        </Link>
        {session && (
          <Link href="/create" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            Create
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Theme toggle */}
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          <div className="theme-toggle-thumb">{dark ? '🌙' : '☀️'}</div>
        </button>

        {session ? (
          <>
            <Link href="/dashboard">
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--violet), var(--pink))',
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
