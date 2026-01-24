import Head from 'next/head'
import { useWallet } from '@solana/wallet-adapter-react'
import CustomWalletButton from '@/components/CustomWalletButton'
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
              <img src="/zonatone-logo.png" alt="ZonatOne" className={styles.logoImage} />
            </div>

            <h1 className={styles.title}>
              Welcome to <span className={styles.gradient}>ZonatOne</span>
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
                <p>Powered by ZonatOne. Instant interactions.</p>
              </div>
            </div>

            <div className={styles.ctaSection}>
              <CustomWalletButton className={styles.connectBtn} />
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
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <img src="/zonatone-logo.png" alt="ZonatOne" className={styles.footerLogo} />
              <p className={styles.footerTagline}>Built with 💜 on ZonatOne</p>
            </div>

            <div className={styles.footerLinks}>
              <div className={styles.footerSection}>
                <h4>Social Media</h4>
                <a href="https://x.com/ZonatOne" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Twitter
                </a>
                <a href="https://t.me/ZonatOne" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                  Telegram
                </a>
              </div>

              <div className={styles.footerSection}>
                <h4>Support Us</h4>
                <div className={styles.donationAddress}>
                  <span className={styles.donationLabel}>ETH:</span>
                  <code>0x6b1f806937695e672744f5BB1E52755439059c40</code>
                </div>
                <div className={styles.donationAddress}>
                  <span className={styles.donationLabel}>SOL:</span>
                  <code>9i7m...9c40</code>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© 2024 ZonatOne. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
