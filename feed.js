// Feed Page JavaScript

// ==================== STORAGE ====================
function load(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function shortenAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}

// ==================== TOAST ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? '✓' : '⚠️';
    toast.innerHTML = `
    <span style="font-size: 18px;">${icon}</span>
    <span>${message}</span>
  `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== INIT ====================
function init() {
    const currentUser = load('currentUser');

    if (!currentUser) {
        // Not logged in, redirect to onboarding
        window.location.href = 'index.html';
        return;
    }

    // Update UI with user data
    document.getElementById('username').textContent = currentUser.username;
    document.getElementById('userAvatar').src = currentUser.avatar;
    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profileAvatar').src = currentUser.avatar;
    document.getElementById('profileWallet').textContent = shortenAddress(currentUser.walletAddress);
    document.getElementById('createPostAvatar').src = currentUser.avatar;
    document.getElementById('postAuthorAvatar').src = currentUser.avatar;
    document.getElementById('postAuthorName').textContent = currentUser.username;

    showToast(`Welcome, ${currentUser.username}!`, 'success');
}

// ==================== EVENT HANDLERS ====================

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to logout?')) {
        // Disconnect wallet
        if ('phantom' in window) {
            const provider = window.phantom?.solana;
            if (provider?.isPhantom) {
                try {
                    await provider.disconnect();
                } catch (err) {
                    console.error('Error disconnecting:', err);
                }
            }
        }

        // Clear storage
        localStorage.removeItem('currentUser');

        // Redirect to onboarding
        window.location.href = 'index.html';
    }
});

// Create Post (placeholder)
document.getElementById('createPostInput').addEventListener('click', () => {
    showToast('Create post feature coming soon!', 'info');
});

// Initialize on load
window.addEventListener('load', init);

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
  }
`;
document.head.appendChild(style);
