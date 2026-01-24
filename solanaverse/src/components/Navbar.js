import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useTheme } from '@/context/ThemeContext'
import { useSocial } from '@/context/SocialContext'
import styles from '@/styles/Navbar.module.css'

export default function Navbar() {
    const { connected, publicKey } = useWallet()
    const { theme, toggleTheme } = useTheme()
    const { shortenAddress, generateAvatar, getProfile } = useSocial()

    const currentUserProfile = connected && publicKey ? getProfile(publicKey.toString()) : null

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>◆</span>
                    <span className={styles.logoText}>SolanaVerse</span>
                </Link>

                <div className={styles.navLinks}>
                    {connected && (
                        <>
                            <Link href="/feed" className={styles.navLink}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                <span>Feed</span>
                            </Link>
                            <Link href={`/profile/${publicKey?.toString()}`} className={styles.navLink}>
                                {currentUserProfile?.customAvatar ? (
                                    <img
                                        src={currentUserProfile.customAvatar}
                                        alt="Avatar"
                                        className={styles.avatarSmallImage}
                                    />
                                ) : (
                                    <div
                                        className={styles.avatarSmall}
                                        style={{ backgroundColor: generateAvatar(publicKey?.toString()) }}
                                    >
                                        {publicKey?.toString().slice(0, 2)}
                                    </div>
                                )}
                                <span>{currentUserProfile?.displayName || 'Profile'}</span>
                            </Link>
                        </>
                    )}
                    <Link href="/about" className={styles.navLink}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                        </svg>
                        <span>tentang</span>
                    </Link>
                    <Link href="/add-ads" className={styles.navLink}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                            <polyline points="17 2 12 7 7 2" />
                        </svg>
                        <span>add ads</span>
                    </Link>
                </div>

                <div className={styles.navActions}>
                    <button
                        className={styles.themeToggle}
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>

                    <WalletMultiButton className={styles.walletButton} />
                </div>
            </div>
        </nav>
    )
}
