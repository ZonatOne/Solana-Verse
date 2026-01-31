import { useState, useRef, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSocial } from '@/context/SocialContext'
import styles from '@/styles/SponsorCard.module.css'

// URL untuk upload gambar ke Rumahweb
const UPLOAD_API_URL = 'https://witusol.com/api/upload.php'

export default function SponsorSection() {
    const { publicKey, connected } = useWallet()
    const { isAdmin } = useSocial()
    const [sponsors, setSponsors] = useState([])
    const [isLoaded, setIsLoaded] = useState(false) // Prevent saving before load
    const [editingId, setEditingId] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [formData, setFormData] = useState({ title: '', link: '', site: '', image: '' })
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    const isAdminUser = connected && publicKey && isAdmin(publicKey.toString())

    // Load sponsors from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('solanaverse-sponsors')
            if (saved) {
                const parsed = JSON.parse(saved)
                if (parsed && parsed.length > 0) {
                    setSponsors(parsed)
                } else {
                    // Set defaults if empty
                    setSponsors(getDefaultSponsors())
                }
            } else {
                // Default sponsors
                setSponsors(getDefaultSponsors())
            }
        } catch (e) {
            console.error('Error loading sponsors:', e)
            setSponsors(getDefaultSponsors())
        }
        setIsLoaded(true) // Mark as loaded AFTER setting sponsors
    }, [])

    // Default sponsors
    const getDefaultSponsors = () => [
        {
            id: '1',
            title: 'Gratis Ongkir Se-Indonesia',
            image: 'https://witusol.com/api/uploads/sponsor1.jpg',
            link: 'https://sakura-533.my.id',
            site: 'sakura-533.my.id'
        },
        {
            id: '2',
            title: 'Airwallex Now on Desktop',
            image: 'https://witusol.com/api/uploads/sponsor2.jpg',
            link: 'https://airwallex.com',
            site: 'airwallex.com'
        }
    ]

    // Save sponsors to localStorage - ONLY after initial load
    useEffect(() => {
        if (isLoaded && sponsors.length > 0) {
            try {
                localStorage.setItem('solanaverse-sponsors', JSON.stringify(sponsors))
            } catch (e) {
                console.error('Error saving sponsors:', e)
            }
        }
    }, [sponsors, isLoaded])

    // Upload image to Rumahweb
    const uploadImage = async (file) => {
        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch(UPLOAD_API_URL, {
                method: 'POST',
                body: formData
            })

            const data = await response.json()
            if (data.success && data.url) {
                return data.url
            }
            throw new Error(data.error || 'Upload failed')
        } catch (error) {
            console.error('Upload error:', error)
            alert('Failed to upload image')
            return null
        }
    }

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const url = await uploadImage(file)
        if (url) {
            setFormData(prev => ({ ...prev, image: url }))
        }
        setUploading(false)
    }

    // Add new sponsor
    const handleAdd = () => {
        if (!formData.title || !formData.link) {
            alert('Please fill title and link')
            return
        }

        const newSponsor = {
            id: Date.now().toString(),
            title: formData.title,
            link: formData.link,
            site: formData.site || new URL(formData.link).hostname,
            image: formData.image || 'https://via.placeholder.com/80'
        }

        setSponsors(prev => [...prev, newSponsor])
        setFormData({ title: '', link: '', site: '', image: '' })
        setShowAddForm(false)
    }

    // Edit sponsor
    const handleEdit = (sponsor) => {
        setEditingId(sponsor.id)
        setFormData({
            title: sponsor.title,
            link: sponsor.link,
            site: sponsor.site,
            image: sponsor.image
        })
    }

    // Save edit
    const handleSaveEdit = (id) => {
        setSponsors(prev => prev.map(s =>
            s.id === id ? { ...s, ...formData } : s
        ))
        setEditingId(null)
        setFormData({ title: '', link: '', site: '', image: '' })
    }

    // Delete sponsor
    const handleDelete = (id) => {
        if (confirm('Delete this sponsor?')) {
            setSponsors(prev => prev.filter(s => s.id !== id))
        }
    }

    return (
        <div className={styles.sponsorSection}>
            <h3 className={styles.title}>Bersponsor</h3>

            <div className={styles.sponsorList}>
                {sponsors.map(sponsor => (
                    <div key={sponsor.id} className={styles.sponsorCard}>
                        {editingId === sponsor.id ? (
                            // Edit Form
                            <div className={styles.editForm}>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={formData.title}
                                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className={styles.input}
                                />
                                <input
                                    type="text"
                                    placeholder="Link URL"
                                    value={formData.link}
                                    onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                    className={styles.input}
                                />
                                <input
                                    type="text"
                                    placeholder="Site name"
                                    value={formData.site}
                                    onChange={e => setFormData(prev => ({ ...prev, site: e.target.value }))}
                                    className={styles.input}
                                />
                                <div className={styles.imageUpload}>
                                    {formData.image && <img src={formData.image} alt="" className={styles.previewImg} />}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        ref={fileInputRef}
                                        className={styles.fileInput}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className={styles.uploadBtn}
                                        disabled={uploading}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                    </button>
                                </div>
                                <div className={styles.editActions}>
                                    <button onClick={() => handleSaveEdit(sponsor.id)} className={styles.saveBtn}>Save</button>
                                    <button onClick={() => setEditingId(null)} className={styles.cancelBtn}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            // Display Mode
                            <>
                                <a href={sponsor.link} target="_blank" rel="noopener noreferrer" className={styles.sponsorLink}>
                                    <div className={styles.imageWrapper}>
                                        <img src={sponsor.image} alt={sponsor.title} className={styles.image} />
                                    </div>
                                    <div className={styles.info}>
                                        <h4 className={styles.sponsorTitle}>{sponsor.title}</h4>
                                        <span className={styles.site}>{sponsor.site}</span>
                                    </div>
                                </a>
                                {isAdminUser && (
                                    <div className={styles.adminActions}>
                                        <button onClick={() => handleEdit(sponsor)} className={styles.editBtn}>✏️</button>
                                        <button onClick={() => handleDelete(sponsor.id)} className={styles.deleteBtn}>🗑️</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Add New Sponsor (Admin Only) */}
            {isAdminUser && (
                <>
                    {showAddForm ? (
                        <div className={styles.addForm}>
                            <input
                                type="text"
                                placeholder="Title"
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Link URL"
                                value={formData.link}
                                onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                className={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Site name (optional)"
                                value={formData.site}
                                onChange={e => setFormData(prev => ({ ...prev, site: e.target.value }))}
                                className={styles.input}
                            />
                            <div className={styles.imageUpload}>
                                {formData.image && <img src={formData.image} alt="" className={styles.previewImg} />}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className={styles.fileInput}
                                />
                                <button
                                    type="button"
                                    onClick={() => document.querySelector(`.${styles.addForm} input[type="file"]`)?.click()}
                                    className={styles.uploadBtn}
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                </button>
                            </div>
                            <div className={styles.editActions}>
                                <button onClick={handleAdd} className={styles.saveBtn}>Add Sponsor</button>
                                <button onClick={() => { setShowAddForm(false); setFormData({ title: '', link: '', site: '', image: '' }) }} className={styles.cancelBtn}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setShowAddForm(true)} className={styles.addBtn}>
                            + Add Sponsor
                        </button>
                    )}
                </>
            )}
        </div>
    )
}
