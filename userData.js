// User Data Management System for CaseCraze
// This file handles all user authentication and data persistence

class UserDataManager {
    constructor() {
        this.storageKey = 'caseCrazeUsers';
        this.currentUserKey = 'caseCrazeCurrentUser';
        this.users = this.loadAllUsers();
        this.currentUser = null;
    }

    loadAllUsers() {
        try {
            const userData = localStorage.getItem(this.storageKey);
            return userData ? JSON.parse(userData) : {};
        } catch (error) {
            console.error('Error loading user data:', error);
            return {};
        }
    }

    saveAllUsers() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.users));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    createUser(username, password) {
        if (this.users[username]) {
            return { success: false, message: 'Username already exists!' };
        }

        if (username.length < 3) {
            return { success: false, message: 'Username must be at least 3 characters!' };
        }

        if (password.length < 4) {
            return { success: false, message: 'Password must be at least 4 characters!' };
        }

        this.users[username] = {
            password: password,
            createdAt: new Date().toISOString(),
            gameState: this.getDefaultGameState()
        };

        this.saveAllUsers();
        return { success: true, message: 'Account created successfully!' };
    }

    authenticateUser(username, password) {
        if (!this.users[username]) {
            return { success: false, message: 'User not found!' };
        }

        if (this.users[username].password !== password) {
            return { success: false, message: 'Incorrect password!' };
        }

        return { success: true, message: 'Login successful!' };
    }

    setCurrentUser(username) {
        if (this.users[username]) {
            this.currentUser = username;
            localStorage.setItem(this.currentUserKey, username);
            return true;
        }
        return false;
    }

    getCurrentUser() {
        if (!this.currentUser) {
            this.currentUser = localStorage.getItem(this.currentUserKey);
        }
        return this.currentUser;
    }

    clearCurrentUser() {
        this.currentUser = null;
        localStorage.removeItem(this.currentUserKey);
    }

    getUserGameState(username) {
        if (this.users[username]) {
            return { ...this.users[username].gameState };
        }
        return this.getDefaultGameState();
    }

    saveUserGameState(username, gameState) {
        if (this.users[username]) {
            this.users[username].gameState = { ...gameState };
            this.users[username].lastSaved = new Date().toISOString();
            this.saveAllUsers();
            return true;
        }
        return false;
    }

    getDefaultGameState() {
        return {
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

    isUserLoggedIn() {
        const currentUser = this.getCurrentUser();
        return currentUser && this.users[currentUser];
    }

    getUserList() {
        return Object.keys(this.users);
    }

    deleteUser(username) {
        if (this.users[username]) {
            delete this.users[username];
            this.saveAllUsers();
            if (this.currentUser === username) {
                this.clearCurrentUser();
            }
            return true;
        }
        return false;
    }
}

// Export the UserDataManager class
window.UserDataManager = UserDataManager;
