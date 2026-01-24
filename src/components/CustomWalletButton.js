import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import styles from '@/styles/CustomWalletButton.module.css'

export default function CustomWalletButton({ className }) {
    const { connected } = useWallet()

    return (
        <div className={`${styles.walletButtonWrapper} ${className || ''}`}>
            {!connected && (
                <img
                    src="/phantom-icon.png"
                    alt="Phantom"
                    className={styles.phantomIcon}
                />
            )}
            <WalletMultiButton className={styles.walletButton} />
        </div>
    )
}
