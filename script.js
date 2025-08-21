// État du jeu
let gameState = {
    currentStep: 1,
    totalSteps: 3,
    badges: [],
    coins: 0,
    gems: 0,
    musicEnabled: false,
    soundEnabled: true,
    questsCompleted: []
};

// Sons (simulés avec des fonctions pour la démo)
const sounds = {
    click: () => console.log('🔊 Click sound'),
    chestOpen: () => console.log('🔊 Chest opening sound'),
    collect: () => console.log('🔊 Collection sound'),
    badge: () => console.log('🔊 Badge earned sound'),
    hover: () => console.log('🔊 Hover sound'),
    notification: () => console.log('🔊 Notification sound')
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
    updateUI();
});

function initializeGame() {
    // Charger l'état sauvegardé s'il existe
    const savedState = localStorage.getItem('kitInGameState');
    if (savedState) {
        gameState = { ...gameState, ...JSON.parse(savedState) };
    }
    
    // Placer les éléments cachés aléatoirement
    positionSecretElements();
    
    console.log('🎮 Jeu initialisé !');
}

function setupEventListeners() {
    // Coffre au trésor
    const treasureChest = document.getElementById('treasureChest');
    treasureChest.addEventListener('click', openTreasureChest);
    
    // Navigation avec effets sonores
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (gameState.soundEnabled) sounds.hover();
        });
        
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (gameState.soundEnabled) sounds.click();
            
            // Animation de clic
            item.style.transform = 'translateY(2px)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        });
    });
    
    // Sac à dos modal
    const backpackBtn = document.getElementById('backpackBtn');
    const backpackModal = document.getElementById('backpackModal');
    const closeModal = document.querySelector('.close');
    
    backpackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openBackpack();
    });
    
    closeModal.addEventListener('click', () => {
        backpackModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === backpackModal) {
            backpackModal.style.display = 'none';
        }
    });
    
    // Quêtes
    document.querySelectorAll('.quest-item').forEach(quest => {
        quest.addEventListener('click', () => {
            const questNumber = parseInt(quest.dataset.quest);
            handleQuestClick(questNumber);
        });
        
        quest.addEventListener('mouseenter', () => {
            if (gameState.soundEnabled) sounds.hover();
        });
    });
    
    // Éléments cachés
    document.querySelectorAll('.secret-coin').forEach(coin => {
        coin.addEventListener('click', () => collectCoin(coin));
    });
    
    document.querySelectorAll('.secret-gem').forEach(gem => {
        gem.addEventListener('click', () => collectGem(gem));
    });
    
    // Contrôles audio
    document.getElementById('musicToggle').addEventListener('click', toggleMusic);
    document.getElementById('soundToggle').addEventListener('click', toggleSound);
}

function openTreasureChest() {
    const chest = document.getElementById('treasureChest');
    const particles = document.getElementById('particles');
    
    if (chest.classList.contains('opened')) return;
    
    // Animation d'ouverture
    chest.classList.add('opened');
    
    // Son d'ouverture
    if (gameState.soundEnabled) sounds.chestOpen();
    
    // Particules
    createParticles(particles);
    
    // Récompense pour avoir ouvert le coffre
    setTimeout(() => {
        earnBadge('🏴‍☠️', 'Explorateur');
        showNotification('Coffre au trésor ouvert ! Badge "Explorateur" gagné !');
        updateProgress(1);
    }, 1000);
}

function createParticles(container) {
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(particle);
        
        // Nettoyer après l'animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 3000);
    }
}

function handleQuestClick(questNumber) {
    if (gameState.soundEnabled) sounds.click();
    
    // Vérifier si la quête peut être débloquée
    if (questNumber === 1 || gameState.questsCompleted.includes(questNumber - 1)) {
        completeQuest(questNumber);
    } else {
        showNotification('Vous devez d\'abord terminer la quête précédente !');
    }
}

function completeQuest(questNumber) {
    if (gameState.questsCompleted.includes(questNumber)) return;
    
    gameState.questsCompleted.push(questNumber);
    
    // Mettre à jour le statut visuel
    const questStatus = document.getElementById(`quest${questNumber}Status`);
    questStatus.textContent = '✅';
    
    // Récompenses selon la quête
    const rewards = {
        1: { badge: '⚡', name: 'Idéateur', coins: 10 },
        2: { badge: '🗺️', name: 'Planificateur', coins: 15 },
        3: { badge: '🚀', name: 'Entrepreneur', coins: 20 }
    };
    
    const reward = rewards[questNumber];
    if (reward) {
        earnBadge(reward.badge, reward.name);
        gameState.coins += reward.coins;
        
        showNotification(`Quête ${questNumber} terminée ! Badge "${reward.name}" et ${reward.coins} pièces d'or gagnés !`);
        
        if (gameState.soundEnabled) sounds.badge();
    }
    
    // Débloquer la quête suivante
    if (questNumber < gameState.totalSteps) {
        setTimeout(() => {
            const nextQuestStatus = document.getElementById(`quest${questNumber + 1}Status`);
            nextQuestStatus.textContent = '🔓';
            showNotification(`Quête ${questNumber + 1} débloquée !`);
        }, 1500);
    }
    
    updateProgress(questNumber + 1);
    saveGameState();
}

function collectCoin(coinElement) {
    if (coinElement.style.display === 'none') return;
    
    gameState.coins += 5;
    coinElement.style.display = 'none';
    
    // Animation de collecte
    const collectAnimation = document.createElement('div');
    collectAnimation.textContent = '+5 💰';
    collectAnimation.style.position = 'fixed';
    collectAnimation.style.left = coinElement.offsetLeft + 'px';
    collectAnimation.style.top = coinElement.offsetTop + 'px';
    collectAnimation.style.color = '#FFD700';
    collectAnimation.style.fontWeight = 'bold';
    collectAnimation.style.fontSize = '1.2rem';
    collectAnimation.style.pointerEvents = 'none';
    collectAnimation.style.zIndex = '9999';
    collectAnimation.style.animation = 'collectFloat 2s ease-out forwards';
    
    document.body.appendChild(collectAnimation);
    
    setTimeout(() => {
        document.body.removeChild(collectAnimation);
    }, 2000);
    
    if (gameState.soundEnabled) sounds.collect();
    showNotification('Pièce d\'or collectée ! +5 pièces');
    updateUI();
    saveGameState();
}

function collectGem(gemElement) {
    if (gemElement.style.display === 'none') return;
    
    gameState.gems += 1;
    gemElement.style.display = 'none';
    
    // Animation similaire aux pièces
    const collectAnimation = document.createElement('div');
    collectAnimation.textContent = '+1 💎';
    collectAnimation.style.position = 'fixed';
    collectAnimation.style.left = gemElement.offsetLeft + 'px';
    collectAnimation.style.top = gemElement.offsetTop + 'px';
    collectAnimation.style.color = '#FF69B4';
    collectAnimation.style.fontWeight = 'bold';
    collectAnimation.style.fontSize = '1.2rem';
    collectAnimation.style.pointerEvents = 'none';
    collectAnimation.style.zIndex = '9999';
    collectAnimation.style.animation = 'collectFloat 2s ease-out forwards';
    
    document.body.appendChild(collectAnimation);
    
    setTimeout(() => {
        document.body.removeChild(collectAnimation);
    }, 2000);
    
    if (gameState.soundEnabled) sounds.collect();
    showNotification('Gemme rare collectée ! +1 gemme');
    updateUI();
    saveGameState();
}

function earnBadge(icon, name) {
    // Vérifier si le badge n'est pas déjà possédé
    if (gameState.badges.some(badge => badge.name === name)) return;
    
    gameState.badges.push({ icon, name });
    updateUI();
    saveGameState();
}

function openBackpack() {
    const modal = document.getElementById('backpackModal');
    modal.style.display = 'block';
    
    // Mettre à jour le contenu du sac à dos
    updateBackpackContent();
    
    if (gameState.soundEnabled) sounds.click();
}

function updateBackpackContent() {
    const badgesContainer = document.getElementById('badgesContainer');
    const coinCount = document.getElementById('coinCount');
    const gemCount = document.getElementById('gemCount');
    
    // Vider et remplir les badges
    badgesContainer.innerHTML = '';
    gameState.badges.forEach(badge => {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge';
        badgeElement.textContent = badge.icon;
        badgeElement.title = badge.name;
        badgesContainer.appendChild(badgeElement);
    });
    
    // Si aucun badge
    if (gameState.badges.length === 0) {
        badgesContainer.innerHTML = '<p style="color: #666; font-style: italic;">Aucun badge gagné pour le moment...</p>';
    }
    
    // Mettre à jour les compteurs
    coinCount.textContent = gameState.coins;
    gemCount.textContent = gameState.gems;
}

function updateProgress(step) {
    gameState.currentStep = Math.min(step, gameState.totalSteps);
    
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    const percentage = (gameState.currentStep / gameState.totalSteps) * 100;
    progressBar.style.setProperty('--progress', percentage + '%');
    
    const stepNames = [
        'L\'Aventure commence',
        'L\'Étincelle de l\'Idée',
        'La Carte au Trésor du Projet',
        'Le Grand Départ'
    ];
    
    progressText.textContent = `Étape ${gameState.currentStep}/${gameState.totalSteps} : ${stepNames[gameState.currentStep] || 'Aventure terminée !'}`;
}

function updateUI() {
    // Mettre à jour le compteur de badges
    const badgeCounter = document.getElementById('badgeCounter');
    badgeCounter.textContent = gameState.badges.length;
    
    // Mettre à jour la barre de progression
    updateProgress(gameState.currentStep);
    
    // Mettre à jour les boutons audio
    const musicBtn = document.getElementById('musicToggle');
    const soundBtn = document.getElementById('soundToggle');
    
    musicBtn.classList.toggle('muted', !gameState.musicEnabled);
    soundBtn.classList.toggle('muted', !gameState.soundEnabled);
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    if (gameState.soundEnabled) sounds.notification();
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function toggleMusic() {
    gameState.musicEnabled = !gameState.musicEnabled;
    const musicBtn = document.getElementById('musicToggle');
    
    if (gameState.musicEnabled) {
        // Ici on démarrerait la musique de fond
        console.log('🎵 Musique activée');
    } else {
        // Ici on arrêterait la musique
        console.log('🎵 Musique désactivée');
    }
    
    updateUI();
    saveGameState();
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    updateUI();
    saveGameState();
    
    if (gameState.soundEnabled) {
        showNotification('Effets sonores activés');
    } else {
        showNotification('Effets sonores désactivés');
    }
}

function positionSecretElements() {
    // Repositionner aléatoirement les éléments cachés
    const coins = document.querySelectorAll('.secret-coin');
    const gems = document.querySelectorAll('.secret-gem');
    
    coins.forEach((coin, index) => {
        const x = Math.random() * (window.innerWidth - 100) + 50;
        const y = Math.random() * (window.innerHeight - 200) + 200;
        coin.style.left = x + 'px';
        coin.style.top = y + 'px';
    });
    
    gems.forEach(gem => {
        const x = Math.random() * (window.innerWidth - 100) + 50;
        const y = Math.random() * (window.innerHeight - 200) + 200;
        gem.style.left = x + 'px';
        gem.style.top = y + 'px';
    });
}

function saveGameState() {
    localStorage.setItem('kitInGameState', JSON.stringify(gameState));
}

// Ajout des styles CSS pour l'animation de collecte
const style = document.createElement('style');
style.textContent = `
    @keyframes collectFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-80px) scale(1.2);
        }
    }
`;
document.head.appendChild(style);

// Easter eggs et interactions spéciales
document.addEventListener('keydown', function(e) {
    // Konami Code pour débloquer un badge secret
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    if (!window.konamiProgress) window.konamiProgress = 0;
    
    if (e.code === konamiCode[window.konamiProgress]) {
        window.konamiProgress++;
        if (window.konamiProgress === konamiCode.length) {
            earnBadge('🎮', 'Maître du Code');
            showNotification('Code Konami activé ! Badge secret "Maître du Code" débloqué !');
            gameState.coins += 100;
            updateUI();
            window.konamiProgress = 0;
        }
    } else {
        window.konamiProgress = 0;
    }
});

// Effet de parallaxe subtil sur le scroll
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.treasure-chest');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

console.log('🎮 Script KIT IN chargé avec succès !');
console.log('💡 Astuce : Essayez de trouver tous les éléments cachés sur la page !');
console.log('🎯 Objectif : Complétez toutes les quêtes pour devenir un vrai entrepreneur !');
