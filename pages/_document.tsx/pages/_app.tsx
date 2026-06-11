import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import '../styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark')
  }, [])
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster position='bottom-right' />
    </SessionProvider>
  )
}
