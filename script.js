// User Authentication System
let userManager = null;
let currentPlayer = null;
const users = {}; // Keep for backward compatibility but not used

// Game state
let gameState = {
    casesOpened: 0,
    totalValue: 0,
    bestItem: null,
    selectedCase: null,
    inventory: [],
    money: 10.00, // Starting loan of $10
    achievements: [],
    totalSold: 0,
    upgrades: {
        autoClicker: 0,
        luckyCharm: 0,
        businessLicense: 0,
        premiumTheme: false,
        vipStatus: false,
        goldMembership: false
    },
    theme: 'default',
    minigameStreak: 0,
    totalMinigamesWon: 0,
    tutorialCompleted: false,
    tutorialStep: 0
};

// Tutorial steps
const tutorialSteps = [
    {
        title: "Welcome to CaseCraze! 🎮",
        content: "Welcome to the ultimate CS:GO case opening tycoon! I'll show you how to build your empire.",
        target: null,
        action: null
    },
    {
        title: "Your Starting Money 💰",
        content: "You start with $10.00. This is your seed money to begin your case opening journey!",
        target: "#money",
        action: null
    },
    {
        title: "Earn More Money 💸",
        content: "Click this button to earn money when you're running low. You'll get $0.50-$2.50 each time!",
        target: "#earnMoneyBtn",
        action: "highlight"
    },
    {
        title: "Choose a Case 📦",
        content: "Select a case to open! Start with the Phoenix Case - it's the cheapest at $0.50.",
        target: ".case-card[data-case='phoenix']",
        action: "highlight"
    },
    {
        title: "Case Opening Magic ✨",
        content: "When you open a case, watch the roulette spin and see what item you get! Each rarity has different odds.",
        target: null,
        action: null
    },
    {
        title: "Your Inventory 🎒",
        content: "Items you win go here! You can sell them for 80% of their value to get money back.",
        target: ".inventory",
        action: "scroll"
    },
    {
        title: "Tycoon Upgrades 🚀",
        content: "Use your money to buy upgrades! Auto Money Generator gives you passive income.",
        target: ".upgrades",
        action: "scroll"
    },
    {
        title: "Achievements 🏆",
        content: "Complete challenges to earn achievement rewards. Some give substantial money bonuses!",
        target: ".achievements",
        action: "scroll"
    },
    {
        title: "Ready to Play! 🎉",
        content: "You're all set! Start by earning some money, then buy your first case. Good luck building your empire!",
        target: null,
        action: null
    }
];

// Case definitions with items and their rarities
const cases = {
    chroma: {
        name: "Chroma Case",
        price: 2.50,
        items: [
            // Common (80% chance)
            { name: "MP9 | Deadly Poison", rarity: "common", value: 0.10, emoji: "🔫" },
            { name: "Sawed-Off | Serenity", rarity: "common", value: 0.15, emoji: "🔫" },
            { name: "P250 | Muertos", rarity: "common", value: 0.20, emoji: "🔫" },
            { name: "XM1014 | Quicksilver", rarity: "common", value: 0.25, emoji: "🔫" },
            
            // Uncommon (15% chance)
            { name: "Dual Berettas | Urban Shock", rarity: "uncommon", value: 1.50, emoji: "🔫" },
            { name: "Mac-10 | Neon Rider", rarity: "uncommon", value: 2.00, emoji: "🔫" },
            { name: "Scar-20 | Grotto", rarity: "uncommon", value: 1.75, emoji: "🔫" },
            
            // Rare (4% chance)
            { name: "AK-47 | Chroma", rarity: "rare", value: 15.00, emoji: "⚡" },
            { name: "Galil AR | Eco", rarity: "rare", value: 12.50, emoji: "⚡" },
            
            // Mythical (0.8% chance)
            { name: "M4A4 | 龍王 (Dragon King)", rarity: "mythical", value: 45.00, emoji: "🐉" },
            
            // Legendary (0.15% chance)
            { name: "★ Bayonet | Doppler", rarity: "legendary", value: 250.00, emoji: "🗡️" },
            
            // Ancient (0.05% chance)
            { name: "★ Karambit | Fade", rarity: "ancient", value: 800.00, emoji: "💎" }
        ]
    },
    spectrum: {
        name: "Spectrum Case",
        price: 1.80,
        items: [
            // Common (80% chance)
            { name: "UMP-45 | Scaffold", rarity: "common", value: 0.08, emoji: "🔫" },
            { name: "Nova | Baroque Sand", rarity: "common", value: 0.12, emoji: "🔫" },
            { name: "Tec-9 | Avalanche", rarity: "common", value: 0.18, emoji: "🔫" },
            { name: "P2000 | Turf", rarity: "common", value: 0.22, emoji: "🔫" },
            
            // Uncommon (15% chance)
            { name: "CZ75-Auto | Xiangliu", rarity: "uncommon", value: 1.20, emoji: "🔫" },
            { name: "M249 | Emerald", rarity: "uncommon", value: 1.80, emoji: "🔫" },
            
            // Rare (4% chance)
            { name: "AK-47 | Bloodsport", rarity: "rare", value: 18.00, emoji: "⚡" },
            { name: "USP-S | Neo-Noir", rarity: "rare", value: 14.50, emoji: "⚡" },
            
            // Mythical (0.8% chance)
            { name: "M4A1-S | Decimator", rarity: "mythical", value: 38.00, emoji: "🐉" },
            
            // Legendary (0.15% chance)
            { name: "★ Huntsman Knife | Gamma Doppler", rarity: "legendary", value: 180.00, emoji: "🗡️" },
            
            // Ancient (0.05% chance)
            { name: "★ Butterfly Knife | Crimson Web", rarity: "ancient", value: 650.00, emoji: "💎" }
        ]
    },
    phoenix: {
        name: "Phoenix Case",
        price: 0.50,
        items: [
            // Common (80% chance)
            { name: "MAG-7 | Heaven Guard", rarity: "common", value: 0.05, emoji: "🔫" },
            { name: "Negev | Terrain", rarity: "common", value: 0.08, emoji: "🔫" },
            { name: "Tec-9 | Sandstorm", rarity: "common", value: 0.10, emoji: "🔫" },
            { name: "FAMAS | Hexane", rarity: "common", value: 0.15, emoji: "🔫" },
            
            // Uncommon (15% chance)
            { name: "P90 | Trigon", rarity: "uncommon", value: 0.80, emoji: "🔫" },
            { name: "Nova | Antique", rarity: "uncommon", value: 1.00, emoji: "🔫" },
            
            // Rare (4% chance)
            { name: "AK-47 | Redline", rarity: "rare", value: 8.50, emoji: "⚡" },
            { name: "AWP | Asiimov", rarity: "rare", value: 25.00, emoji: "⚡" },
            
            // Mythical (0.8% chance)
            { name: "M4A4 | Asiimov", rarity: "mythical", value: 35.00, emoji: "🐉" },
            
            // Legendary (0.15% chance)
            { name: "★ Flip Knife | Fade", rarity: "legendary", value: 120.00, emoji: "🗡️" },
            
            // Ancient (0.05% chance)
            { name: "★ Karambit | Tiger Tooth", rarity: "ancient", value: 480.00, emoji: "💎" }
        ]
    },
    operation: {
        name: "Operation Case",
        price: 5.00,
        items: [
            // Common (80% chance)
            { name: "MP7 | Olive Plaid", rarity: "common", value: 0.20, emoji: "🔫" },
            { name: "PPBizon | Chemical Green", rarity: "common", value: 0.25, emoji: "🔫" },
            { name: "Five-SeveN | Jungle", rarity: "common", value: 0.30, emoji: "🔫" },
            { name: "Galil AR | Hunting Blind", rarity: "common", value: 0.35, emoji: "🔫" },
            
            // Uncommon (15% chance)
            { name: "AUG | Condemned", rarity: "uncommon", value: 3.50, emoji: "🔫" },
            { name: "SG 553 | Atlas", rarity: "uncommon", value: 4.20, emoji: "🔫" },
            
            // Rare (4% chance)
            { name: "AK-47 | Vulcan", rarity: "rare", value: 35.00, emoji: "⚡" },
            { name: "M4A1-S | Master Piece", rarity: "rare", value: 28.00, emoji: "⚡" },
            
            // Mythical (0.8% chance)
            { name: "AWP | Dragon Lore", rarity: "mythical", value: 150.00, emoji: "🐉" },
            
            // Legendary (0.15% chance)
            { name: "★ M9 Bayonet | Crimson Web", rarity: "legendary", value: 400.00, emoji: "🗡️" },
            
            // Ancient (0.05% chance)
            { name: "★ Karambit | Case Hardened", rarity: "ancient", value: 1200.00, emoji: "💎" }
        ]
    }
};

// Rarity weights for random selection
const rarityWeights = {
    common: 80,
    uncommon: 15,
    rare: 4,
    mythical: 0.8,
    legendary: 0.15,
    ancient: 0.05
};

// Achievement definitions
const achievements = [
    {
        id: 'first_case',
        name: 'First Steps',
        description: 'Open your first case',
        condition: () => gameState.casesOpened >= 1,
        reward: 5.00
    },
    {
        id: 'case_opener',
        name: 'Case Opener',
        description: 'Open 10 cases',
        condition: () => gameState.casesOpened >= 10,
        reward: 15.00
    },
    {
        id: 'case_addict',
        name: 'Case Addict',
        description: 'Open 50 cases',
        condition: () => gameState.casesOpened >= 50,
        reward: 50.00
    },
    {
        id: 'ak_collector',
        name: 'AK-47 Collector',
        description: 'Collect all AK-47 skins',
        condition: () => {
            const akSkins = ['AK-47 | Chroma', 'AK-47 | Bloodsport', 'AK-47 | Redline', 'AK-47 | Vulcan'];
            return akSkins.every(skin => gameState.inventory.some(item => item.name === skin));
        },
        reward: 25.00
    },
    {
        id: 'knife_collector',
        name: 'Knife Collector',
        description: 'Own 5 different knives at the same time',
        condition: () => {
            const knives = gameState.inventory.filter(item => item.name.includes('★'));
            const uniqueKnives = [...new Set(knives.map(knife => knife.name))];
            return uniqueKnives.length >= 5;
        },
        reward: 100.00
    },
    {
        id: 'big_spender',
        name: 'Big Spender',
        description: 'Spend $100 on cases',
        condition: () => gameState.casesOpened * 2.5 >= 100,
        reward: 30.00
    },
    {
        id: 'lucky_draw',
        name: 'Lucky Draw',
        description: 'Get a legendary or ancient item',
        condition: () => gameState.inventory.some(item => item.rarity === 'legendary' || item.rarity === 'ancient'),
        reward: 40.00
    },
    {
        id: 'entrepreneur',
        name: 'Entrepreneur',
        description: 'Sell items worth $50 total',
        condition: () => gameState.totalSold >= 50,
        reward: 20.00
    },
    {
        id: 'millionaire',
        name: 'Millionaire',
        description: 'Have $1000 in your wallet',
        condition: () => gameState.money >= 1000,
        reward: 100.00
    },
    {
        id: 'minigame_master',
        name: 'Minigame Master',
        description: 'Win 10 minigames',
        condition: () => gameState.totalMinigamesWon >= 10,
        reward: 50.00
    },
    {
        id: 'upgrade_enthusiast',
        name: 'Upgrade Enthusiast',
        description: 'Purchase 5 different upgrades',
        condition: () => {
            const upgradeCount = Object.values(gameState.upgrades).filter(val => val > 0 || val === true).length;
            return upgradeCount >= 5;
        },
        reward: 75.00
    }
];

// Upgrade definitions
const upgrades = {
    autoClicker: {
        name: 'Auto Money Generator',
        description: 'Automatically generates money over time',
        basePrice: 50,
        maxLevel: 10,
        effect: (level) => level * 0.5,
        icon: '🤖'
    },
    luckyCharm: {
        name: 'Lucky Charm',
        description: 'Increases chance of rare items',
        basePrice: 100,
        maxLevel: 5,
        effect: (level) => level * 0.02,
        icon: '🍀'
    },
    businessLicense: {
        name: 'Business License',
        description: 'Increases selling price by 5% per level',
        basePrice: 75,
        maxLevel: 8,
        effect: (level) => level * 0.05,
        icon: '📜'
    },
    premiumTheme: {
        name: 'Premium Theme',
        description: 'Unlock beautiful dark theme',
        basePrice: 200,
        maxLevel: 1,
        effect: () => 'dark',
        icon: '🎨'
    },
    vipStatus: {
        name: 'VIP Status',
        description: 'Get exclusive VIP benefits and discounts',
        basePrice: 500,
        maxLevel: 1,
        effect: () => 0.1,
        icon: '👑'
    },
    goldMembership: {
        name: 'Gold Membership',
        description: 'Double minigame rewards and special events',
        basePrice: 1000,
        maxLevel: 1,
        effect: () => 2,
        icon: '⭐'
    }
};

// Minigame definitions
const minigames = [
    {
        id: 'ticTacToe',
        name: 'Tic Tac Toe',
        description: 'Beat the AI in a classic game',
        entryFee: 2,
        reward: 8,
        icon: '⭕'
    },
    {
        id: 'numberGuess',
        name: 'Number Guessing',
        description: 'Guess the number between 1-10',
        entryFee: 1,
        reward: 4,
        icon: '🔢'
    },
    {
        id: 'coinFlip',
        name: 'Coin Flip',
        description: 'Call heads or tails',
        entryFee: 0.5,
        reward: 1.5,
        icon: '🪙'
    },
    {
        id: 'memoryGame',
        name: 'Memory Challenge',
        description: 'Remember the sequence',
        entryFee: 3,
        reward: 12,
        icon: '🧠'
    },
    {
        id: 'reactionTime',
        name: 'Reaction Test',
        description: 'Click when the color changes',
        entryFee: 1.5,
        reward: 6,
        icon: '⚡'
    }
];

// DOM elements will be assigned after DOM loads
let caseSelectionSection, caseOpeningSection, inventorySection, selectedCaseName, openCaseBtn, backBtn;
let rouletteContainer, rouletteTrack, resultContainer, caseBox;
let casesOpenedElement, totalValueElement, bestItemElement, moneyElement;
let resultImage, resultName, resultRarity, resultValue, openAnotherBtn, changeCaseBtn;
let inventoryGrid, earnMoneyBtn, achievementsGrid, achievementModal, achievementModalContent;
let upgradesGrid, minigameModal, minigameContent, minigameResult;
let tutorialModal, tutorialContent, tutorialStepIndicator, tutorialPrevBtn, tutorialNextBtn, tutorialSkipBtn;

// Authentication functions
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'flex';
        // Reset to login tab
        switchTab('login');
    }
}

function hideLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'none';
    }
}

function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    console.log('Tab elements found:', {
        loginTab: !!loginTab,
        registerTab: !!registerTab,
        tabButtons: tabButtons.length
    });
    
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    if (tabName === 'login') {
        if (loginTab) loginTab.style.display = 'block';
        if (registerTab) registerTab.style.display = 'none';
        const loginTabBtn = document.querySelector('[data-tab="login"]');
        if (loginTabBtn) loginTabBtn.classList.add('active');
        console.log('Switched to login tab');
    } else if (tabName === 'register') {
        if (loginTab) loginTab.style.display = 'none';
        if (registerTab) registerTab.style.display = 'block';
        const registerTabBtn = document.querySelector('[data-tab="register"]');
        if (registerTabBtn) registerTabBtn.classList.add('active');
        console.log('Switched to register tab');
    }
}

function handleLogin(event) {
    event.preventDefault();
    console.log('Login form submitted');
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showLoginMessage('Please fill in all fields!', 'error');
        return false;
    }
    
    const result = userManager.authenticateUser(username, password);
    
    if (result.success) {
        console.log('Login successful for:', username);
        currentPlayer = username;
        userManager.setCurrentUser(username);
        loadPlayerData();
        hideLoginModal();
        showPlayerInfo();
        
        // Clear form
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        
        // Start the game
        startGame();
        
        showLoginMessage('Login successful!', 'success');
    } else {
        console.log('Login failed:', result.message);
        showLoginMessage(result.message, 'error');
    }
    
    return false; // Prevent form submission
}

function handleRegister(event) {
    event.preventDefault();
    console.log('Register form submitted');
    
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!username || !password || !confirmPassword) {
        showLoginMessage('Please fill in all fields!', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        showLoginMessage('Passwords do not match!', 'error');
        return false;
    }
    
    const result = userManager.createUser(username, password);
    
    if (result.success) {
        console.log('Registration successful for:', username);
        showLoginMessage('Account created successfully! Please login.', 'success');
        
        // Clear form
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        // Switch to login tab
        setTimeout(() => {
            switchTab('login');
        }, 1500);
    } else {
        console.log('Registration failed:', result.message);
        showLoginMessage(result.message, 'error');
    }
    
    return false; // Prevent form submission
}

function showLoginMessage(message, type) {
    const messageEl = document.getElementById('loginMessage');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `login-message ${type}`;
        
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.className = 'login-message';
        }, 3000);
    }
}

function showPlayerInfo() {
    const playerInfo = document.getElementById('playerInfo');
    const playerName = document.getElementById('playerName');
    
    if (currentPlayer && playerInfo && playerName) {
        playerName.textContent = currentPlayer;
        playerInfo.style.display = 'flex';
    } else if (playerInfo) {
        playerInfo.style.display = 'none';
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout? Your progress will be saved.')) {
        console.log('User logging out:', currentPlayer);
        savePlayerData();
        userManager.clearCurrentUser();
        currentPlayer = null;
        resetGameState();
        updateStatsDisplay();
        updateInventoryDisplay();
        updateAchievementsDisplay();
        updateUpgradesDisplay();
        showLoginModal();
        const playerInfo = document.getElementById('playerInfo');
        if (playerInfo) {
            playerInfo.style.display = 'none';
        }
    }
}

function loadPlayerData() {
    if (currentPlayer && userManager) {
        console.log('Loading player data for:', currentPlayer);
        gameState = userManager.getUserGameState(currentPlayer);
        updateStatsDisplay();
        updateInventoryDisplay();
        updateAchievementsDisplay();
        updateUpgradesDisplay();
        applyTheme();
        updateThemeToggleButton();
    }
}

function savePlayerData() {
    if (currentPlayer && userManager) {
        console.log('Saving player data for:', currentPlayer);
        userManager.saveUserGameState(currentPlayer, gameState);
    }
}

function resetGameState() {
    gameState = userManager ? userManager.getDefaultGameState() : {
        casesOpened: 0,
        totalValue: 0,
        bestItem: null,
        selectedCase: null,
        inventory: [],
        money: 10.00,
        achievements: [],
        totalSold: 0,
        upgrades: {
            autoClicker: 0,
            luckyCharm: 0,
            businessLicense: 0,
            premiumTheme: false,
            vipStatus: false,
            goldMembership: false
        },
        theme: 'default',
        minigameStreak: 0,
        totalMinigamesWon: 0,
        tutorialCompleted: false,
        tutorialStep: 0
    };
}

function checkLogin() {
    console.log('Checking login status...');
    
    if (userManager && userManager.isUserLoggedIn()) {
        currentPlayer = userManager.getCurrentUser();
        console.log('Auto-login for user:', currentPlayer);
        loadPlayerData();
        showPlayerInfo();
        
        // Start the game for auto-logged in users
        startGame();
    } else {
        console.log('No valid login found, showing login modal');
        showLoginModal();
    }
}

// Game functions
function initGame() {
    console.log('Initializing game...');
    
    // Initialize UserDataManager
    if (window.UserDataManager) {
        userManager = new window.UserDataManager();
        console.log('UserDataManager initialized');
    } else {
        console.error('UserDataManager not available!');
        alert('Game initialization failed. Please refresh the page.');
        return;
    }
    
    // Initialize DOM elements
    caseSelectionSection = document.querySelector('.case-selection');
    caseOpeningSection = document.getElementById('caseOpening');
    inventorySection = document.querySelector('.inventory');
    selectedCaseName = document.getElementById('selectedCaseName');
    openCaseBtn = document.getElementById('openCaseBtn');
    backBtn = document.getElementById('backBtn');
    rouletteContainer = document.getElementById('rouletteContainer');
    rouletteTrack = document.getElementById('rouletteTrack');
    resultContainer = document.getElementById('resultContainer');
    caseBox = document.getElementById('caseBox');
    
    casesOpenedElement = document.getElementById('casesOpened');
    totalValueElement = document.getElementById('totalValue');
    bestItemElement = document.getElementById('bestItem');
    moneyElement = document.getElementById('money');
    
    resultImage = document.getElementById('resultImage');
    resultName = document.getElementById('resultName');
    resultRarity = document.getElementById('resultRarity');
    resultValue = document.getElementById('resultValue');
    openAnotherBtn = document.getElementById('openAnotherBtn');
    changeCaseBtn = document.getElementById('changeCaseBtn');
    
    inventoryGrid = document.getElementById('inventoryGrid');
    earnMoneyBtn = document.getElementById('earnMoneyBtn');
    achievementsGrid = document.getElementById('achievementsGrid');
    achievementModal = document.getElementById('achievementModal');
    achievementModalContent = document.querySelector('.achievement-modal-content');
    
    upgradesGrid = document.getElementById('upgradesGrid');
    minigameModal = document.getElementById('minigameModal');
    minigameContent = document.getElementById('minigameContent');
    minigameResult = document.getElementById('minigameResult');
    
    tutorialModal = document.getElementById('tutorialModal');
    tutorialContent = document.getElementById('tutorialContent');
    tutorialStepIndicator = document.getElementById('tutorialStepIndicator');
    tutorialPrevBtn = document.getElementById('tutorialPrevBtn');
    tutorialNextBtn = document.getElementById('tutorialNextBtn');
    tutorialSkipBtn = document.getElementById('tutorialSkipBtn');
    
    // Theme toggle button
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    // Add direct event listeners to tab buttons as fallback
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log('Direct tab button click:', e.target.dataset.tab);
            switchTab(e.target.dataset.tab);
        });
        console.log('Tab button listener attached for:', btn.dataset.tab);
    });
    
    // Setup event listeners
    setupEventListeners();
    
    // Check login status
    checkLogin();
}

function startGame() {
    console.log('Starting game for user:', currentPlayer);
    updateStatsDisplay();
    updateInventoryDisplay();
    updateAchievementsDisplay();
    updateUpgradesDisplay();
    checkAchievements();
    applyTheme();
    updateThemeToggleButton();
    startAutoClicker();
    startMinigameTimer();
    
    // Only start tutorial for new users who haven't completed it
    if (currentPlayer && !gameState.tutorialCompleted) {
        console.log('Starting tutorial for new user');
        setTimeout(() => {
            console.log('Checking tutorial elements before starting...');
            console.log('Tutorial modal:', !!document.getElementById('tutorialModal'));
            console.log('Tutorial buttons:', {
                prev: !!document.getElementById('tutorialPrevBtn'),
                next: !!document.getElementById('tutorialNextBtn'),
                skip: !!document.getElementById('tutorialSkipBtn')
            });
            startTutorial();
        }, 1000);
    } else {
        console.log('Tutorial already completed or no user logged in');
    }
}

function setupEventListeners() {
    // Use event delegation for all buttons to handle dynamically created elements
    document.addEventListener('click', (e) => {
        console.log('Click detected on:', e.target.tagName, e.target.id, e.target.className);
        
        // Tab switching - check for both class and data attribute
        if (e.target.classList.contains('tab-btn') && e.target.dataset.tab) {
            console.log('Tab button clicked:', e.target.dataset.tab);
            switchTab(e.target.dataset.tab);
            return; // Prevent other handlers from running
        }
        
        // Logout button
        if (e.target.id === 'logoutBtn') {
            handleLogout();
        }
        
        // Tutorial restart button
        if (e.target.id === 'restartTutorialBtn') {
            startTutorial();
        }
        
        // Theme toggle button
        if (e.target.id === 'themeToggleBtn') {
            toggleTheme();
        }
        
        // Tutorial navigation buttons - ONLY handle via event delegation
        if (e.target.id === 'tutorialPrevBtn') {
            console.log('Tutorial Previous button clicked');
            e.preventDefault();
            e.stopPropagation();
            previousTutorialStep();
            return;
        }
        
        if (e.target.id === 'tutorialNextBtn') {
            console.log('Tutorial Next button clicked');
            e.preventDefault();
            e.stopPropagation();
            nextTutorialStep();
            return;
        }
        
        if (e.target.id === 'tutorialSkipBtn') {
            console.log('Tutorial Skip button clicked');
            e.preventDefault();
            e.stopPropagation();
            skipTutorial();
            return;
        }
        
        // Case selection buttons
        if (e.target.classList.contains('select-case-btn')) {
            selectCase(e.target.dataset.case);
        }
        
        // Game buttons
        if (e.target.id === 'openCaseBtn') {
            openCase();
        }
        
        if (e.target.id === 'backBtn') {
            goBackToCases();
        }
        
        if (e.target.id === 'openAnotherBtn') {
            openAnotherCase();
        }
        
        if (e.target.id === 'changeCaseBtn') {
            goBackToCases();
        }
        
        if (e.target.id === 'earnMoneyBtn') {
            earnMoney();
        }
        
        // Inventory sell buttons
        if (e.target.classList.contains('sell-item-btn')) {
            e.preventDefault();
            e.stopPropagation();
            const itemIndex = parseInt(e.target.dataset.index);
            const timestamp = e.target.dataset.timestamp;
            
            // Double-check that the item still exists at this index with matching timestamp
            if (gameState.inventory[itemIndex] && gameState.inventory[itemIndex].timestamp == timestamp) {
                console.log('Selling item with valid index and timestamp');
                sellItem(itemIndex);
            } else {
                console.error('Item index/timestamp mismatch, refreshing inventory display');
                updateInventoryDisplay();
            }
            return;
        }
        
        // Upgrade buttons
        if (e.target.classList.contains('upgrade-btn')) {
            const upgradeKey = e.target.dataset.upgrade;
            purchaseUpgrade(upgradeKey);
        }
        
        // Modal close buttons
        if (e.target.classList.contains('close-modal')) {
            closeAchievementModal();
        }
        
        // Minigame buttons
        if (e.target.classList.contains('accept-minigame')) {
            const gameId = e.target.parentElement.parentElement.querySelector('.minigame-icon').nextElementSibling.textContent;
            // Find the correct minigame by name
            const minigame = minigames.find(g => g.name === gameId);
            if (minigame) {
                startMinigame(minigame.id);
            }
        }
        
        if (e.target.classList.contains('decline-minigame') || e.target.classList.contains('close-minigame')) {
            closeMinigameModal();
        }
    });
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Case selection and opening functions
function selectCase(caseId) {
    gameState.selectedCase = caseId;
    const selectedCaseData = cases[caseId];
    
    if (selectedCaseName) {
        selectedCaseName.textContent = selectedCaseData.name;
    }
    if (openCaseBtn) {
        openCaseBtn.textContent = `Open Case ($${selectedCaseData.price.toFixed(2)})`;
        
        if (gameState.money < selectedCaseData.price) {
            openCaseBtn.disabled = true;
            openCaseBtn.textContent = `Not enough money! ($${selectedCaseData.price.toFixed(2)})`;
        } else {
            openCaseBtn.disabled = false;
        }
    }
    
    if (caseSelectionSection) caseSelectionSection.style.display = 'none';
    if (caseOpeningSection) caseOpeningSection.style.display = 'block';
    if (rouletteContainer) rouletteContainer.style.display = 'none';
    if (resultContainer) resultContainer.style.display = 'none';
}

function goBackToCases() {
    if (caseSelectionSection) caseSelectionSection.style.display = 'block';
    if (caseOpeningSection) caseOpeningSection.style.display = 'none';
    gameState.selectedCase = null;
}

function openAnotherCase() {
    if (rouletteContainer) rouletteContainer.style.display = 'none';
    if (resultContainer) resultContainer.style.display = 'none';
    if (caseBox) caseBox.classList.remove('opening');
    
    const selectedCaseData = cases[gameState.selectedCase];
    if (openCaseBtn && selectedCaseData) {
        if (gameState.money < selectedCaseData.price) {
            openCaseBtn.disabled = true;
            openCaseBtn.textContent = `Not enough money! ($${selectedCaseData.price.toFixed(2)})`;
        } else {
            openCaseBtn.disabled = false;
            openCaseBtn.textContent = `Open Case ($${selectedCaseData.price.toFixed(2)})`;
        }
    }
}

function getRandomItem(caseItems) {
    const weightedItems = [];
    
    caseItems.forEach(item => {
        const weight = rarityWeights[item.rarity];
        const count = Math.ceil(weight * 100);
        for (let i = 0; i < count; i++) {
            weightedItems.push(item);
        }
    });
    
    const randomIndex = Math.floor(Math.random() * weightedItems.length);
    return weightedItems[randomIndex];
}

function generateRouletteItems(caseItems, winningItem) {
    const items = [];
    const itemCount = 50;
    const winningIndex = Math.floor(itemCount * 0.7) + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < itemCount; i++) {
        if (i === winningIndex) {
            items.push(winningItem);
        } else {
            items.push(getRandomItem(caseItems));
        }
    }
    
    return { items, winningIndex };
}

function createRouletteHTML(items) {
    return items.map(item => `
        <div class="roulette-item ${item.rarity}">
            <div style="font-size: 1.5rem; margin-bottom: 5px;">${item.emoji}</div>
            <div style="font-size: 0.7rem; line-height: 1.2;">${item.name}</div>
            <div style="font-size: 0.6rem; color: #4ECDC4;">$${item.value.toFixed(2)}</div>
        </div>
    `).join('');
}

function animateRoulette(winningIndex) {
    const itemWidth = 100;
    const containerWidth = rouletteContainer ? rouletteContainer.offsetWidth : 800;
    const finalPosition = -(winningIndex * itemWidth - containerWidth / 2 + itemWidth / 2);
    
    if (rouletteTrack) {
        rouletteTrack.style.transform = `translateX(${finalPosition}px)`;
    }
}

async function openCase() {
    if (!gameState.selectedCase) return;
    
    const caseData = cases[gameState.selectedCase];
    
    if (gameState.money < caseData.price) {
        alert(`Not enough money! You need $${caseData.price.toFixed(2)} but only have $${gameState.money.toFixed(2)}`);
        return;
    }
    
    gameState.money -= caseData.price;
    updateStatsDisplay();
    
    if (openCaseBtn) openCaseBtn.disabled = true;
    if (caseBox) caseBox.classList.add('opening');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const winningItem = getRandomItem(caseData.items);
    const { items, winningIndex } = generateRouletteItems(caseData.items, winningItem);
    
    if (rouletteContainer) rouletteContainer.style.display = 'block';
    if (rouletteTrack) rouletteTrack.innerHTML = createRouletteHTML(items);
    
    setTimeout(() => animateRoulette(winningIndex), 100);
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    showResult(winningItem);
    
    gameState.casesOpened++;
    gameState.totalValue += winningItem.value;
    gameState.inventory.push({
        ...winningItem,
        timestamp: Date.now() + Math.random() // Ensure unique timestamp even for rapid consecutive opens
    });
    
    if (!gameState.bestItem || winningItem.value > gameState.bestItem.value) {
        gameState.bestItem = winningItem;
    }
    
    updateStatsDisplay();
    updateInventoryDisplay();
    savePlayerData();
    checkAchievements();
}

function showResult(item) {
    if (resultContainer) resultContainer.style.display = 'block';
    
    const rarityColors = {
        common: 'linear-gradient(45deg, #B0C4DE, #87CEEB)',
        uncommon: 'linear-gradient(45deg, #228B22, #32CD32)',
        rare: 'linear-gradient(45deg, #4682B4, #87CEFA)',
        mythical: 'linear-gradient(45deg, #8A2BE2, #9370DB)',
        legendary: 'linear-gradient(45deg, #FF1493, #FF69B4)',
        ancient: 'linear-gradient(45deg, #FFD700, #FFA500)'
    };
    
    if (resultImage) {
        resultImage.style.background = rarityColors[item.rarity];
        resultImage.textContent = item.emoji;
    }
    if (resultName) resultName.textContent = item.name;
    if (resultRarity) {
        resultRarity.textContent = item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1);
        resultRarity.style.color = getTextColorForRarity(item.rarity);
    }
    if (resultValue) resultValue.textContent = `$${item.value.toFixed(2)}`;
}

function getTextColorForRarity(rarity) {
    const colors = {
        common: '#B0C4DE',
        uncommon: '#32CD32',
        rare: '#4682B4',
        mythical: '#8A2BE2',
        legendary: '#FF1493',
        ancient: '#FFD700'
    };
    return colors[rarity];
}

// Display update functions
function updateStatsDisplay() {
    if (casesOpenedElement) casesOpenedElement.textContent = gameState.casesOpened;
    if (totalValueElement) totalValueElement.textContent = `$${gameState.totalValue.toFixed(2)}`;
    if (bestItemElement) bestItemElement.textContent = gameState.bestItem ? gameState.bestItem.name : 'None';
    if (moneyElement) moneyElement.textContent = `$${gameState.money.toFixed(2)}`;
    
    // Update upgrades display when money changes so buttons reflect current affordability
    updateUpgradesDisplay();
}

function updateInventoryDisplay() {
    if (!inventoryGrid) return;
    
    if (gameState.inventory.length === 0) {
        inventoryGrid.innerHTML = '<p class="empty-inventory">Open some cases to see your items here!</p>';
        return;
    }
    
    const sortedInventory = [...gameState.inventory].sort((a, b) => b.value - a.value);
    
    inventoryGrid.innerHTML = sortedInventory.map((item, index) => {
        // Find the original index in the unsorted inventory array
        const originalIndex = gameState.inventory.findIndex(originalItem => 
            originalItem === item || (
                originalItem.name === item.name && 
                originalItem.value === item.value && 
                originalItem.timestamp === item.timestamp
            )
        );
        
        return `
            <div class="inventory-item">
                <div class="inventory-item-image ${item.rarity}" style="background: ${getBackgroundForRarity(item.rarity)};">
                    ${item.emoji}
                </div>
                <h4>${item.name}</h4>
                <p style="color: ${getTextColorForRarity(item.rarity)};">${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}</p>
                <p class="item-value">$${item.value.toFixed(2)}</p>
                <button class="sell-item-btn" data-index="${originalIndex}" data-timestamp="${item.timestamp}">
                    Sell for $${(item.value * 0.8).toFixed(2)}
                </button>
            </div>
        `;
    }).join('');
}

function getBackgroundForRarity(rarity) {
    const backgrounds = {
        common: 'linear-gradient(45deg, #B0C4DE, #87CEEB)',
        uncommon: 'linear-gradient(45deg, #228B22, #32CD32)',
        rare: 'linear-gradient(45deg, #4682B4, #87CEFA)',
        mythical: 'linear-gradient(45deg, #8A2BE2, #9370DB)',
        legendary: 'linear-gradient(45deg, #FF1493, #FF69B4)',
        ancient: 'linear-gradient(45deg, #FFD700, #FFA500)'
    };
    return backgrounds[rarity];
}

function earnMoney() {
    const earnAmount = Math.random() * 2 + 0.5;
    gameState.money += earnAmount;
    
    if (earnMoneyBtn) {
        earnMoneyBtn.disabled = true;
        earnMoneyBtn.textContent = `+$${earnAmount.toFixed(2)}`;
        
        setTimeout(() => {
            earnMoneyBtn.disabled = false;
            earnMoneyBtn.textContent = '💰 Earn Money';
        }, 1000);
    }
    
    updateStatsDisplay();
    savePlayerData();
    checkAchievements();
}

function sellItem(itemIndex) {
    console.log('Selling item at index:', itemIndex);
    
    if (itemIndex < 0 || itemIndex >= gameState.inventory.length) {
        console.error('Invalid item index:', itemIndex);
        return;
    }
    
    const item = gameState.inventory[itemIndex];
    if (!item) {
        console.error('Item not found at index:', itemIndex);
        return;
    }
    
    const sellPrice = item.value * 0.8;
    
    console.log('Selling item:', item.name, 'for', sellPrice);
    
    gameState.money += sellPrice;
    gameState.totalSold += sellPrice;
    gameState.inventory.splice(itemIndex, 1);
    
    updateStatsDisplay();
    updateInventoryDisplay();
    savePlayerData();
    checkAchievements();
    
    showNotification(`Sold ${item.name} for $${sellPrice.toFixed(2)}!`);
}

// Achievement system
function checkAchievements() {
    achievements.forEach(achievement => {
        if (!gameState.achievements.includes(achievement.id) && achievement.condition()) {
            gameState.achievements.push(achievement.id);
            gameState.money += achievement.reward;
            showAchievementModal(achievement);
            updateStatsDisplay();
            updateAchievementsDisplay();
            savePlayerData();
        }
    });
}

function showAchievementModal(achievement) {
    if (!achievementModal || !achievementModalContent) return;
    
    achievementModalContent.innerHTML = `
        <span class="close-modal" onclick="closeAchievementModal()">&times;</span>
        <div class="achievement-icon">🏆</div>
        <h2>Achievement Unlocked!</h2>
        <h3>${achievement.name}</h3>
        <p>${achievement.description}</p>
        <div class="achievement-reward">
            <span>Reward: $${achievement.reward.toFixed(2)}</span>
        </div>
    `;
    
    achievementModal.style.display = 'block';
}

function closeAchievementModal() {
    if (achievementModal) {
        achievementModal.style.display = 'none';
    }
}

function updateAchievementsDisplay() {
    if (!achievementsGrid) return;
    
    achievementsGrid.innerHTML = achievements.map(achievement => {
        const isUnlocked = gameState.achievements.includes(achievement.id);
        const progress = isUnlocked ? 100 : 0;
        
        return `
            <div class="achievement-item ${isUnlocked ? 'unlocked' : ''}">
                <div class="achievement-icon">${isUnlocked ? '🏆' : '🔒'}</div>
                <div class="achievement-info">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                    <div class="achievement-reward">Reward: $${achievement.reward.toFixed(2)}</div>
                </div>
                <div class="achievement-progress">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Upgrade system
function updateUpgradesDisplay() {
    if (!upgradesGrid) return;
    
    upgradesGrid.innerHTML = Object.entries(upgrades).map(([key, upgrade]) => {
        const currentLevel = gameState.upgrades[key] || 0;
        const isMaxLevel = currentLevel >= upgrade.maxLevel;
        const price = calculateUpgradePrice(key, currentLevel);
        const canAfford = gameState.money >= price;
        const vipDiscount = gameState.upgrades.vipStatus ? 0.9 : 1;
        const finalPrice = price * vipDiscount;
        
        return `
            <div class="upgrade-item ${isMaxLevel ? 'max-level' : ''}">
                <div class="upgrade-icon">${upgrade.icon}</div>
                <div class="upgrade-info">
                    <h4>${upgrade.name}</h4>
                    <p>${upgrade.description}</p>
                    <div class="upgrade-level">Level: ${currentLevel}/${upgrade.maxLevel}</div>
                    ${!isMaxLevel ? `
                        <button class="upgrade-btn ${canAfford ? '' : 'disabled'}" 
                                data-upgrade="${key}" 
                                ${canAfford ? '' : 'disabled'}>
                            Buy for $${finalPrice.toFixed(2)}
                            ${gameState.upgrades.vipStatus ? '<span class="vip-discount">VIP 10% OFF!</span>' : ''}
                        </button>
                    ` : '<div class="max-level-text">MAX LEVEL</div>'}
                </div>
            </div>
        `;
    }).join('');
}

function calculateUpgradePrice(upgradeKey, currentLevel) {
    const upgrade = upgrades[upgradeKey];
    return Math.floor(upgrade.basePrice * Math.pow(1.5, currentLevel));
}

function purchaseUpgrade(upgradeKey) {
    const upgrade = upgrades[upgradeKey];
    const currentLevel = gameState.upgrades[upgradeKey] || 0;
    
    if (currentLevel >= upgrade.maxLevel) return;
    
    const price = calculateUpgradePrice(upgradeKey, currentLevel);
    const vipDiscount = gameState.upgrades.vipStatus ? 0.9 : 1;
    const finalPrice = price * vipDiscount;
    
    if (gameState.money < finalPrice) return;
    
    gameState.money -= finalPrice;
    gameState.upgrades[upgradeKey] = currentLevel + 1;
    
    if (upgradeKey === 'premiumTheme') {
        gameState.theme = 'dark';
        applyTheme();
        updateThemeToggleButton();
    }
    
    updateStatsDisplay();
    updateUpgradesDisplay();
    savePlayerData();
    checkAchievements();
    
    showNotification(`Purchased ${upgrade.name}! Level ${gameState.upgrades[upgradeKey]}`);
}

function applyTheme() {
    const body = document.body;
    if (gameState.theme === 'dark' && gameState.upgrades.premiumTheme) {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }
}

// Theme toggle functionality
function toggleTheme() {
    if (!gameState.upgrades.premiumTheme) {
        showNotification('Purchase the Premium Theme upgrade first!', 'error');
        return;
    }
    
    const body = document.body;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = themeToggleBtn.querySelector('.theme-icon');
    const themeText = themeToggleBtn.querySelector('span:not(.theme-icon)');
    
    if (body.classList.contains('dark-theme')) {
        // Switch to light theme
        body.classList.remove('dark-theme');
        gameState.theme = 'default';
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Theme';
        showNotification('Switched to Light Theme', 'success');
    } else {
        // Switch to dark theme
        body.classList.add('dark-theme');
        gameState.theme = 'dark';
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Theme';
        showNotification('Switched to Dark Theme', 'success');
    }
    
    savePlayerData();
}

function updateThemeToggleButton() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (!themeToggleBtn) return;
    
    if (gameState.upgrades.premiumTheme) {
        themeToggleBtn.disabled = false;
        themeToggleBtn.classList.remove('locked');
        themeToggleBtn.title = 'Toggle between light and dark themes';
        
        // Apply current theme
        if (gameState.theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggleBtn.querySelector('.theme-icon').textContent = '☀️';
            themeToggleBtn.querySelector('span:not(.theme-icon)').textContent = 'Light Theme';
        } else {
            document.body.classList.remove('dark-theme');
            themeToggleBtn.querySelector('.theme-icon').textContent = '🌙';
            themeToggleBtn.querySelector('span:not(.theme-icon)').textContent = 'Dark Theme';
        }
    } else {
        themeToggleBtn.disabled = true;
        themeToggleBtn.classList.add('locked');
        themeToggleBtn.title = 'Purchase Premium Theme upgrade to unlock';
    }
}

// Auto systems
function startAutoClicker() {
    setInterval(() => {
        const autoClickerLevel = gameState.upgrades.autoClicker || 0;
        if (autoClickerLevel > 0) {
            const earnings = upgrades.autoClicker.effect(autoClickerLevel);
            gameState.money += earnings;
            updateStatsDisplay();
            
            if (Math.random() < 0.1) {
                showNotification(`Auto Generator: +$${earnings.toFixed(2)}`);
            }
        }
    }, 1000);
}

function startMinigameTimer() {
    const showMinigame = () => {
        if (Math.random() < 0.3 && gameState.money > 5) {
            const randomGame = minigames[Math.floor(Math.random() * minigames.length)];
            showMinigameOffer(randomGame);
        }
        
        const nextTime = (30 + Math.random() * 90) * 1000;
        setTimeout(showMinigame, nextTime);
    };
    
    setTimeout(showMinigame, 60000);
}

function showMinigameOffer(minigame) {
    if (!minigameModal || !minigameContent) return;
    
    const goldMultiplier = gameState.upgrades.goldMembership ? 2 : 1;
    const finalReward = minigame.reward * goldMultiplier;
    
    minigameContent.innerHTML = `
        <div class="minigame-offer">
            <div class="minigame-icon">${minigame.icon}</div>
            <h3>${minigame.name}</h3>
            <p>${minigame.description}</p>
            <div class="minigame-stakes">
                <div>Entry Fee: $${minigame.entryFee.toFixed(2)}</div>
                <div>Reward: $${finalReward.toFixed(2)} ${goldMultiplier > 1 ? '(Gold Bonus!)' : ''}</div>
            </div>
            <div class="minigame-actions">
                <button onclick="startMinigame('${minigame.id}')" class="accept-minigame">Accept Challenge</button>
                <button onclick="closeMinigameModal()" class="decline-minigame">Decline</button>
            </div>
        </div>
    `;
    
    minigameModal.style.display = 'block';
}

function startMinigame(gameId) {
    const minigame = minigames.find(g => g.id === gameId);
    if (!minigame || gameState.money < minigame.entryFee) {
        closeMinigameModal();
        return;
    }
    
    gameState.money -= minigame.entryFee;
    updateStatsDisplay();
    
    console.log('Starting minigame:', gameId);
    
    // Show the actual minigame interface
    if (minigameContent) {
        switch(gameId) {
            case 'coinFlip':
                showCoinFlipGame(minigame);
                break;
            case 'numberGuess':
                showNumberGuessGame(minigame);
                break;
            case 'reactionTime':
                showReactionTimeGame(minigame);
                break;
            case 'memoryGame':
                showMemoryGame(minigame);
                break;
            case 'ticTacToe':
                showTicTacToeGame(minigame);
                break;
            default:
                // Fallback to simple random game
                setTimeout(() => endMinigame(Math.random() < 0.5, minigame), 2000);
        }
    }
}

function showCoinFlipGame(minigame) {
    if (!minigameContent) return;
    
    minigameContent.innerHTML = `
        <div class="minigame-active">
            <div class="minigame-icon">🪙</div>
            <h3>Coin Flip</h3>
            <p>Call it! Heads or Tails?</p>
            <div class="minigame-buttons">
                <button onclick="playCoinFlip('heads')" class="minigame-choice-btn">🪙 Heads</button>
                <button onclick="playCoinFlip('tails')" class="minigame-choice-btn">🪙 Tails</button>
            </div>
        </div>
    `;
}

function playCoinFlip(choice) {
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = choice === result;
    const minigame = minigames.find(g => g.id === 'coinFlip');
    
    if (minigameContent) {
        minigameContent.innerHTML = `
            <div class="minigame-active">
                <div class="minigame-icon">🪙</div>
                <h3>Coin Flip Result</h3>
                <div class="coin-result">The coin landed on: <strong>${result}</strong></div>
                <p>You chose: <strong>${choice}</strong></p>
                <div class="${won ? 'win' : 'lose'}">${won ? '🎉 You Won!' : '😔 You Lost!'}</div>
            </div>
        `;
    }
    
    setTimeout(() => endMinigame(won, minigame, `The coin landed on ${result}!`), 2000);
}

function showNumberGuessGame(minigame) {
    if (!minigameContent) return;
    
    const targetNumber = Math.floor(Math.random() * 10) + 1;
    window.currentMinigameTarget = targetNumber;
    
    minigameContent.innerHTML = `
        <div class="minigame-active">
            <div class="minigame-icon">🔢</div>
            <h3>Number Guessing</h3>
            <p>Guess the number between 1 and 10!</p>
            <input type="number" id="numberGuessInput" min="1" max="10" placeholder="Enter your guess" class="minigame-input">
            <button onclick="submitNumberGuess()" class="minigame-submit-btn">Submit Guess</button>
        </div>
    `;
}

function submitNumberGuess() {
    const guess = parseInt(document.getElementById('numberGuessInput').value);
    const target = window.currentMinigameTarget;
    const won = guess === target;
    const minigame = minigames.find(g => g.id === 'numberGuess');
    
    if (minigameContent) {
        minigameContent.innerHTML = `
            <div class="minigame-active">
                <div class="minigame-icon">🔢</div>
                <h3>Number Guess Result</h3>
                <div class="number-result">The number was: <strong>${target}</strong></div>
                <p>You guessed: <strong>${guess || 'nothing'}</strong></p>
                <div class="${won ? 'win' : 'lose'}">${won ? '🎉 Correct!' : '😔 Wrong!'}</div>
            </div>
        `;
    }
    
    setTimeout(() => endMinigame(won, minigame, `The number was ${target}!`), 2000);
}

function showReactionTimeGame(minigame) {
    if (!minigameContent) return;
    
    minigameContent.innerHTML = `
        <div class="minigame-active">
            <div class="minigame-icon">⚡</div>
            <h3>Reaction Time Test</h3>
            <p>Wait for the color to change, then click as fast as you can!</p>
            <div id="reactionBox" class="reaction-box red">Wait for it...</div>
        </div>
    `;
    
    const delay = 2000 + Math.random() * 3000; // 2-5 seconds
    window.reactionStartTime = null;
    window.reactionGameActive = false;
    
    setTimeout(() => {
        const box = document.getElementById('reactionBox');
        if (box) {
            box.classList.remove('red');
            box.classList.add('green');
            box.textContent = 'CLICK NOW!';
            window.reactionStartTime = Date.now();
            window.reactionGameActive = true;
            
            box.onclick = () => {
                if (window.reactionGameActive) {
                    const reactionTime = Date.now() - window.reactionStartTime;
                    const won = reactionTime < 500; // Win if clicked within 500ms
                    const minigame = minigames.find(g => g.id === 'reactionTime');
                    
                    box.textContent = `${reactionTime}ms - ${won ? 'Fast!' : 'Too slow!'}`;
                    box.onclick = null;
                    window.reactionGameActive = false;
                    
                    setTimeout(() => endMinigame(won, minigame, `Your reaction time: ${reactionTime}ms`), 2000);
                }
            };
            
            // Auto-lose after 2 seconds
            setTimeout(() => {
                if (window.reactionGameActive) {
                    window.reactionGameActive = false;
                    box.textContent = 'Too slow!';
                    box.onclick = null;
                    const minigame = minigames.find(g => g.id === 'reactionTime');
                    setTimeout(() => endMinigame(false, minigame, 'You were too slow!'), 2000);
                }
            }, 2000);
        }
    }, delay);
}

function showMemoryGame(minigame) {
    if (!minigameContent) return;
    
    const sequence = [];
    for (let i = 0; i < 4; i++) {
        sequence.push(Math.floor(Math.random() * 4));
    }
    
    window.memorySequence = sequence;
    window.memoryPlayerSequence = [];
    window.memoryShowingSequence = true;
    
    minigameContent.innerHTML = `
        <div class="minigame-active">
            <div class="minigame-icon">🧠</div>
            <h3>Memory Challenge</h3>
            <p>Watch the sequence, then repeat it!</p>
            <div class="memory-grid">
                <button class="memory-btn" data-index="0" style="background: red;" onclick="memoryButtonClick(0)">1</button>
                <button class="memory-btn" data-index="1" style="background: blue;" onclick="memoryButtonClick(1)">2</button>
                <button class="memory-btn" data-index="2" style="background: green;" onclick="memoryButtonClick(2)">3</button>
                <button class="memory-btn" data-index="3" style="background: yellow;" onclick="memoryButtonClick(3)">4</button>
            </div>
            <div id="memoryStatus">Watch carefully...</div>
        </div>
    `;
    
    // Show sequence
    showMemorySequence(0);
}

function showMemorySequence(index) {
    if (index >= window.memorySequence.length) {
        window.memoryShowingSequence = false;
        document.getElementById('memoryStatus').textContent = 'Now repeat the sequence!';
        return;
    }
    
    const buttons = document.querySelectorAll('.memory-btn');
    const targetIndex = window.memorySequence[index];
    
    setTimeout(() => {
        buttons[targetIndex].style.opacity = '0.5';
        setTimeout(() => {
            buttons[targetIndex].style.opacity = '1';
            showMemorySequence(index + 1);
        }, 500);
    }, 600);
}

function memoryButtonClick(index) {
    if (window.memoryShowingSequence) return;
    
    window.memoryPlayerSequence.push(index);
    
    const correct = window.memoryPlayerSequence[window.memoryPlayerSequence.length - 1] === 
                   window.memorySequence[window.memoryPlayerSequence.length - 1];
    
    if (!correct) {
        const minigame = minigames.find(g => g.id === 'memoryGame');
        document.getElementById('memoryStatus').textContent = 'Wrong! Game Over!';
        setTimeout(() => endMinigame(false, minigame, 'You got the sequence wrong!'), 1500);
        return;
    }
    
    if (window.memoryPlayerSequence.length === window.memorySequence.length) {
        const minigame = minigames.find(g => g.id === 'memoryGame');
        document.getElementById('memoryStatus').textContent = 'Perfect! You got it right!';
        setTimeout(() => endMinigame(true, minigame, 'You remembered the sequence perfectly!'), 1500);
        return;
    }
    
    document.getElementById('memoryStatus').textContent = `${window.memoryPlayerSequence.length}/${window.memorySequence.length} correct...`;
}

function showTicTacToeGame(minigame) {
    if (!minigameContent) return;
    
    window.ticTacToeBoard = Array(9).fill('');
    window.ticTacToePlayerTurn = true;
    
    minigameContent.innerHTML = `
        <div class="minigame-active">
            <div class="minigame-icon">⭕</div>
            <h3>Tic Tac Toe</h3>
            <p>You are X, beat the AI!</p>
            <div class="tic-tac-toe-grid">
                ${Array(9).fill(0).map((_, i) => 
                    `<button class="tic-tac-toe-btn" onclick="ticTacToeMove(${i})" data-index="${i}"></button>`
                ).join('')}
            </div>
            <div id="ticTacToeStatus">Your turn! Click a square.</div>
        </div>
    `;
}

function ticTacToeMove(index) {
    if (!window.ticTacToePlayerTurn || window.ticTacToeBoard[index] !== '') return;
    
    window.ticTacToeBoard[index] = 'X';
    updateTicTacToeDisplay();
    
    const winner = checkTicTacToeWinner();
    if (winner) {
        const minigame = minigames.find(g => g.id === 'ticTacToe');
        setTimeout(() => endMinigame(winner === 'X', minigame, 
            winner === 'X' ? 'You won!' : winner === 'O' ? 'AI won!' : 'It\'s a tie!'), 1500);
        return;
    }
    
    window.ticTacToePlayerTurn = false;
    document.getElementById('ticTacToeStatus').textContent = 'AI thinking...';
    
    setTimeout(() => {
        // Simple AI: random move
        const availableMoves = window.ticTacToeBoard.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
        if (availableMoves.length > 0) {
            const aiMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            window.ticTacToeBoard[aiMove] = 'O';
            updateTicTacToeDisplay();
            
            const winner = checkTicTacToeWinner();
            if (winner) {
                const minigame = minigames.find(g => g.id === 'ticTacToe');
                setTimeout(() => endMinigame(winner === 'X', minigame, 
                    winner === 'X' ? 'You won!' : winner === 'O' ? 'AI won!' : 'It\'s a tie!'), 1500);
                return;
            }
            
            window.ticTacToePlayerTurn = true;
            document.getElementById('ticTacToeStatus').textContent = 'Your turn!';
        }
    }, 1000);
}

function updateTicTacToeDisplay() {
    const buttons = document.querySelectorAll('.tic-tac-toe-btn');
    buttons.forEach((btn, i) => {
        btn.textContent = window.ticTacToeBoard[i];
        btn.disabled = window.ticTacToeBoard[i] !== '';
    });
}

function checkTicTacToeWinner() {
    const board = window.ticTacToeBoard;
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    
    if (board.every(cell => cell !== '')) {
        return 'tie';
    }
    
    return null;
}

function endMinigame(won, minigame, customMessage = null) {
    const goldMultiplier = gameState.upgrades.goldMembership ? 2 : 1;
    const reward = won ? minigame.reward * goldMultiplier : 0;
    
    if (won) {
        gameState.money += reward;
        gameState.totalMinigamesWon++;
        gameState.minigameStreak++;
    } else {
        gameState.minigameStreak = 0;
    }
    
    const message = customMessage || (won ? `You won $${reward.toFixed(2)}!` : 'Better luck next time!');
    
    if (minigameResult) {
        minigameResult.innerHTML = `
            <div class="minigame-result ${won ? 'win' : 'lose'}">
                <h3>${won ? '🎉 Victory!' : '😔 Defeat'}</h3>
                <p>${message}</p>
                ${won ? `<div class="reward">+$${reward.toFixed(2)}</div>` : ''}
                <button onclick="closeMinigameModal()" class="close-minigame">Continue</button>
            </div>
        `;
    }
    
    updateStatsDisplay();
    savePlayerData();
    checkAchievements();
}

function closeMinigameModal() {
    if (minigameModal) {
        minigameModal.style.display = 'none';
    }
    if (minigameContent) {
        minigameContent.innerHTML = '';
    }
    if (minigameResult) {
        minigameResult.innerHTML = '';
    }
}

// Tutorial system
function startTutorial() {
    console.log('Starting tutorial');
    gameState.tutorialStep = 0;
    gameState.tutorialCompleted = false;
    
    console.log('Tutorial modal element:', tutorialModal);
    if (tutorialModal) {
        tutorialModal.style.display = 'flex';
        console.log('Tutorial modal display set to flex');
    } else {
        console.error('Tutorial modal not found!');
    }
    showTutorialStep();
}

function showTutorialStep() {
    const step = tutorialSteps[gameState.tutorialStep];
    console.log('Showing tutorial step:', gameState.tutorialStep, step);
    console.log('Tutorial elements:', {
        content: !!tutorialContent,
        indicator: !!tutorialStepIndicator,
        prevBtn: !!tutorialPrevBtn,
        nextBtn: !!tutorialNextBtn
    });
    
    if (!step || !tutorialContent || !tutorialStepIndicator) {
        console.error('Missing tutorial elements or step');
        return;
    }
    
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
    });
    
    tutorialStepIndicator.textContent = `Step ${gameState.tutorialStep + 1} of ${tutorialSteps.length}`;
    
    tutorialContent.innerHTML = `
        <h4>${step.title}</h4>
        <p>${step.content}</p>
    `;
    
    if (tutorialPrevBtn) {
        tutorialPrevBtn.disabled = gameState.tutorialStep === 0;
    }
    if (tutorialNextBtn) {
        tutorialNextBtn.textContent = gameState.tutorialStep < tutorialSteps.length - 1 ? 'Next' : 'Finish Tutorial';
    }
    
    if (step.target) {
        const targetElement = document.querySelector(step.target);
        if (targetElement) {
            if (step.action === 'highlight') {
                targetElement.classList.add('tutorial-highlight');
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (step.action === 'scroll') {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
}

function nextTutorialStep() {
    console.log('Next tutorial step called - current step:', gameState.tutorialStep);
    if (gameState.tutorialStep < tutorialSteps.length - 1) {
        gameState.tutorialStep++;
        console.log('Moving to step:', gameState.tutorialStep);
        showTutorialStep();
    } else {
        console.log('Completing tutorial');
        completeTutorial();
    }
}

function previousTutorialStep() {
    console.log('Previous tutorial step called - current step:', gameState.tutorialStep);
    if (gameState.tutorialStep > 0) {
        gameState.tutorialStep--;
        console.log('Moving to step:', gameState.tutorialStep);
        showTutorialStep();
    }
}

function skipTutorial() {
    console.log('Skip tutorial called');
    if (confirm('Are you sure you want to skip the tutorial? You can always restart it later.')) {
        completeTutorial();
    }
}

function completeTutorial() {
    gameState.tutorialCompleted = true;
    gameState.tutorialStep = 0;
    
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
    });
    
    if (tutorialModal) {
        tutorialModal.style.display = 'none';
    }
    
    gameState.money += 5;
    showNotification('Tutorial completed! +$5.00 bonus!', 'success');
    
    updateStatsDisplay();
    savePlayerData();
}

// Utility functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', initGame);

// Add window unload event to save data
window.addEventListener('beforeunload', () => {
    savePlayerData();
});