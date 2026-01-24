import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSocial } from '@/context/SocialContext'
import styles from '@/styles/CreatePost.module.css'

export default function CreatePost() {
    const { connected, publicKey } = useWallet()
    const { createPost, generateAvatar, getProfile } = useSocial()
    const [content, setContent] = useState('')
    const [isPosting, setIsPosting] = useState(false)

    const currentUserProfile = connected && publicKey ? getProfile(publicKey.toString()) : null

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!content.trim() || !connected) return

        setIsPosting(true)
        createPost(content)
        setContent('')
        setIsPosting(false)
    }

    if (!connected) return null

    return (
        <div className={styles.createPost}>
            {currentUserProfile?.customAvatar ? (
                <img
                    src={currentUserProfile.customAvatar}
                    alt="Avatar"
                    className={styles.avatarImage}
                />
            ) : (
                <div
                    className={styles.avatar}
                    style={{ backgroundColor: generateAvatar(publicKey?.toString()) }}
                >
                    {publicKey?.toString().slice(0, 2)}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <textarea
                    className={styles.textarea}
                    placeholder="What's happening in the metaverse? 🚀"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    maxLength={500}
                />

                <div className={styles.actions}>
                    <span className={styles.charCount}>
                        {content.length}/500
                    </span>
                    <button
                        type="submit"
                        className={styles.postButton}
                        disabled={!content.trim() || isPosting}
                    >
                        {isPosting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    )
}
