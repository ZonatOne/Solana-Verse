import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSocial } from '@/context/SocialContext'
import styles from '@/styles/CreatePost.module.css'

export default function CreatePost() {
    const { connected, publicKey } = useWallet()
    const { createPost, generateAvatar, getProfile } = useSocial()
    const [content, setContent] = useState('')
    const [image, setImage] = useState('')
    const [isPosting, setIsPosting] = useState(false)

    const currentUserProfile = connected && publicKey ? getProfile(publicKey.toString()) : null

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Allow post if either content OR image exists
        if ((!content.trim() && !image) || !connected) return

        setIsPosting(true)
        createPost(content, image)
        setContent('')
        setImage('')
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

                {image && (
                    <div className={styles.imagePreview}>
                        <img src={image} alt="Preview" />
                        <button
                            type="button"
                            onClick={() => setImage('')}
                            className={styles.removeImage}
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className={styles.actions}>
                    <div className={styles.leftActions}>
                        <label htmlFor="imageUpload" className={styles.imageButton}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <span>Image</span>
                        </label>
                        <input
                            type="file"
                            id="imageUpload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={styles.fileInput}
                        />
                        <span className={styles.charCount}>
                            {content.length}/500
                        </span>
                    </div>
                    <button
                        type="submit"
                        className={styles.postButton}
                        disabled={(!content.trim() && !image) || isPosting}
                    >
                        {isPosting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    )
}
