// Game state
let gameState = {
    casesOpened: 0,
    totalValue: 0,
    bestItem: null,
    selectedCase: null,
    inventory: [],
    money: 10.00 // Starting loan of $10
};

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

// DOM elements
const caseSelectionSection = document.querySelector('.case-selection');
const caseOpeningSection = document.getElementById('caseOpening');
const inventorySection = document.querySelector('.inventory');
const selectedCaseName = document.getElementById('selectedCaseName');
const openCaseBtn = document.getElementById('openCaseBtn');
const backBtn = document.getElementById('backBtn');
const rouletteContainer = document.getElementById('rouletteContainer');
const rouletteTrack = document.getElementById('rouletteTrack');
const resultContainer = document.getElementById('resultContainer');
const caseBox = document.getElementById('caseBox');

// Stats elements
const casesOpenedElement = document.getElementById('casesOpened');
const totalValueElement = document.getElementById('totalValue');
const bestItemElement = document.getElementById('bestItem');
const moneyElement = document.getElementById('money');

// Result elements
const resultImage = document.getElementById('resultImage');
const resultName = document.getElementById('resultName');
const resultRarity = document.getElementById('resultRarity');
const resultValue = document.getElementById('resultValue');
const openAnotherBtn = document.getElementById('openAnotherBtn');
const changeCaseBtn = document.getElementById('changeCaseBtn');

// Inventory element
const inventoryGrid = document.getElementById('inventoryGrid');

// Money earning elements
const earnMoneyBtn = document.getElementById('earnMoneyBtn');

// Initialize the game
function initGame() {
    setupEventListeners();
    loadGameState();
    updateStatsDisplay();
    updateInventoryDisplay();
}

// Setup event listeners
function setupEventListeners() {
    // Case selection buttons
    document.querySelectorAll('.select-case-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectCase(e.target.dataset.case);
        });
    });

    // Open case button
    openCaseBtn.addEventListener('click', openCase);

    // Back button
    backBtn.addEventListener('click', goBackToCases);

    // Result action buttons
    openAnotherBtn.addEventListener('click', openAnotherCase);
    changeCaseBtn.addEventListener('click', goBackToCases);

    // Earn money button
    earnMoneyBtn.addEventListener('click', earnMoney);
}

// Select a case
function selectCase(caseId) {
    gameState.selectedCase = caseId;
    const selectedCaseData = cases[caseId];
    
    selectedCaseName.textContent = selectedCaseData.name;
    openCaseBtn.textContent = `Open Case ($${selectedCaseData.price.toFixed(2)})`;
    
    // Check if player has enough money
    if (gameState.money < selectedCaseData.price) {
        openCaseBtn.disabled = true;
        openCaseBtn.textContent = `Not enough money! ($${selectedCaseData.price.toFixed(2)})`;
    } else {
        openCaseBtn.disabled = false;
    }
    
    caseSelectionSection.style.display = 'none';
    caseOpeningSection.style.display = 'block';
    rouletteContainer.style.display = 'none';
    resultContainer.style.display = 'none';
}

// Go back to case selection
function goBackToCases() {
    caseSelectionSection.style.display = 'block';
    caseOpeningSection.style.display = 'none';
    gameState.selectedCase = null;
}

// Open another case of the same type
function openAnotherCase() {
    rouletteContainer.style.display = 'none';
    resultContainer.style.display = 'none';
    caseBox.classList.remove('opening');
    
    // Check if player has enough money for another case
    const selectedCaseData = cases[gameState.selectedCase];
    if (gameState.money < selectedCaseData.price) {
        openCaseBtn.disabled = true;
        openCaseBtn.textContent = `Not enough money! ($${selectedCaseData.price.toFixed(2)})`;
    } else {
        openCaseBtn.disabled = false;
        openCaseBtn.textContent = `Open Case ($${selectedCaseData.price.toFixed(2)})`;
    }
}

// Get random item based on rarity weights
function getRandomItem(caseItems) {
    // Create weighted array
    const weightedItems = [];
    
    caseItems.forEach(item => {
        const weight = rarityWeights[item.rarity];
        const count = Math.ceil(weight * 100); // Scale up for better distribution
        for (let i = 0; i < count; i++) {
            weightedItems.push(item);
        }
    });
    
    // Select random item
    const randomIndex = Math.floor(Math.random() * weightedItems.length);
    return weightedItems[randomIndex];
}

// Generate roulette items
function generateRouletteItems(caseItems, winningItem) {
    const items = [];
    const itemCount = 50; // Total items in roulette
    const winningIndex = Math.floor(itemCount * 0.7) + Math.floor(Math.random() * 10); // Winning item position
    
    for (let i = 0; i < itemCount; i++) {
        if (i === winningIndex) {
            items.push(winningItem);
        } else {
            items.push(getRandomItem(caseItems));
        }
    }
    
    return { items, winningIndex };
}

// Create roulette HTML
function createRouletteHTML(items) {
    return items.map(item => `
        <div class="roulette-item ${item.rarity}">
            <div style="font-size: 1.5rem; margin-bottom: 5px;">${item.emoji}</div>
            <div style="font-size: 0.7rem; line-height: 1.2;">${item.name}</div>
            <div style="font-size: 0.6rem; color: #4ECDC4;">$${item.value.toFixed(2)}</div>
        </div>
    `).join('');
}

// Animate roulette
function animateRoulette(winningIndex) {
    const itemWidth = 100; // Width of each roulette item
    const containerWidth = rouletteContainer.offsetWidth;
    const finalPosition = -(winningIndex * itemWidth - containerWidth / 2 + itemWidth / 2);
    
    rouletteTrack.style.transform = `translateX(${finalPosition}px)`;
}

// Open case animation and logic
async function openCase() {
    if (!gameState.selectedCase) return;
    
    const caseData = cases[gameState.selectedCase];
    
    // Check if player has enough money
    if (gameState.money < caseData.price) {
        alert(`Not enough money! You need $${caseData.price.toFixed(2)} but only have $${gameState.money.toFixed(2)}`);
        return;
    }
    
    // Deduct money
    gameState.money -= caseData.price;
    updateStatsDisplay();
    
    openCaseBtn.disabled = true;
    
    // Case opening animation
    caseBox.classList.add('opening');
    
    // Wait for case animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get winning item
    const winningItem = getRandomItem(caseData.items);
    
    // Generate roulette items
    const { items, winningIndex } = generateRouletteItems(caseData.items, winningItem);
    
    // Show roulette
    rouletteContainer.style.display = 'block';
    rouletteTrack.innerHTML = createRouletteHTML(items);
    
    // Start roulette animation
    setTimeout(() => {
        animateRoulette(winningIndex);
    }, 100);
    
    // Wait for roulette animation
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    // Show result
    showResult(winningItem);
    
    // Update game state
    gameState.casesOpened++;
    gameState.totalValue += winningItem.value;
    gameState.inventory.push({
        ...winningItem,
        timestamp: Date.now()
    });
    
    // Update best item
    if (!gameState.bestItem || winningItem.value > gameState.bestItem.value) {
        gameState.bestItem = winningItem;
    }
    
    // Update displays
    updateStatsDisplay();
    updateInventoryDisplay();
    saveGameState();
}

// Show result
function showResult(item) {
    resultContainer.style.display = 'block';
    
    // Set item image background based on rarity
    const rarityColors = {
        common: 'linear-gradient(45deg, #B0C4DE, #87CEEB)',
        uncommon: 'linear-gradient(45deg, #228B22, #32CD32)',
        rare: 'linear-gradient(45deg, #4682B4, #87CEFA)',
        mythical: 'linear-gradient(45deg, #8A2BE2, #9370DB)',
        legendary: 'linear-gradient(45deg, #FF1493, #FF69B4)',
        ancient: 'linear-gradient(45deg, #FFD700, #FFA500)'
    };
    
    resultImage.style.background = rarityColors[item.rarity];
    resultImage.textContent = item.emoji;
    resultName.textContent = item.name;
    resultRarity.textContent = item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1);
    resultRarity.style.color = getTextColorForRarity(item.rarity);
    resultValue.textContent = `$${item.value.toFixed(2)}`;
}

// Get text color for rarity
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

// Update stats display
function updateStatsDisplay() {
    casesOpenedElement.textContent = gameState.casesOpened;
    totalValueElement.textContent = `$${gameState.totalValue.toFixed(2)}`;
    bestItemElement.textContent = gameState.bestItem ? gameState.bestItem.name : 'None';
    moneyElement.textContent = `$${gameState.money.toFixed(2)}`;
}

// Update inventory display
function updateInventoryDisplay() {
    if (gameState.inventory.length === 0) {
        inventoryGrid.innerHTML = '<p class="empty-inventory">Open some cases to see your items here!</p>';
        return;
    }
    
    // Sort inventory by value (highest first)
    const sortedInventory = [...gameState.inventory].sort((a, b) => b.value - a.value);
    
    inventoryGrid.innerHTML = sortedInventory.map(item => `
        <div class="inventory-item">
            <div class="inventory-item-image ${item.rarity}" style="background: ${getBackgroundForRarity(item.rarity)};">
                ${item.emoji}
            </div>
            <h4>${item.name}</h4>
            <p style="color: ${getTextColorForRarity(item.rarity)};">${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}</p>
            <p class="item-value">$${item.value.toFixed(2)}</p>
        </div>
    `).join('');
}

// Get background for rarity
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

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('caseCrazeGameState', JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('caseCrazeGameState');
    if (saved) {
        gameState = { ...gameState, ...JSON.parse(saved) };
    }
}

// Earn money function
function earnMoney() {
    const earnAmount = Math.random() * 2 + 0.5; // Random amount between $0.50 and $2.50
    gameState.money += earnAmount;
    
    // Visual feedback
    earnMoneyBtn.disabled = true;
    earnMoneyBtn.textContent = `+$${earnAmount.toFixed(2)}`;
    
    // Re-enable button after 1 second
    setTimeout(() => {
        earnMoneyBtn.disabled = false;
        earnMoneyBtn.textContent = '💰 Earn Money';
    }, 1000);
    
    updateStatsDisplay();
    saveGameState();
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', initGame);
