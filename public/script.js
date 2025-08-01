// Gestion des onglets
document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    // Désactiver tous les onglets
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Activer l'onglet sélectionné
    button.classList.add('active');
    const tabId = button.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
    
    // Charger les données si nécessaire
    if (tabId === 'my-characters') loadMyCharacters();
    if (tabId === 'all-characters') loadAllCharacters();
    if (tabId === 'logs') loadBattleLogs();
    if (tabId === 'admin' && isAdmin) loadAdminCharacters();
  });
});

// Générer un ID utilisateur unique
function getUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
    
    // Créer l'utilisateur dans la base de données
    fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(user => {
      document.getElementById('user-role').textContent = user.role;
    });
  }
  return userId;
}

const userId = getUserId();
let isAdmin = false;

// Charger les informations utilisateur
function loadUserInfo() {
  fetch(`/api/user?userId=${userId}`)
    .then(response => response.json())
    .then(user => {
      if (user) {
        document.getElementById('user-role').textContent = user.role;
      }
    });
}

// Charger mes personnages
function loadMyCharacters() {
  fetch(`/api/characters/user/${userId}`)
    .then(response => response.json())
    .then(characters => {
      const container = document.getElementById('my-character-list');
      container.innerHTML = '';
      
      if (characters.length === 0) {
        container.innerHTML = '<p>Aucun personnage créé. Générez votre premier personnage!</p>';
        return;
      }
      
      characters.forEach(character => {
        container.appendChild(createCharacterCard(character));
      });
      
      // Vérifier le minuteur de génération
      checkGenerationTimer();
    });
}

// Charger tous les personnages
let allCharactersPage = 1;
const charactersPerPage = 12;

function loadAllCharacters(page = 1) {
  fetch(`/api/characters/all?page=${page}&limit=${charactersPerPage}`)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('all-character-list');
      container.innerHTML = '';
      
      if (data.characters.length === 0) {
        container.innerHTML = '<p>Aucun personnage trouvé.</p>';
        return;
      }
      
      data.characters.forEach(character => {
        container.appendChild(createCharacterCard(character, false));
      });
      
      // Mettre à jour la pagination
      allCharactersPage = page;
      document.getElementById('current-page').textContent = page;
      document.getElementById('prev-page').disabled = page === 1;
      document.getElementById('next-page').disabled = page * charactersPerPage >= data.total;
    });
}

// Créer une carte de personnage
function createCharacterCard(character, showActions = true) {
  const card = document.createElement('div');
  card.className = 'character-card';
  if (character.isShiny) card.classList.add('shiny');
  
  const winRate = character.battles > 0 
    ? ((character.wins / character.battles) * 100).toFixed(1) 
    : 0;
  
  card.innerHTML = `
    <h3>${character.name}</h3>
    <p><strong>Race:</strong> ${character.subRace}</p>
    <div class="character-stats">
      <div>
        <p><strong>Dégâts:</strong> ${character.damage}</p>
        <div class="stat-bar"><div class="stat-fill" style="width: ${Math.min(character.damage / 5, 100)}%"></div></div>
      </div>
      <div>
        <p><strong>Vie:</strong> ${character.health}</p>
        <div class="stat-bar"><div class="stat-fill" style="width: ${Math.min(character.health / 50, 100)}%"></div></div>
      </div>
      <div>
        <p><strong>ELO:</strong> ${character.elo}</p>
        <div class="stat-bar"><div class="stat-fill" style="width: ${Math.min(character.elo / 20, 100)}%"></div></div>
      </div>
      <div>
        <p><strong>Arme:</strong> ${character.weapon}</p>
      </div>
      <div>
        <p><strong>Combats:</strong> ${character.battles}</p>
      </div>
      <div>
        <p><strong>Victoires:</strong> ${winRate}%</p>
      </div>
    </div>
  `;
  
  if (showActions) {
    const actions = document.createElement('div');
    actions.className = 'character-actions';
    actions.innerHTML = `
      <button class="view-details" data-id="${character._id}">Détails</button>
    `;
    card.appendChild(actions);
  }
  
  return card;
}

// Gestion de la génération de personnages
document.getElementById('generate-character').addEventListener('click', () => {
  fetch('/api/characters/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  })
  .then(response => response.json())
  .then(character => {
    if (character.message) {
      alert(character.message);
    } else {
      loadMyCharacters();
      alert(`Nouveau personnage créé: ${character.name} (${character.subRace})`);
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
    alert('Erreur lors de la création du personnage');
  });
});

// Vérifier le minuteur de génération
function checkGenerationTimer() {
  fetch(`/api/user?userId=${userId}`)
    .then(response => response.json())
    .then(user => {
      const now = new Date();
      const lastCreation = new Date(user.lastCharacterCreated);
      const diffHours = (now - lastCreation) / (1000 * 60 * 60);
      
      const timerElement = document.getElementById('generate-timer');
      
      if (diffHours < 1) {
        const remainingMinutes = Math.ceil(60 - (diffHours * 60));
        timerElement.innerHTML = `<p>Prochaine génération dans: ${remainingMinutes} minutes</p>`;
        document.getElementById('generate-character').disabled = true;
      } else {
        timerElement.innerHTML = '';
        document.getElementById('generate-character').disabled = false;
      }
    });
}

// Initialisation
loadUserInfo();
loadMyCharacters();

// Pagination pour tous les personnages
document.getElementById('prev-page').addEventListener('click', () => {
  if (allCharactersPage > 1) {
    loadAllCharacters(allCharactersPage - 1);
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  loadAllCharacters(allCharactersPage + 1);
});

// Recherche de personnages
document.getElementById('search-btn').addEventListener('click', () => {
  const searchTerm = document.getElementById('search-input').value;
  fetch(`/api/characters/search?term=${searchTerm}`)
    .then(response => response.json())
    .then(characters => {
      const container = document.getElementById('all-character-list');
      container.innerHTML = '';
      
      if (characters.length === 0) {
        container.innerHTML = '<p>Aucun personnage trouvé.</p>';
        return;
      }
      
      characters.forEach(character => {
        container.appendChild(createCharacterCard(character, false));
      });
    });
});

// Gestion de la zone admin
document.getElementById('admin-login-btn').addEventListener('click', () => {
  const password = document.getElementById('admin-password').value;
  if (password === 'kikoukillian25507') {
    isAdmin = true;
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadAdminCharacters();
  } else {
    alert('Mot de passe incorrect');
  }
});

// Charger les personnages pour l'admin
function loadAdminCharacters() {
  fetch('/api/characters/all')
    .then(response => response.json())
    .then(characters => {
      const container = document.getElementById('admin-character-list');
      container.innerHTML = '';
      
      characters.forEach(character => {
        const charElement = document.createElement('div');
        charElement.className = 'character-card';
        charElement.innerHTML = `
          <h3>${character.name}</h3>
          <p>${character.subRace} | ELO: ${character.elo}</p>
          <button class="edit-character" data-id="${character._id}">Modifier</button>
          <button class="delete-character" data-id="${character._id}">Supprimer</button>
        `;
        container.appendChild(charElement);
      });
    });
}

// Initialiser la gestion des combats
initBattleSystem();

function initBattleSystem() {
  // Charger les personnages de l'utilisateur pour le combat
  fetch(`/api/characters/user/${userId}`)
    .then(response => response.json())
    .then(characters => {
      const container = document.getElementById('battle-character-select');
      container.innerHTML = '';
      
      characters.forEach(character => {
        const charElement = document.createElement('div');
        charElement.className = 'character-card';
        charElement.dataset.id = character._id;
        charElement.innerHTML = `
          <h3>${character.name}</h3>
          <p>${character.subRace}</p>
          <p>Dégâts: ${character.damage} | Vie: ${character.health}</p>
          <p>ELO: ${character.elo}</p>
        `;
        charElement.addEventListener('click', () => {
          document.querySelectorAll('#battle-character-select .character-card').forEach(card => {
            card.classList.remove('selected');
          });
          charElement.classList.add('selected');
        });
        container.appendChild(charElement);
      });
    });
  
  // Gestion du bouton de combat
  document.getElementById('start-battle').addEventListener('click', async () => {
    const selected = document.querySelector('#battle-character-select .character-card.selected');
    if (!selected) {
      alert('Veuillez sélectionner un personnage');
      return;
    }
    
    const characterId = selected.dataset.id;
    
    // Vérifier si l'utilisateur peut combattre
    const battleResponse = await fetch(`/api/battles/can-battle?userId=${userId}`);
    const battleData = await battleResponse.json();
    
    if (!battleData.canBattle) {
      alert(`Vous ne pouvez pas combattre maintenant. ${battleData.message}`);
      return;
    }
    
    // Lancer le combat
    fetch('/api/battles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterId })
    })
    .then(response => response.json())
    .then(battleResult => {
      // Afficher le résultat du combat
      const resultContainer = document.getElementById('battle-result');
      resultContainer.innerHTML = `
        <h3>Résultat du combat</h3>
        <p>${battleResult.details}</p>
        <p>Votre personnage: ${battleResult.newElo} ELO (${battleResult.eloChange > 0 ? '+' : ''}${battleResult.eloChange})</p>
      `;
      
      // Recharger les informations
      loadMyCharacters();
      loadBattleLogs();
      initBattleSystem();
    });
  });
}

// Charger les journaux de combat
function loadBattleLogs() {
  fetch(`/api/battles/logs?userId=${userId}`)
    .then(response => response.json())
    .then(logs => {
      const container = document.getElementById('battle-logs');
      container.innerHTML = '';
      
      if (logs.length === 0) {
        container.innerHTML = '<p>Aucun combat enregistré.</p>';
        return;
      }
      
      logs.forEach(log => {
        const logElement = document.createElement('div');
        logElement.className = 'battle-log';
        logElement.innerHTML = `
          <p><strong>${new Date(log.timestamp).toLocaleString()}</strong></p>
          <p>${log.details}</p>
          <p>Résultat: ${log.result === 'win' ? 'Victoire' : 'Défaite'} | Changement ELO: ${log.eloChange > 0 ? '+' : ''}${log.eloChange}</p>
        `;
        container.appendChild(logElement);
      });
    });
}

// Au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
  loadUserInfo();
  loadMyCharacters();
  checkGenerationTimer();
});