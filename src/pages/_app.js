import '@/styles/globals.css'
import { useMemo, useState, useEffect } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { SocialProvider } from '@/context/SocialContext'
import { ThemeProvider } from '@/context/ThemeContext'

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css'

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false)

  // Solana network endpoint
  const endpoint = useMemo(() => clusterApiUrl('devnet'), [])

  // Wallet adapters
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <SocialProvider>
              <Component {...pageProps} />
            </SocialProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  )
}
