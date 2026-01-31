import { useState, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSocial } from '@/context/SocialContext'
import styles from '@/styles/CreatePost.module.css'

// URL upload ke hosting Rumahweb
const UPLOAD_API_URL = 'https://witusol.com/api/upload.php'

export default function CreatePost() {
    const { connected, publicKey } = useWallet()
    const { createPost, generateAvatar, getProfile } = useSocial()
    const [content, setContent] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState('')
    const [videoFile, setVideoFile] = useState(null)
    const [videoPreview, setVideoPreview] = useState('')
    const [isPosting, setIsPosting] = useState(false)
    const [uploadProgress, setUploadProgress] = useState('')

    const imageInputRef = useRef(null)
    const videoInputRef = useRef(null)

    const currentUserProfile = connected && publicKey ? getProfile(publicKey.toString()) : null

    // Handle image selection
    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
            setVideoFile(null)
            setVideoPreview('')
        }
    }

    // Handle video selection
    const handleVideoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setVideoFile(file)
            setVideoPreview(URL.createObjectURL(file))
            setImageFile(null)
            setImagePreview('')
        }
    }

    // Upload file to Rumahweb hosting via PHP script
    const uploadFile = async (file) => {
        if (!file) return null

        try {
            const formData = new FormData()
            formData.append('file', file)

            setUploadProgress('Uploading...')

            const response = await fetch(UPLOAD_API_URL, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const data = await response.json()

            if (data.success && data.url) {
                return data.url
            } else {
                throw new Error(data.error || 'Upload failed')
            }
        } catch (error) {
            console.error('Error uploading file:', error)
            throw error
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if ((!content.trim() && !imageFile && !videoFile) || !connected) return

        setIsPosting(true)
        try {
            let imageUrl = null
            let videoUrl = null

            // Upload files to Rumahweb hosting
            if (imageFile) {
                imageUrl = await uploadFile(imageFile)
            }
            if (videoFile) {
                videoUrl = await uploadFile(videoFile)
            }

            setUploadProgress('Creating post...')
            createPost(content, imageUrl, videoUrl) // Sync - no await needed!

            // Clear form
            setContent('')
            setImageFile(null)
            setImagePreview('')
            setVideoFile(null)
            setVideoPreview('')
            setUploadProgress('')

            // Reset file inputs
            if (imageInputRef.current) imageInputRef.current.value = ''
            if (videoInputRef.current) videoInputRef.current.value = ''
        } catch (error) {
            console.error('Error creating post:', error)
            alert('Failed to create post. Please try again.')
        } finally {
            setIsPosting(false)
            setUploadProgress('')
        }
    }

    const clearImage = () => {
        setImageFile(null)
        setImagePreview('')
        if (imageInputRef.current) imageInputRef.current.value = ''
    }

    const clearVideo = () => {
        setVideoFile(null)
        setVideoPreview('')
        if (videoInputRef.current) videoInputRef.current.value = ''
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

                {imagePreview && (
                    <div className={styles.imagePreview}>
                        <img src={imagePreview} alt="Preview" />
                        <button
                            type="button"
                            onClick={clearImage}
                            className={styles.removeImage}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {videoPreview && (
                    <div className={styles.videoPreview}>
                        <video src={videoPreview} controls />
                        <button
                            type="button"
                            onClick={clearVideo}
                            className={styles.removeVideo}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {uploadProgress && (
                    <div className={styles.uploadProgress}>
                        <span className={styles.spinner}></span>
                        {uploadProgress}
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
                            ref={imageInputRef}
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
                            ref={videoInputRef}
                            accept="video/*"
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
                        disabled={(!content.trim() && !imageFile && !videoFile) || isPosting}
                    >
                        {isPosting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    )
}
