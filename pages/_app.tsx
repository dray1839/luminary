// pages/_app.tsx
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1F1829',
            color: '#fff',
            border: '0.5px solid rgba(255,255,255,0.12)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.88rem',
          },
          success: { iconTheme: { primary: '#1AB8A0', secondary: '#fff' } },
          error: { iconTheme: { primary: '#E63887', secondary: '#fff' } },
        }}
      />
    </SessionProvider>
  )
}
