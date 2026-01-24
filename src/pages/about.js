import Head from 'next/head'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import styles from '@/styles/About.module.css'

export default function About() {
    return (
        <>
            <Head>
                <title>About - SolanaVerse</title>
                <meta name="description" content="Learn about SolanaVerse - Web3 Social Media Platform" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>

            <div className={styles.page}>
                <Navbar />

                <main className={styles.main}>
                    <div className={styles.hero}>
                        <div className={styles.logoLarge}>
                            <span className={styles.logoIcon}>◆</span>
                        </div>
                        <h1 className={styles.title}>
                            Tentang <span className={styles.gradient}>SolanaVerse</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Platform media sosial Web3 yang menghubungkan komunitas melalui blockchain Solana
                        </p>
                    </div>

                    <div className={styles.content}>
                        <section className={styles.section}>
                            <div className={styles.sectionIcon}>🌐</div>
                            <h2>Apa itu SolanaVerse?</h2>
                            <p>
                                SolanaVerse adalah platform media sosial terdesentralisasi yang dibangun di atas blockchain Solana.
                                Kami menggabungkan kekuatan Web3 dengan pengalaman media sosial yang familiar,
                                memberikan kontrol penuh kepada pengguna atas data dan konten mereka.
                            </p>
                        </section>

                        <section className={styles.section}>
                            <div className={styles.sectionIcon}>🎯</div>
                            <h2>Misi Kami</h2>
                            <p>
                                Menciptakan ruang digital yang aman, transparan, dan terdesentralisasi untuk
                                berbagi, berinteraksi, dan membangun komunitas. Kami percaya bahwa pengguna
                                harus memiliki kendali penuh atas identitas digital dan konten mereka.
                            </p>
                        </section>

                        <div className={styles.features}>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🔐</div>
                                <h3>Login dengan Wallet</h3>
                                <p>Tidak perlu password. Wallet Phantom Anda adalah identitas Anda.</p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>💬</div>
                                <h3>Interaksi Sosial</h3>
                                <p>Post, like, comment, dan follow - semua di blockchain.</p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>⚡</div>
                                <h3>Lightning Fast</h3>
                                <p>Powered by Solana untuk transaksi instan dan biaya rendah.</p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>📢</div>
                                <h3>Platform Iklan</h3>
                                <p>Promosikan bisnis Anda dengan iklan berbayar menggunakan SOL.</p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🤝</div>
                                <h3>Komunitas</h3>
                                <p>Bangun jaringan dan temukan teman baru di ekosistem Web3.</p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🎨</div>
                                <h3>Desentralisasi</h3>
                                <p>Data Anda, kontrol Anda. Tidak ada pihak ketiga yang mengontrol.</p>
                            </div>
                        </div>

                        <section className={styles.section}>
                            <div className={styles.sectionIcon}>💰</div>
                            <h2>Sistem Iklan</h2>
                            <p>
                                SolanaVerse menawarkan sistem iklan yang transparan dan efektif. Bisnis dan individu
                                dapat mempromosikan produk atau layanan mereka dengan membayar menggunakan SOL.
                            </p>
                            <ul className={styles.adFeatures}>
                                <li>💎 Harga tetap: ~$100 USD dalam SOL</li>
                                <li>📅 Durasi: 30 hari aktif</li>
                                <li>✅ Review oleh admin sebelum tayang</li>
                                <li>📊 Tracking klik dan performa</li>
                                <li>🎯 Tampil di sidebar untuk visibilitas maksimal</li>
                            </ul>
                            <Link href="/add-ads" className={styles.ctaButton}>
                                Buat Iklan Sekarang →
                            </Link>
                        </section>

                        <section className={styles.section}>
                            <div className={styles.sectionIcon}>🚀</div>
                            <h2>Mengapa Solana?</h2>
                            <p>
                                Kami memilih Solana karena kecepatan, skalabilitas, dan biaya transaksi yang rendah.
                                Dengan Solana, pengguna dapat berinteraksi tanpa khawatir tentang gas fees yang tinggi,
                                membuat pengalaman media sosial terasa natural dan seamless.
                            </p>
                        </section>

                        <section className={styles.section}>
                            <div className={styles.sectionIcon}>👥</div>
                            <h2>Bergabung dengan Komunitas</h2>
                            <p>
                                SolanaVerse adalah lebih dari sekadar platform - ini adalah komunitas.
                                Bergabunglah dengan ribuan pengguna yang sudah menjadi bagian dari revolusi Web3.
                            </p>
                            <div className={styles.stats}>
                                <div className={styles.stat}>
                                    <span className={styles.statNumber}>100K+</span>
                                    <span className={styles.statLabel}>Pengguna</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statNumber}>1M+</span>
                                    <span className={styles.statLabel}>Posts</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.statNumber}>50K+</span>
                                    <span className={styles.statLabel}>Daily Active</span>
                                </div>
                            </div>
                        </section>

                        <section className={styles.ctaSection}>
                            <h2>Siap Memulai?</h2>
                            <p>Hubungkan wallet Phantom Anda dan mulai perjalanan Web3 Anda hari ini!</p>
                            <Link href="/feed" className={styles.ctaButton}>
                                Mulai Sekarang →
                            </Link>
                        </section>
                    </div>
                </main>

                <footer className={styles.footer}>
                    <p>Built with 💜 on Solana</p>
                </footer>
            </div>
        </>
    )
}
