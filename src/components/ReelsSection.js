import { useSocial } from '@/context/SocialContext'
import styles from '@/styles/ReelsSection.module.css'

export default function ReelsSection() {
    const { getVideoPosts, getProfile, shortenAddress } = useSocial()

    const videoPosts = getVideoPosts()

    if (videoPosts.length === 0) {
        return (
            <div className={styles.reelsSection}>
                <h3 className={styles.title}>Reels Video</h3>
                <p className={styles.emptyMessage}>No video reels yet</p>
            </div>
        )
    }

    return (
        <div className={styles.reelsSection}>
            <h3 className={styles.title}>Reels Video</h3>
            <div className={styles.reelsGrid}>
                {videoPosts.slice(0, 6).map(post => {
                    const author = getProfile(post.author)
                    return (
                        <div key={post.id} className={styles.reelItem}>
                            <video
                                src={post.video}
                                className={styles.reelVideo}
                                muted
                                loop
                                onMouseEnter={(e) => e.target.play()}
                                onMouseLeave={(e) => {
                                    e.target.pause()
                                    e.target.currentTime = 0
                                }}
                            />
                            <div className={styles.reelOverlay}>
                                <span className={styles.reelAuthor}>
                                    {author.displayName || shortenAddress(post.author)}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
