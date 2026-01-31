import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSocial } from '@/context/SocialContext'
import styles from '@/styles/CreatePost.module.css'

export default function CreatePost() {
    const { connected, publicKey } = useWallet()
    const { createPost, generateAvatar, getProfile } = useSocial()
    const [content, setContent] = useState('')
    const [image, setImage] = useState('')
    const [video, setVideo] = useState('')
    const [isPosting, setIsPosting] = useState(false)

    const currentUserProfile = connected && publicKey ? getProfile(publicKey.toString()) : null

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result)
                setVideo('') // Clear video if image is selected
            }
            reader.readAsDataURL(file)
        }
    }

    const handleVideoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Limit video size to 5MB to avoid localStorage quota issues
            const maxSize = 5 * 1024 * 1024 // 5MB
            if (file.size > maxSize) {
                alert('Video size must be less than 5MB. Please choose a smaller video.')
                e.target.value = ''
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setVideo(reader.result)
                setImage('') // Clear image if video is selected
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Allow post if content OR image OR video exists
        if ((!content.trim() && !image && !video) || !connected) return

        setIsPosting(true)
        createPost(content, image || null, video || null)
        setContent('')
        setImage('')
        setVideo('')
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

                {video && (
                    <div className={styles.videoPreview}>
                        <video src={video} controls />
                        <button
                            type="button"
                            onClick={() => setVideo('')}
                            className={styles.removeVideo}
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

                        <label htmlFor="videoUpload" className={styles.videoButton}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </svg>
                            <span>Video</span>
                        </label>
                        <input
                            type="file"
                            id="videoUpload"
                            accept="video/mp4,video/webm,video/mov"
                            onChange={handleVideoUpload}
                            className={styles.fileInput}
                        />

                        <span className={styles.charCount}>
                            {content.length}/500
                        </span>
                    </div>
                    <button
                        type="submit"
                        className={styles.postButton}
                        disabled={(!content.trim() && !image && !video) || isPosting}
                    >
                        {isPosting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    )
}
