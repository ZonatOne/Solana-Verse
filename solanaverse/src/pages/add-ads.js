import Head from 'next/head'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import AdForm from '@/components/AdForm'
import styles from '@/styles/AddAds.module.css'

export default function AddAds() {
    const { connected } = useWallet()
    const router = useRouter()

    const handleSuccess = () => {
        setTimeout(() => {
            router.push('/feed')
        }, 3000)
    }

    return (
        <>
            <Head>
                <title>Add Advertisement - SolanaVerse</title>
                <meta name="description" content="Create paid advertisement on SolanaVerse" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>

            <div className={styles.page}>
                <Navbar />

                <main className={styles.main}>
                    <div className={styles.header}>
                        <h1>📢 Buat Iklan</h1>
                        <p>Promosikan bisnis atau produk Anda ke ribuan pengguna SolanaVerse</p>
                    </div>

                    {!connected ? (
                        <div className={styles.connectPrompt}>
                            <div className={styles.promptIcon}>🔐</div>
                            <h2>Hubungkan Wallet Anda</h2>
                            <p>Anda perlu menghubungkan wallet Phantom untuk membuat iklan</p>
                            <WalletMultiButton className={styles.connectBtn} />
                        </div>
                    ) : (
                        <div className={styles.content}>
                            <div className={styles.infoSection}>
                                <h2>Bagaimana Cara Kerjanya?</h2>
                                <div className={styles.steps}>
                                    <div className={styles.step}>
                                        <div className={styles.stepNumber}>1</div>
                                        <div className={styles.stepContent}>
                                            <h3>Buat Konten Iklan</h3>
                                            <p>Tulis pesan iklan Anda dan upload gambar (opsional)</p>
                                        </div>
                                    </div>
                                    <div className={styles.step}>
                                        <div className={styles.stepNumber}>2</div>
                                        <div className={styles.stepContent}>
                                            <h3>Bayar dengan SOL</h3>
                                            <p>Bayar ~$100 USD dalam SOL untuk iklan 30 hari</p>
                                        </div>
                                    </div>
                                    <div className={styles.step}>
                                        <div className={styles.stepNumber}>3</div>
                                        <div className={styles.stepContent}>
                                            <h3>Tunggu Approval</h3>
                                            <p>Admin akan review iklan Anda dalam 24 jam</p>
                                        </div>
                                    </div>
                                    <div className={styles.step}>
                                        <div className={styles.stepNumber}>4</div>
                                        <div className={styles.stepContent}>
                                            <h3>Iklan Tayang!</h3>
                                            <p>Iklan Anda akan tampil di sidebar selama 30 hari</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.benefits}>
                                    <h3>Keuntungan Beriklan di SolanaVerse</h3>
                                    <ul>
                                        <li>✅ Jangkauan ke 100K+ pengguna aktif</li>
                                        <li>✅ Target audience Web3 dan crypto enthusiast</li>
                                        <li>✅ Harga transparan dan tetap</li>
                                        <li>✅ Tracking klik real-time</li>
                                        <li>✅ Pembayaran aman melalui blockchain</li>
                                        <li>✅ Durasi 30 hari penuh</li>
                                    </ul>
                                </div>
                            </div>

                            <div className={styles.formSection}>
                                <AdForm onSuccess={handleSuccess} />
                            </div>
                        </div>
                    )}

                    <div className={styles.termsSection}>
                        <h3>Syarat & Ketentuan</h3>
                        <ul className={styles.terms}>
                            <li>Iklan harus sesuai dengan pedoman komunitas SolanaVerse</li>
                            <li>Konten tidak boleh mengandung SARA, pornografi, atau kekerasan</li>
                            <li>Admin berhak menolak iklan yang tidak sesuai</li>
                            <li>Pembayaran tidak dapat dikembalikan setelah transaksi dikonfirmasi</li>
                            <li>Iklan akan aktif selama 30 hari setelah disetujui</li>
                            <li>Anda bertanggung jawab atas konten iklan yang Anda buat</li>
                        </ul>
                    </div>
                </main>

                <footer className={styles.footer}>
                    <p>Built with 💜 on Solana</p>
                </footer>
            </div>
        </>
    )
}
