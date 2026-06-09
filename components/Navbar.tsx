// components/Navbar.tsx
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        <span className="grad">Luminary</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link href="/gallery" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', fontWeight: 500 }}>
          Gallery
        </Link>
        <Link href="/pricing" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', fontWeight: 500 }}>
          Pricing
        </Link>
        {session && (
          <Link href="/create" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', fontWeight: 500 }}>
            Create
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {session ? (
          <>
            <Link href="/dashboard">
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7B3FF2, #E63887)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
              }}>
                {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
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
