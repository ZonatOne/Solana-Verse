import { useSocial } from '@/context/SocialContext'
import { useWallet } from '@solana/wallet-adapter-react'
import styles from '@/styles/AdCard.module.css'

export default function AdCard({ ad }) {
    const { publicKey } = useWallet()
    const { trackAdClick, approveAd, rejectAd, deleteAd, isAdmin, shortenAddress } = useSocial()

    const isUserAdmin = publicKey && isAdmin(publicKey.toString())
    const daysRemaining = Math.ceil((ad.expiresAt - Date.now()) / (1000 * 60 * 60 * 24))

    const handleClick = () => {
        trackAdClick(ad.id)
        if (ad.targetUrl) {
            window.open(ad.targetUrl, '_blank')
        }
    }

    const handleApprove = (e) => {
        e.stopPropagation()
        approveAd(ad.id)
    }

    const handleReject = (e) => {
        e.stopPropagation()
        rejectAd(ad.id)
    }

    const handleDelete = (e) => {
        e.stopPropagation()
        if (confirm('Delete this ad?')) {
            deleteAd(ad.id)
        }
    }

    return (
        <div className={styles.adCard} onClick={ad.status === 'approved' ? handleClick : undefined}>
            <div className={styles.badge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>Sponsored</span>
            </div>

            {ad.image && (
                <div className={styles.imageContainer}>
                    <img src={ad.image} alt="Advertisement" />
                </div>
            )}

            <div className={styles.content}>
                <p>{ad.content}</p>
            </div>

            <div className={styles.footer}>
                <span className={styles.author}>by {shortenAddress(ad.author)}</span>
                {ad.status === 'approved' && (
                    <span className={styles.expires}>{daysRemaining}d left</span>
                )}
            </div>

            {ad.status === 'pending' && (
                <div className={styles.pendingBadge}>Pending Approval</div>
            )}

            {isUserAdmin && (
                <div className={styles.adminControls}>
                    {ad.status === 'pending' && (
                        <>
                            <button onClick={handleApprove} className={styles.approveBtn}>
                                ✓ Approve
                            </button>
                            <button onClick={handleReject} className={styles.rejectBtn}>
                                ✕ Reject
                            </button>
                        </>
                    )}
                    <button onClick={handleDelete} className={styles.deleteBtn}>
                        🗑️ Delete
                    </button>
                </div>
            )}

            {ad.status === 'approved' && (
                <div className={styles.stats}>
                    <span>{ad.clicks} clicks</span>
                </div>
            )}
        </div>
    )
}
