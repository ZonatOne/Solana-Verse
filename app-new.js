// ZonatOne - Clean Modern App
// Simplified JavaScript with better structure

// ==================== STATE ====================
let currentUser = null;
let currentStep = 1;
let tempWalletAddress = null;

// ==================== PHANTOM WALLET ====================
const getProvider = () => {
    if ('phantom' in window) {
        const provider = window.phantom?.solana;
        if (provider?.isPhantom) return provider;
    }
    return null;
};

async function connectWallet() {
    const provider = getProvider();
    if (!provider) {
        showError();
        showToast('Phantom Wallet not detected. Please install it first.', 'error');
        return null;
    }

    try {
        const resp = await provider.connect();
        return resp.publicKey.toString();
    } catch (err) {
        console.error('Error connecting:', err);
        showToast('Failed to connect wallet. Please try again.', 'error');
        return null;
    }
}

async function disconnectWallet() {
    const provider = getProvider();
    if (provider) {
        try {
            await provider.disconnect();
        } catch (err) {
            console.error('Error disconnecting:', err);
        }
    }
}

// ==================== STORAGE ====================
function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function load(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// ==================== USER MANAGEMENT ====================
function initializeUsers() {
    let stored = load('zonatone_users');
    if (!stored) {
        stored = [];
        save('zonatone_users', stored);
    }
    return stored;
}

function createUser(address, username, avatar) {
    const users = initializeUsers();
    const newUser = {
        walletAddress: address,
        username,
        avatar: avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    users.push(newUser);
    save('zonatone_users', users);
    return newUser;
}

function getUserByWallet(address) {
    const users = initializeUsers();
    return users.find(u => u.walletAddress === address);
}

function shortenAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}

// ==================== UI FUNCTIONS ====================
function showStep(step) {
    currentStep = step;

    // Hide all steps
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));

    // Show current step
    document.getElementById(`step${step}`).classList.add('active');

    // Update progress dots
    document.querySelectorAll('.progress-dot').forEach((dot, idx) => {
        if (idx + 1 === step) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function showLoading() {
    document.getElementById('walletLoading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('walletLoading').classList.add('hidden');
}

function showError() {
    document.getElementById('walletError').classList.remove('hidden');
}

function hideError() {
    document.getElementById('walletError').classList.add('hidden');
}

// ==================== TOAST NOTIFICATIONS ====================
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

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== EVENT HANDLERS ====================

// Connect Wallet Button
document.getElementById('connectWalletBtn').addEventListener('click', async () => {
    hideError();
    showLoading();

    const address = await connectWallet();
    hideLoading();

    if (address) {
        const existingUser = getUserByWallet(address);

        if (existingUser) {
            // User already exists, redirect to main app
            currentUser = existingUser;
            save('currentUser', currentUser);
            showToast(`Welcome back, ${existingUser.username}!`, 'success');
            showStep(3);
            setTimeout(() => {
                // In real app, redirect to main feed
                window.location.href = 'feed.html';
            }, 2000);
        } else {
            // New user, go to profile creation
            tempWalletAddress = address;
            document.getElementById('connectedWallet').textContent = shortenAddress(address);
            showToast('Wallet connected successfully!', 'success');
            showStep(2);
        }
    }
});

// Avatar URL Input
document.getElementById('avatarInput').addEventListener('input', (e) => {
    const url = e.target.value.trim();
    const preview = document.getElementById('avatarPreview');

    if (url) {
        try {
            new URL(url);
            preview.innerHTML = `<img src="${url}" alt="Avatar" onerror="this.parentElement.innerHTML='<div class=\\"avatar-placeholder\\">👤</div>'; showToast('Failed to load image', 'error');">`;
        } catch (err) {
            showToast('Please enter a valid URL', 'error');
            preview.innerHTML = '<div class="avatar-placeholder">👤</div>';
        }
    } else {
        preview.innerHTML = '<div class="avatar-placeholder">👤</div>';
    }
});

// Create Profile Button
document.getElementById('createProfileBtn').addEventListener('click', () => {
    const username = document.getElementById('usernameInput').value.trim();
    const avatarUrl = document.getElementById('avatarInput').value.trim();

    // Validation
    if (!username) {
        showToast('Please enter a username', 'error');
        return;
    }

    if (username.length < 3) {
        showToast('Username must be at least 3 characters', 'error');
        return;
    }

    if (username.length > 20) {
        showToast('Username must be less than 20 characters', 'error');
        return;
    }

    // Create user
    currentUser = createUser(tempWalletAddress, username, avatarUrl || null);
    save('currentUser', currentUser);

    showToast(`Welcome to ZonatOne, ${username}!`, 'success');
    showStep(3);

    // Redirect after 2 seconds
    setTimeout(() => {
        // In real app, redirect to main feed
        window.location.href = 'feed.html';
    }, 2000);
});

// ==================== INITIALIZATION ====================
function init() {
    // Check if user is already logged in
    const savedUser = load('currentUser');
    if (savedUser) {
        // User is logged in, redirect to main app
        window.location.href = 'feed.html';
    } else {
        // Show onboarding
        showStep(1);
    }
}

// Start app when page loads
window.addEventListener('load', init);

// Add fadeOut animation for toast
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
  }
`;
document.head.appendChild(style);
