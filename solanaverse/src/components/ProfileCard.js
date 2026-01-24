import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSocial } from '@/context/SocialContext'
import ProfileEdit from './ProfileEdit'
import styles from '@/styles/ProfileCard.module.css'

export default function ProfileCard({ address, showFollowButton = true }) {
    const { connected, publicKey } = useWallet()
    const { getProfile, toggleFollow, isFollowing, getUserPosts, shortenAddress, generateAvatar } = useSocial()
    const [showEditModal, setShowEditModal] = useState(false)

    const profile = getProfile(address)
    const posts = getUserPosts(address)
    const following = isFollowing(address)
    const isOwnProfile = connected && publicKey?.toString() === address

    return (
        <>
            <div className={styles.profileCard}>
                <div className={styles.coverImage}>
                    <div className={styles.coverGradient} />
                </div>

                <div className={styles.profileContent}>
                    <div className={styles.avatarContainer}>
                        {profile.customAvatar ? (
                            <img
                                src={profile.customAvatar}
                                alt="Avatar"
                                className={styles.avatarImage}
                            />
                        ) : (
                            <div
                                className={styles.avatar}
                                style={{ backgroundColor: generateAvatar(address) }}
                            >
                                {address.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className={styles.info}>
                        <h2 className={styles.displayName}>
                            {profile.displayName || shortenAddress(address)}
                        </h2>
                        <p className={styles.address}>
                            <span className={styles.addressIcon}>◆</span>
                            {shortenAddress(address)}
                        </p>
                        {profile.bio && (
                            <p className={styles.bio}>{profile.bio}</p>
                        )}
                    </div>

                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{posts.length}</span>
                            <span className={styles.statLabel}>Posts</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{profile.followers?.length || 0}</span>
                            <span className={styles.statLabel}>Followers</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{profile.following?.length || 0}</span>
                            <span className={styles.statLabel}>Following</span>
                        </div>
                    </div>

                    {isOwnProfile ? (
                        <button
                            className={styles.editBtn}
                            onClick={() => setShowEditModal(true)}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit Profile
                        </button>
                    ) : showFollowButton && connected && (
                        <button
                            className={`${styles.followBtn} ${following ? styles.following : ''}`}
                            onClick={() => toggleFollow(address)}
                        >
                            {following ? 'Following' : 'Follow'}
                        </button>
                    )}
                </div>
            </div>

            {showEditModal && (
                <ProfileEdit
                    onClose={() => setShowEditModal(false)}
                    onSave={() => setShowEditModal(false)}
                />
            )}
        </>
    )
}
