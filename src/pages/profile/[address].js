import Head from 'next/head'
import { useRouter } from 'next/router'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import ProfileCard from '@/components/ProfileCard'
import Post from '@/components/Post'
import { useSocial } from '@/context/SocialContext'
import styles from '@/styles/Profile.module.css'

export default function Profile() {
    const router = useRouter()
    const { address } = router.query
    const { connected, publicKey } = useWallet()
    const { getUserPosts, getProfile, updateProfile, shortenAddress } = useSocial()
    const [isEditing, setIsEditing] = useState(false)
    const [displayName, setDisplayName] = useState('')
    const [bio, setBio] = useState('')

    const profile = address ? getProfile(address) : null
    const posts = address ? getUserPosts(address) : []
    const isOwnProfile = connected && publicKey?.toString() === address

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.displayName || '')
            setBio(profile.bio || '')
        }
    }, [profile])

    const handleSaveProfile = () => {
        updateProfile({ displayName, bio })
        setIsEditing(false)
    }

    if (!address) {
        return null
    }

    return (
        <>
            <Head>
                <title>{profile?.displayName || shortenAddress(address)} - SolanaVerse</title>
                <meta name="description" content={`View ${shortenAddress(address)}'s profile on SolanaVerse`} />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>

            <div className={styles.page}>
                <Navbar />

                <main className={styles.main}>
                    <ProfileCard address={address} />

                    {isOwnProfile && (
                        <div className={styles.editSection}>
                            {isEditing ? (
                                <div className={styles.editForm}>
                                    <h3>Edit Profile</h3>
                                    <input
                                        type="text"
                                        placeholder="Display Name"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className={styles.input}
                                    />
                                    <textarea
                                        placeholder="Bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className={styles.textarea}
                                        rows={3}
                                    />
                                    <div className={styles.editActions}>
                                        <button onClick={handleSaveProfile} className={styles.saveBtn}>
                                            Save Changes
                                        </button>
                                        <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
                                    ✏️ Edit Profile
                                </button>
                            )}
                        </div>
                    )}

                    <div className={styles.postsSection}>
                        <h2 className={styles.sectionTitle}>Posts</h2>

                        {posts.length === 0 ? (
                            <div className={styles.empty}>
                                <p>No posts yet</p>
                            </div>
                        ) : (
                            <div className={styles.posts}>
                                {posts.map(post => (
                                    <Post key={post.id} post={post} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}
