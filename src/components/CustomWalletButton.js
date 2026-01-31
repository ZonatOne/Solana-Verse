import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import styles from '@/styles/CustomWalletButton.module.css'

export default function CustomWalletButton({ className }) {
    const { connected, publicKey, disconnect, connecting } = useWallet()
    const { setVisible } = useWalletModal()

    const handleClick = () => {
        if (connected) {
            disconnect()
        } else {
            setVisible(true)
        }
    }

    const getButtonText = () => {
        if (connecting) return 'Connecting...'
        if (connected && publicKey) {
            return publicKey.toString().slice(0, 4) + '...' + publicKey.toString().slice(-4)
        }
        return 'Connect Wallet'
    }

    return (
        <div className={`${styles.walletButtonWrapper} ${className || ''}`}>
            <button
                onClick={handleClick}
                className={styles.walletButton}
                disabled={connecting}
            >
                {!connected && (
                    <img
                        src="/phantom-icon.png"
                        alt="Phantom"
                        className={styles.phantomIcon}
                    />
                )}
                <span>{getButtonText()}</span>
            </button>
        </div>
    )
}
