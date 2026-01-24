import Head from 'next/head'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import styles from '@/styles/Home.module.css'

export default function Home() {
  const { connected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (connected) {
      router.push('/feed')
    }
  }, [connected, router])

  return (
    <>
      <Head>
        <title>SolanaVerse - Web3 Social Media</title>
        <meta name="description" content="Connect with the decentralized world through Phantom wallet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.page}>
        <div className={styles.backgroundOrbs}>
          <div className={styles.orb1}></div>
          <div className={styles.orb2}></div>
          <div className={styles.orb3}></div>
        </div>

        <main className={styles.main}>
          <div className={styles.hero}>
            <div className={styles.logoLarge}>
              <span className={styles.logoIcon}>◆</span>
            </div>

            <h1 className={styles.title}>
              Welcome to <span className={styles.gradient}>SolanaVerse</span>
            </h1>

            <p className={styles.subtitle}>
              The next generation of social media, powered by Web3.
              Connect your Phantom wallet and join the decentralized revolution.
            </p>

            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🔐</div>
                <h3>Wallet Login</h3>
                <p>No passwords needed. Your wallet is your identity.</p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🌐</div>
                <h3>Decentralized</h3>
                <p>Own your data. Control your social experience.</p>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>⚡</div>
                <h3>Lightning Fast</h3>
                <p>Powered by Solana. Instant interactions.</p>
              </div>
            </div>

            <div className={styles.ctaSection}>
              <WalletMultiButton className={styles.connectBtn} />
              <p className={styles.ctaHint}>
                No balance required • Just connect to start
              </p>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100K+</span>
              <span className={styles.statLabel}>Users</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1M+</span>
              <span className={styles.statLabel}>Posts</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50K+</span>
              <span className={styles.statLabel}>Daily Active</span>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <p>Built with 💜 on Solana</p>
        </footer>
      </div>
    </>
  )
}
