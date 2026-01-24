import { useSocial } from '@/context/SocialContext'
import Link from 'next/link'
import styles from '@/styles/AdminPostPanel.module.css'

export default function AdminPostPanel() {
    const { getAdminPosts, shortenAddress, generateAvatar, ADMIN_WALLET } = useSocial()
    const adminPosts = getAdminPosts()

    if (adminPosts.length === 0) {
        return null
    }

    const formatTime = (timestamp) => {
        const diff = Date.now() - timestamp
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (days > 0) return `${days}d ago`
        if (hours > 0) return `${hours}h ago`
        if (minutes > 0) return `${minutes}m ago`
        return 'Just now'
    }

    return (
        <aside className={styles.panel}>
            <div className={styles.header}>
                <div className={styles.badge}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>Admin Posts</span>
                </div>
            </div>

            <div className={styles.posts}>
                {adminPosts.slice(0, 5).map(post => (
                    <Link href="/feed" key={post.id} className={styles.postCard}>
                        <div className={styles.postHeader}>
                            <div
                                className={styles.avatar}
                                style={{ backgroundColor: generateAvatar(ADMIN_WALLET) }}
                            >
                                {ADMIN_WALLET.slice(0, 2)}
                            </div>
                            <div className={styles.info}>
                                <span className={styles.admin}>Admin</span>
                                <span className={styles.time}>{formatTime(post.createdAt)}</span>
                            </div>
                        </div>
                        <p className={styles.content}>
                            {post.content.length > 100
                                ? post.content.slice(0, 100) + '...'
                                : post.content}
                        </p>
                        {post.image && (
                            <div className={styles.imagePreview}>
                                <img src={post.image} alt="Post preview" />
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            {adminPosts.length > 5 && (
                <div className={styles.footer}>
                    <Link href="/feed" className={styles.viewMore}>
                        View all {adminPosts.length} posts →
                    </Link>
                </div>
            )}
        </aside>
    )
}
