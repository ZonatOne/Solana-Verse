import { useState } from 'react'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSocial } from '@/context/SocialContext'
import styles from '@/styles/Post.module.css'

export default function Post({ post }) {
    const { connected, publicKey } = useWallet()
    const { toggleLike, addComment, deletePost, deleteAnyPost, getProfile, shortenAddress, generateAvatar, isAdmin, ADMIN_WALLET } = useSocial()
    const [showComments, setShowComments] = useState(false)
    const [commentText, setCommentText] = useState('')

    const author = getProfile(post.author)
    const isLiked = connected && post.likes.includes(publicKey?.toString())
    const isAuthor = connected && publicKey?.toString() === post.author
    const isUserAdmin = connected && publicKey && isAdmin(publicKey.toString())
    const isPostByAdmin = post.author === ADMIN_WALLET

    const handleLike = () => {
        if (!connected) return
        toggleLike(post.id)
    }

    const handleComment = (e) => {
        e.preventDefault()
        if (!commentText.trim() || !connected) return
        addComment(post.id, commentText)
        setCommentText('')
    }

    const formatTime = (timestamp) => {
        const diff = Date.now() - timestamp
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (days > 0) return `${days}d ago`
        if (hours > 0) return `${hours}h ago`
        if (minutes > 0) return `${minutes}m ago`
        return 'Just now'
    }

    return (
        <article className={styles.post}>
            <div className={styles.header}>
                <Link href={`/profile/${post.author}`} className={styles.authorLink}>
                    {author.customAvatar ? (
                        <img
                            src={author.customAvatar}
                            alt="Avatar"
                            className={styles.avatarImage}
                        />
                    ) : (
                        <div
                            className={styles.avatar}
                            style={{ backgroundColor: generateAvatar(post.author) }}
                        >
                            {post.author.slice(0, 2)}
                        </div>
                    )}
                    <div className={styles.authorInfo}>
                        <span className={styles.displayName}>
                            {author.displayName || shortenAddress(post.author)}
                            {isPostByAdmin && (
                                <span className={styles.adminBadge}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    Admin
                                </span>
                            )}
                        </span>
                        <span className={styles.address}>
                            {shortenAddress(post.author)}
                        </span>
                    </div>
                </Link>
                <span className={styles.time}>{formatTime(post.createdAt)}</span>
            </div>

            <div className={styles.content}>
                <p>{post.content}</p>
                {post.image && (
                    <img src={post.image} alt="Post image" className={styles.image} />
                )}
                {post.video && (
                    <video src={post.video} controls className={styles.video} />
                )}
            </div>

            <div className={styles.actions}>
                <button
                    className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
                    onClick={handleLike}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span>{post.likes.length}</span>
                </button>

                <button
                    className={styles.actionBtn}
                    onClick={() => setShowComments(!showComments)}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    <span>{post.comments.length}</span>
                </button>

                <button className={styles.actionBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    <span>Share</span>
                </button>

                {(isAuthor || isUserAdmin) && (
                    <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => isUserAdmin && !isAuthor ? deleteAnyPost(post.id) : deletePost(post.id)}
                        title={isUserAdmin && !isAuthor ? "Delete as Admin" : "Delete"}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        {isUserAdmin && !isAuthor && <span className={styles.adminLabel}>Admin</span>}
                    </button>
                )}
            </div>

            {showComments && (
                <div className={styles.commentsSection}>
                    {connected && (
                        <form onSubmit={handleComment} className={styles.commentForm}>
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className={styles.commentInput}
                            />
                            <button type="submit" className={styles.commentSubmit}>
                                Send
                            </button>
                        </form>
                    )}

                    <div className={styles.comments}>
                        {post.comments.map(comment => {
                            const commentAuthor = getProfile(comment.author)
                            return (
                                <div key={comment.id} className={styles.comment}>
                                    <Link href={`/profile/${comment.author}`}>
                                        {commentAuthor.customAvatar ? (
                                            <img
                                                src={commentAuthor.customAvatar}
                                                alt="Avatar"
                                                className={styles.commentAvatarImage}
                                            />
                                        ) : (
                                            <div
                                                className={styles.commentAvatar}
                                                style={{ backgroundColor: generateAvatar(comment.author) }}
                                            >
                                                {comment.author.slice(0, 2)}
                                            </div>
                                        )}
                                    </Link>
                                    <div className={styles.commentContent}>
                                        <span className={styles.commentAuthor}>
                                            {commentAuthor.displayName || shortenAddress(comment.author)}
                                        </span>
                                        <p>{comment.content}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </article>
    )
}
