// ZonatOne - Web3 Social Media Platform
// Phantom Wallet Integration & Social Features

// ==================== STATE MANAGEMENT ====================
let currentUser = null;
let posts = [];
let users = [];

// ==================== PHANTOM WALLET ====================
const getProvider = () => {
    if ('phantom' in window) {
        const provider = window.phantom?.solana;
        if (provider?.isPhantom) {
            return provider;
        }
    }
    return null;
};

// Connect Phantom Wallet
async function connectWallet() {
    const provider = getProvider();

    if (!provider) {
        document.getElementById('walletNotInstalled').classList.remove('hidden');
        return null;
    }

    try {
        const resp = await provider.connect();
        const walletAddress = resp.publicKey.toString();
        console.log('Connected to wallet:', walletAddress);
        return walletAddress;
    } catch (err) {
        console.error('Error connecting to wallet:', err);
        return null;
    }
}

// Disconnect Wallet
async function disconnectWallet() {
    const provider = getProvider();
    if (provider) {
        try {
            await provider.disconnect();
            console.log('Wallet disconnected');
        } catch (err) {
            console.error('Error disconnecting wallet:', err);
        }
    }
}

// ==================== LOCAL STORAGE ====================
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function clearLocalStorage() {
    localStorage.removeItem('currentUser');
}

// ==================== USER MANAGEMENT ====================
function initializeUsers() {
    let storedUsers = getFromLocalStorage('zonatone_users');
    if (!storedUsers) {
        storedUsers = [
            {
                walletAddress: 'demo1234567890',
                username: 'CryptoKing',
                avatar: 'https://i.pravatar.cc/150?img=12'
            },
            {
                walletAddress: 'demo9876543210',
                username: 'Web3Queen',
                avatar: 'https://i.pravatar.cc/150?img=5'
            },
            {
                walletAddress: 'demo5555555555',
                username: 'NFTCollector',
                avatar: 'https://i.pravatar.cc/150?img=33'
            }
        ];
        saveToLocalStorage('zonatone_users', storedUsers);
    }
    users = storedUsers;
}

function getUserByWallet(walletAddress) {
    return users.find(u => u.walletAddress === walletAddress);
}

function createUser(walletAddress, username, avatar) {
    const newUser = {
        walletAddress,
        username,
        avatar: avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    users.push(newUser);
    saveToLocalStorage('zonatone_users', users);
    return newUser;
}

function shortenWalletAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}

// ==================== POSTS MANAGEMENT ====================
function initializePosts() {
    let storedPosts = getFromLocalStorage('zonatone_posts');
    if (!storedPosts) {
        storedPosts = [
            {
                id: 1,
                authorWallet: 'demo1234567890',
                content: 'Just joined ZonatOne! This Web3 social platform is amazing! 🚀',
                image: null,
                likes: 24,
                likedBy: [],
                comments: [
                    {
                        authorWallet: 'demo9876543210',
                        text: 'Welcome to the future! 🎉',
                        timestamp: Date.now() - 1000000
                    }
                ],
                timestamp: Date.now() - 3600000
            },
            {
                id: 2,
                authorWallet: 'demo9876543210',
                content: 'GM to all Web3 builders! Let\'s create something amazing today 💪',
                image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600',
                likes: 42,
                likedBy: [],
                comments: [],
                timestamp: Date.now() - 7200000
            },
            {
                id: 3,
                authorWallet: 'demo5555555555',
                content: 'The decentralized social media revolution is here! No more centralized control 🔥',
                image: null,
                likes: 18,
                likedBy: [],
                comments: [
                    {
                        authorWallet: 'demo1234567890',
                        text: 'This is the way! 🌟',
                        timestamp: Date.now() - 500000
                    }
                ],
                timestamp: Date.now() - 10800000
            }
        ];
        saveToLocalStorage('zonatone_posts', storedPosts);
    }
    posts = storedPosts;
}

function createPost(content, imageUrl = null) {
    const newPost = {
        id: Date.now(),
        authorWallet: currentUser.walletAddress,
        content,
        image: imageUrl,
        likes: 0,
        likedBy: [],
        comments: [],
        timestamp: Date.now()
    };
    posts.unshift(newPost);
    saveToLocalStorage('zonatone_posts', posts);
    return newPost;
}

function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const userWallet = currentUser.walletAddress;
    const likedIndex = post.likedBy.indexOf(userWallet);

    if (likedIndex > -1) {
        post.likedBy.splice(likedIndex, 1);
        post.likes--;
    } else {
        post.likedBy.push(userWallet);
        post.likes++;
    }

    saveToLocalStorage('zonatone_posts', posts);
    return post;
}

function addComment(postId, text) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newComment = {
        authorWallet: currentUser.walletAddress,
        text,
        timestamp: Date.now()
    };

    post.comments.push(newComment);
    saveToLocalStorage('zonatone_posts', posts);
    return post;
}

function getTimeSince(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// ==================== STORIES ====================
const stories = [
    { username: 'CryptoKing', avatar: 'https://i.pravatar.cc/150?img=12', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400' },
    { username: 'Web3Queen', avatar: 'https://i.pravatar.cc/150?img=5', image: 'https://images.unsplash.com/photo-1644361567875-4838dd17f40f?w=400' },
    { username: 'NFTCollector', avatar: 'https://i.pravatar.cc/150?img=33', image: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=400' },
    { username: 'SolanaFan', avatar: 'https://i.pravatar.cc/150?img=60', image: 'https://images.unsplash.com/photo-1644143379190-08a5f055de1d?w=400' },
    { username: 'DeFiGuru', avatar: 'https://i.pravatar.cc/150?img=25', image: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=400' }
];

// ==================== UI RENDERING ====================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function renderStories() {
    const container = document.getElementById('storiesContainer');
    container.innerHTML = stories.map(story => `
    <div class="story-item" onclick="viewStory('${story.username}', '${story.image}')">
      <div class="story-avatar">
        <img src="${story.avatar}" alt="${story.username}">
      </div>
      <p>${story.username}</p>
    </div>
  `).join('');
}

function renderPosts() {
    const container = document.getElementById('postsContainer');

    container.innerHTML = posts.map(post => {
        const author = getUserByWallet(post.authorWallet);
        const isLiked = post.likedBy.includes(currentUser.walletAddress);

        return `
      <div class="post-card">
        <div class="post-header">
          <img src="${author.avatar}" alt="${author.username}" class="post-avatar">
          <div class="post-author-info">
            <h4>${author.username}</h4>
            <p class="post-time">${getTimeSince(post.timestamp)}</p>
          </div>
        </div>
        
        <div class="post-content">
          <p>${post.content}</p>
          ${post.image ? `<img src="${post.image}" alt="Post" class="post-image">` : ''}
        </div>
        
        <div class="post-stats">
          <span>${post.likes} likes</span>
          <span>${post.comments.length} comments</span>
        </div>
        
        <div class="post-actions">
          <button class="post-action-btn ${isLiked ? 'liked' : ''}" onclick="handleLike(${post.id})">
            <span>${isLiked ? '❤️' : '🤍'}</span>
            Like
          </button>
          <button class="post-action-btn" onclick="focusComment(${post.id})">
            <span>💬</span>
            Comment
          </button>
          <button class="post-action-btn">
            <span>📤</span>
            Share
          </button>
        </div>
        
        ${post.comments.length > 0 ? `
          <div class="post-comments">
            ${post.comments.map(comment => {
            const commentAuthor = getUserByWallet(comment.authorWallet);
            return `
                <div class="comment-item">
                  <img src="${commentAuthor.avatar}" alt="${commentAuthor.username}" class="comment-avatar">
                  <div class="comment-content">
                    <p class="comment-author">${commentAuthor.username}</p>
                    <p class="comment-text">${comment.text}</p>
                  </div>
                </div>
              `;
        }).join('')}
          </div>
        ` : ''}
        
        <div class="add-comment">
          <input 
            type="text" 
            placeholder="Write a comment..." 
            id="comment-input-${post.id}"
            onkeypress="handleCommentKeypress(event, ${post.id})"
          >
        </div>
      </div>
    `;
    }).join('');
}

function renderSuggestions() {
    const container = document.getElementById('suggestionsContainer');
    const suggestions = users.filter(u => u.walletAddress !== currentUser.walletAddress).slice(0, 3);

    container.innerHTML = suggestions.map(user => `
    <div class="suggestion-item">
      <img src="${user.avatar}" alt="${user.username}" class="suggestion-avatar">
      <div class="suggestion-info">
        <h4>${user.username}</h4>
        <p>${shortenWalletAddress(user.walletAddress)}</p>
      </div>
      <button class="btn btn-secondary btn-small">Follow</button>
    </div>
  `).join('');
}

function updateUserUI() {
    // Update all user-related UI elements
    document.getElementById('navUserAvatar').src = currentUser.avatar;
    document.getElementById('navUsername').textContent = currentUser.username;
    document.getElementById('profileCardAvatar').src = currentUser.avatar;
    document.getElementById('profileCardUsername').textContent = currentUser.username;
    document.getElementById('profileCardWallet').textContent = shortenWalletAddress(currentUser.walletAddress);
    document.getElementById('createPostAvatar').src = currentUser.avatar;
}

// ==================== EVENT HANDLERS ====================
function handleLike(postId) {
    toggleLike(postId);
    renderPosts();
}

function focusComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    input.focus();
}

function handleCommentKeypress(event, postId) {
    if (event.key === 'Enter') {
        const input = event.target;
        const text = input.value.trim();

        if (text) {
            addComment(postId, text);
            input.value = '';
            renderPosts();
        }
    }
}

function viewStory(username, imageUrl) {
    document.getElementById('storyUsername').textContent = username;
    document.getElementById('storyImage').src = imageUrl;
    document.getElementById('storyViewerModal').classList.add('active');
}

// ==================== MODALS ====================
function openCreatePostModal() {
    document.getElementById('createPostModal').classList.add('active');
}

function closeCreatePostModal() {
    document.getElementById('createPostModal').classList.remove('active');
    document.getElementById('postContentInput').value = '';
    document.getElementById('postImageInput').value = '';
}

function closeStoryModal() {
    document.getElementById('storyViewerModal').classList.remove('active');
}

// ==================== INITIALIZATION ====================
async function initApp() {
    // Check if user is already logged in
    const savedUser = getFromLocalStorage('currentUser');

    if (savedUser) {
        currentUser = savedUser;
        initializeUsers();
        initializePosts();
        updateUserUI();
        renderStories();
        renderPosts();
        renderSuggestions();
        showPage('mainPage');
    } else {
        showPage('loginPage');
    }
}

// ==================== LOGIN FLOW ====================
document.getElementById('connectWalletBtn').addEventListener('click', async () => {
    const walletAddress = await connectWallet();

    if (walletAddress) {
        initializeUsers();

        // Check if user already has a profile
        const existingUser = getUserByWallet(walletAddress);

        if (existingUser) {
            // User exists, log them in
            currentUser = existingUser;
            saveToLocalStorage('currentUser', currentUser);
            initializePosts();
            updateUserUI();
            renderStories();
            renderPosts();
            renderSuggestions();
            showPage('mainPage');
        } else {
            // New user, show profile setup
            document.getElementById('walletAddressDisplay').textContent = shortenWalletAddress(walletAddress);
            showPage('profileSetupPage');

            // Store wallet temporarily
            window.tempWalletAddress = walletAddress;
        }
    }
});

// ==================== PROFILE SETUP ====================
document.getElementById('avatarInput').addEventListener('input', (e) => {
    const url = e.target.value;
    const preview = document.getElementById('avatarPreview');

    if (url) {
        preview.innerHTML = `<img src="${url}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
        preview.innerHTML = '👤';
    }
});

document.getElementById('createProfileBtn').addEventListener('click', () => {
    const username = document.getElementById('usernameInput').value.trim();
    const avatarUrl = document.getElementById('avatarInput').value.trim();

    if (!username) {
        alert('Please enter a username');
        return;
    }

    // Create user profile
    currentUser = createUser(window.tempWalletAddress, username, avatarUrl);
    saveToLocalStorage('currentUser', currentUser);
    delete window.tempWalletAddress;

    // Initialize and show main page
    initializePosts();
    updateUserUI();
    renderStories();
    renderPosts();
    renderSuggestions();
    showPage('mainPage');
});

// ==================== CREATE POST ====================
document.getElementById('createPostTrigger').addEventListener('click', openCreatePostModal);

document.getElementById('closeCreatePostModal').addEventListener('click', closeCreatePostModal);

document.getElementById('submitPostBtn').addEventListener('click', () => {
    const content = document.getElementById('postContentInput').value.trim();
    const imageUrl = document.getElementById('postImageInput').value.trim();

    if (!content) {
        alert('Please write something!');
        return;
    }

    createPost(content, imageUrl || null);
    renderPosts();
    closeCreatePostModal();
});

// ==================== STORY VIEWER ====================
document.getElementById('closeStoryModal').addEventListener('click', closeStoryModal);

// ==================== LOGOUT ====================
document.getElementById('logoutBtn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to logout?')) {
        await disconnectWallet();
        clearLocalStorage();
        currentUser = null;
        showPage('loginPage');
    }
});

// ==================== CLOSE MODALS ON OUTSIDE CLICK ====================
document.getElementById('createPostModal').addEventListener('click', (e) => {
    if (e.target.id === 'createPostModal') {
        closeCreatePostModal();
    }
});

document.getElementById('storyViewerModal').addEventListener('click', (e) => {
    if (e.target.id === 'storyViewerModal') {
        closeStoryModal();
    }
});

// ==================== START APP ====================
window.addEventListener('load', initApp);
