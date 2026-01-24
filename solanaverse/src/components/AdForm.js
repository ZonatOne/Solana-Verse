import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useSocial } from '@/context/SocialContext'
import styles from '@/styles/AdForm.module.css'

export default function AdForm({ onSuccess }) {
    const { publicKey, sendTransaction } = useWallet()
    const { connection } = useConnection()
    const { createAd, ADMIN_WALLET, isAdmin } = useSocial()

    const [content, setContent] = useState('')
    const [image, setImage] = useState('')
    const [targetUrl, setTargetUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Calculate SOL amount for $100 (simplified - in production, fetch real-time price)
    // Assuming 1 SOL = $100 for demo purposes
    const AD_PRICE_SOL = 1.0
    const AD_PRICE_USD = 100

    // Check if current user is admin
    const isUserAdmin = publicKey && isAdmin(publicKey.toString())

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
        setError('')
        setLoading(true)

        try {
            if (!publicKey) {
                throw new Error('Please connect your wallet first')
            }

            if (!content.trim()) {
                throw new Error('Please enter ad content')
            }

            // Admin can post ads for FREE, regular users must pay
            if (!isUserAdmin) {
                // Create payment transaction for non-admin users
                const transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey,
                        toPubkey: new PublicKey(ADMIN_WALLET),
                        lamports: AD_PRICE_SOL * LAMPORTS_PER_SOL,
                    })
                )

                // Send transaction
                const signature = await sendTransaction(transaction, connection)

                // Wait for confirmation
                await connection.confirmTransaction(signature, 'confirmed')
            }

            // Create ad (admin posts for free, users after payment)
            const ad = createAd(content, image, targetUrl)

            if (ad) {
                setSuccess(true)
                setContent('')
                setImage('')
                setTargetUrl('')

                if (onSuccess) {
                    onSuccess(ad)
                }

                setTimeout(() => {
                    setSuccess(false)
                }, 5000)
            }
        } catch (err) {
            console.error('Error creating ad:', err)
            setError(err.message || 'Failed to create advertisement')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.priceInfo}>
                <div className={styles.priceCard}>
                    <h3>Advertisement Pricing</h3>
                    {isUserAdmin ? (
                        <>
                            <div className={styles.price}>
                                <span className={styles.amount}>FREE</span>
                                <span className={styles.usd}>Admin Privilege</span>
                            </div>
                            <p className={styles.duration}>✨ Post unlimited ads for free</p>
                        </>
                    ) : (
                        <>
                            <div className={styles.price}>
                                <span className={styles.amount}>{AD_PRICE_SOL} SOL</span>
                                <span className={styles.usd}>≈ ${AD_PRICE_USD} USD</span>
                            </div>
                            <p className={styles.duration}>30 days active period</p>
                        </>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="content">Ad Content *</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your advertisement message..."
                        maxLength={500}
                        rows={4}
                        required
                    />
                    <span className={styles.charCount}>{content.length}/500</span>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="image">Ad Image (Optional)</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className={styles.fileInput}
                    />
                    {image && (
                        <div className={styles.imagePreview}>
                            <img src={image} alt="Preview" />
                            <button
                                type="button"
                                onClick={() => setImage('')}
                                className={styles.removeImage}
                            >
                                ✕ Remove
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="targetUrl">Target URL (Optional)</label>
                    <input
                        type="url"
                        id="targetUrl"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="https://example.com"
                        className={styles.input}
                    />
                    <small>Where users will be redirected when clicking your ad</small>
                </div>

                {error && (
                    <div className={styles.error}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        {error}
                    </div>
                )}

                {success && (
                    <div className={styles.success}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        {isUserAdmin
                            ? 'Ad posted successfully! It will appear immediately.'
                            : 'Ad submitted successfully! Waiting for admin approval.'}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !publicKey}
                    className={styles.submitBtn}
                >
                    {loading ? (
                        <>
                            <div className={styles.spinner}></div>
                            {isUserAdmin ? 'Posting Ad...' : 'Processing Payment...'}
                        </>
                    ) : (
                        <>
                            {isUserAdmin
                                ? '✨ Post Ad (FREE - Admin)'
                                : `💳 Pay ${AD_PRICE_SOL} SOL & Submit Ad`}
                        </>
                    )}
                </button>

                <p className={styles.notice}>
                    {isUserAdmin
                        ? '✨ As an admin, you can post ads for free without approval.'
                        : '⚠️ Your ad will be reviewed by admin before going live. Payment is non-refundable once submitted.'}
                </p>
            </form>
        </div>
    )
}
