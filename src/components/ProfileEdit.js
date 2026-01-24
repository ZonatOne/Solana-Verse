import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSocial } from '@/context/SocialContext'
import styles from '@/styles/ProfileEdit.module.css'

export default function ProfileEdit({ onClose, onSave }) {
    const { publicKey } = useWallet()
    const { currentUser, updateProfile } = useSocial()

    const [displayName, setDisplayName] = useState(currentUser?.displayName || '')
    const [bio, setBio] = useState(currentUser?.bio || '')
    const [avatar, setAvatar] = useState(currentUser?.customAvatar || '')
    const [loading, setLoading] = useState(false)

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB')
                return
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file')
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatar(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = () => {
        if (!publicKey) return

        setLoading(true)

        updateProfile({
            displayName: displayName.trim() || undefined,
            bio: bio.trim() || undefined,
            customAvatar: avatar || undefined
        })

        setLoading(false)

        if (onSave) {
            onSave()
        }

        if (onClose) {
            onClose()
        }
    }

    const handleCancel = () => {
        if (onClose) {
            onClose()
        }
    }

    return (
        <div className={styles.overlay} onClick={handleCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Edit Profile</h2>
                    <button onClick={handleCancel} className={styles.closeBtn}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarPreview}>
                            {avatar ? (
                                <img src={avatar} alt="Avatar" />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {publicKey?.toString().slice(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className={styles.avatarActions}>
                            <label htmlFor="avatar-upload" className={styles.uploadBtn}>
                                📷 Upload Avatar
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            {avatar && (
                                <button
                                    onClick={() => setAvatar('')}
                                    className={styles.removeBtn}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <p className={styles.avatarHint}>Max 2MB • JPG, PNG, GIF</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="displayName">Display Name</label>
                        <input
                            type="text"
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Enter your display name"
                            maxLength={50}
                            className={styles.input}
                        />
                        <span className={styles.charCount}>{displayName.length}/50</span>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            maxLength={200}
                            rows={4}
                            className={styles.textarea}
                        />
                        <span className={styles.charCount}>{bio.length}/200</span>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button
                        onClick={handleCancel}
                        className={styles.cancelBtn}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className={styles.saveBtn}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}
