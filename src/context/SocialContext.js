import { createContext, useContext, useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

const SocialContext = createContext()

// Admin wallet address with full privileges
const ADMIN_WALLET = '9i7m4nS59y2X4EQDegGbCZaSQV5TCp35XLfKWQQMzHrW'

// Ad duration in milliseconds (30 days)
const AD_DURATION = 30 * 24 * 60 * 60 * 1000

// Helper to generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// Helper to shorten wallet address
export const shortenAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
}

// Generate avatar from wallet address
export const generateAvatar = (address) => {
    if (!address) return '#7B68EE'
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9']
    const index = parseInt(address.slice(-2), 16) % colors.length
    return colors[index]
}

export function SocialProvider({ children }) {
    const { publicKey, connected } = useWallet()
    const [posts, setPosts] = useState([])
    const [users, setUsers] = useState({})
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(true)

    // Load data from localStorage on mount
    useEffect(() => {
        const savedPosts = localStorage.getItem('solanaverse-posts')
        const savedUsers = localStorage.getItem('solanaverse-users')
        const savedAds = localStorage.getItem('solanaverse-ads')

        if (savedPosts) {
            setPosts(JSON.parse(savedPosts))
        }
        if (savedUsers) {
            setUsers(JSON.parse(savedUsers))
        }
        if (savedAds) {
            setAds(JSON.parse(savedAds))
        }
        setLoading(false)
    }, [])

    // Save data to localStorage whenever it changes
    useEffect(() => {
        if (!loading) {
            try {
                localStorage.setItem('solanaverse-posts', JSON.stringify(posts))
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    console.warn('localStorage quota exceeded for posts. Consider reducing video sizes.')
                }
            }
        }
    }, [posts, loading])

    useEffect(() => {
        if (!loading) {
            localStorage.setItem('solanaverse-users', JSON.stringify(users))
        }
    }, [users, loading])

    useEffect(() => {
        if (!loading) {
            localStorage.setItem('solanaverse-ads', JSON.stringify(ads))
        }
    }, [ads, loading])

    // Create or update user profile
    const updateProfile = (profileData) => {
        if (!publicKey) return
        const address = publicKey.toString()

        setUsers(prev => ({
            ...prev,
            [address]: {
                ...prev[address],
                address,
                ...profileData,
                updatedAt: Date.now()
            }
        }))
    }

    // Get user profile
    const getProfile = (address) => {
        return users[address] || {
            address,
            displayName: shortenAddress(address),
            bio: '',
            avatar: generateAvatar(address),
            followers: [],
            following: [],
            createdAt: Date.now()
        }
    }

    // Create a new post
    const createPost = (content, image = null, video = null) => {
        if (!publicKey || (!content.trim() && !image && !video)) return null

        const address = publicKey.toString()
        const newPost = {
            id: generateId(),
            author: address,
            content: content.trim(),
            image,
            video,
            likes: [],
            comments: [],
            createdAt: Date.now()
        }

        setPosts(prev => [newPost, ...prev])
        return newPost
    }

    // Delete a post
    const deletePost = (postId) => {
        if (!publicKey) return
        const address = publicKey.toString()

        setPosts(prev => prev.filter(post =>
            !(post.id === postId && post.author === address)
        ))
    }

    // Like/unlike a post
    const toggleLike = (postId) => {
        if (!publicKey) return
        const address = publicKey.toString()

        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                const hasLiked = post.likes.includes(address)
                return {
                    ...post,
                    likes: hasLiked
                        ? post.likes.filter(a => a !== address)
                        : [...post.likes, address]
                }
            }
            return post
        }))
    }

    // Add a comment
    const addComment = (postId, content) => {
        if (!publicKey || !content.trim()) return
        const address = publicKey.toString()

        const newComment = {
            id: generateId(),
            author: address,
            content: content.trim(),
            createdAt: Date.now()
        }

        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: [...post.comments, newComment]
                }
            }
            return post
        }))
    }

    // Follow/unfollow a user
    const toggleFollow = (targetAddress) => {
        if (!publicKey || publicKey.toString() === targetAddress) return
        const myAddress = publicKey.toString()

        setUsers(prev => {
            const myProfile = prev[myAddress] || getProfile(myAddress)
            const targetProfile = prev[targetAddress] || getProfile(targetAddress)

            const isFollowing = myProfile.following?.includes(targetAddress)

            return {
                ...prev,
                [myAddress]: {
                    ...myProfile,
                    following: isFollowing
                        ? (myProfile.following || []).filter(a => a !== targetAddress)
                        : [...(myProfile.following || []), targetAddress]
                },
                [targetAddress]: {
                    ...targetProfile,
                    followers: isFollowing
                        ? (targetProfile.followers || []).filter(a => a !== myAddress)
                        : [...(targetProfile.followers || []), myAddress]
                }
            }
        })
    }

    // Check if current user follows target
    const isFollowing = (targetAddress) => {
        if (!publicKey) return false
        const myAddress = publicKey.toString()
        const myProfile = users[myAddress]
        return myProfile?.following?.includes(targetAddress) || false
    }

    // Get posts by user
    const getUserPosts = (address) => {
        return posts.filter(post => post.author === address)
    }

    // Get feed posts (all posts, sorted by date)
    const getFeedPosts = () => {
        return [...posts].sort((a, b) => b.createdAt - a.createdAt)
    }

    // Get video posts only (for reels)
    const getVideoPosts = () => {
        return posts.filter(post => post.video)
            .sort((a, b) => b.createdAt - a.createdAt)
    }

    // Check if address is admin
    const isAdmin = (address) => {
        return address === ADMIN_WALLET
    }

    // Delete any post (admin only)
    const deleteAnyPost = (postId) => {
        if (!publicKey || !isAdmin(publicKey.toString())) return
        setPosts(prev => prev.filter(post => post.id !== postId))
    }

    // Get admin posts only
    const getAdminPosts = () => {
        return posts.filter(post => post.author === ADMIN_WALLET)
            .sort((a, b) => b.createdAt - a.createdAt)
    }

    // Create advertisement (paid)
    const createAd = (title, content, image, targetUrl = null, twitterLink = null, telegramLink = null, discordLink = null) => {
        if (!publicKey || !content.trim()) return null

        const address = publicKey.toString()

        // Auto-approve ads from admin, others need approval
        const isAdminAd = isAdmin(address)

        const newAd = {
            id: generateId(),
            author: address,
            title: title?.trim() || null,
            content: content.trim(),
            image,
            targetUrl,
            twitterLink,
            telegramLink,
            discordLink,
            status: isAdminAd ? 'approved' : 'pending', // Admin ads auto-approved
            createdAt: Date.now(),
            expiresAt: Date.now() + AD_DURATION,
            clicks: 0
        }

        setAds(prev => [newAd, ...prev])
        return newAd
    }

    // Approve ad (admin only)
    const approveAd = (adId) => {
        if (!publicKey || !isAdmin(publicKey.toString())) return
        setAds(prev => prev.map(ad =>
            ad.id === adId ? { ...ad, status: 'approved' } : ad
        ))
    }

    // Reject ad (admin only)
    const rejectAd = (adId) => {
        if (!publicKey || !isAdmin(publicKey.toString())) return
        setAds(prev => prev.map(ad =>
            ad.id === adId ? { ...ad, status: 'rejected' } : ad
        ))
    }

    // Delete ad
    const deleteAd = (adId) => {
        if (!publicKey) return
        const address = publicKey.toString()

        setAds(prev => prev.filter(ad => {
            // Admin can delete any ad, users can only delete their own
            if (isAdmin(address)) return ad.id !== adId
            return !(ad.id === adId && ad.author === address)
        }))
    }

    // Get active ads (approved and not expired)
    const getActiveAds = () => {
        const now = Date.now()
        return ads.filter(ad =>
            ad.status === 'approved' && ad.expiresAt > now
        ).sort((a, b) => b.createdAt - a.createdAt)
    }

    // Get pending ads (admin only)
    const getPendingAds = () => {
        if (!publicKey || !isAdmin(publicKey.toString())) return []
        return ads.filter(ad => ad.status === 'pending')
            .sort((a, b) => b.createdAt - a.createdAt)
    }

    // Track ad click
    const trackAdClick = (adId) => {
        setAds(prev => prev.map(ad =>
            ad.id === adId ? { ...ad, clicks: ad.clicks + 1 } : ad
        ))
    }

    // Get user's ads
    const getUserAds = (address) => {
        return ads.filter(ad => ad.author === address)
            .sort((a, b) => b.createdAt - a.createdAt)
    }

    return (
        <SocialContext.Provider value={{
            posts,
            users,
            ads,
            loading,
            currentUser: publicKey ? getProfile(publicKey.toString()) : null,
            updateProfile,
            getProfile,
            createPost,
            deletePost,
            toggleLike,
            addComment,
            toggleFollow,
            isFollowing,
            getUserPosts,
            getFeedPosts,
            getVideoPosts,
            shortenAddress,
            generateAvatar,
            // Admin functions
            isAdmin,
            deleteAnyPost,
            getAdminPosts,
            // Ads functions
            createAd,
            approveAd,
            rejectAd,
            deleteAd,
            getActiveAds,
            getPendingAds,
            trackAdClick,
            getUserAds,
            ADMIN_WALLET
        }}>
            {children}
        </SocialContext.Provider>
    )
}

export const useSocial = () => useContext(SocialContext)
