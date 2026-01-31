import Head from 'next/head'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import CreatePost from '@/components/CreatePost'
import Post from '@/components/Post'
import AdminPostPanel from '@/components/AdminPostPanel'
import AdCard from '@/components/AdCard'
import ReelsSection from '@/components/ReelsSection'
import { useSocial } from '@/context/SocialContext'
import styles from '@/styles/Feed.module.css'

export default function Feed() {
    const { connected } = useWallet()
    const { getFeedPosts, getActiveAds, loading } = useSocial()
    const router = useRouter()

    useEffect(() => {
        if (!connected) {
            router.push('/')
        }
    }, [connected, router])

    const posts = getFeedPosts()
    const activeAds = getActiveAds()

    if (!connected) {
        return null
    }

    return (
        <>
            <Head>
                <title>Feed - SolanaVerse</title>
                <meta name="description" content="Your SolanaVerse feed" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>

            <div className={styles.page}>
                <Navbar />

                <main className={styles.main}>
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarCard}>
                            <h3 className={styles.sidebarTitle}>Trending Topics</h3>
                            <ul className={styles.trendingList}>
                                <li>#SolanaVerse</li>
                                <li>#Web3Social</li>
                                <li>#PhantomWallet</li>
                                <li>#NFTCommunity</li>
                                <li>#DeFi</li>
                            </ul>
                        </div>

                        <div className={styles.sidebarCard}>
                            <h3 className={styles.sidebarTitle}>Quick Tips</h3>
                            <p>Connect your Phantom wallet to post, like, and interact with others in the metaverse!</p>
                        </div>
                    </aside>

                    <div className={styles.feedContainer}>
                        <div className={styles.feedHeader}>
                            <h1>Your Feed</h1>
                            <p>What's happening in the metaverse</p>
                        </div>

                        <CreatePost />

                        <div className={styles.posts}>
                            {loading ? (
                                <div className={styles.loading}>
                                    <div className={styles.spinner}></div>
                                    <p>Loading posts...</p>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className={styles.empty}>
                                    <div className={styles.emptyIcon}>🚀</div>
                                    <h3>No posts yet</h3>
                                    <p>Be the first to share something with the community!</p>
                                </div>
                            ) : (
                                posts.map(post => (
                                    <Post key={post.id} post={post} />
                                ))
                            )}
                        </div>
                    </div>

                    <aside className={styles.rightSidebar}>
                        <div className={styles.sidebarCard}>
                            <h3 className={styles.sidebarTitle}>Top Airdrop</h3>
                            <p className={styles.airdropDesc}>Sponsored ads and announcements</p>
                        </div>

                        {activeAds.length > 0 ? (
                            <div className={styles.adsSection}>
                                {activeAds.map(ad => (
                                    <AdCard key={ad.id} ad={ad} />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.sidebarCard}>
                                <p className={styles.emptyAds}>No ads available yet</p>
                            </div>
                        )}

                        <ReelsSection />
                    </aside>
                </main>
            </div>
        </>
    )
}
