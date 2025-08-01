// utils/characterGenerator.js
const races = {
  'Elfes': { prob: 30, subraces: { 'Elfe noir': 25, 'Elfe normal': 60 } },
  'Hauts Elfes': { prob: 15, subraces: { 'Haut elfe noir': 25, 'Haut elfe normal': 60 } },
  'Orques': { prob: 33, subraces: { 'Orques Guerriers': 25, 'Orques chaman': 35 } },
  'Humains': { prob: 60, subraces: { 'Viking': 35, 'Noble': 20, 'Roi': 15, 'Chevalier': 25 } },
  'Dragon': { prob: 5, subraces: { 'Dragon de feu': 20, 'Dragon normal': 50, 'Dragon ténèbre': 15 } },
  'Fantômes': { prob: 32, subraces: { 'Fantôme vengeur': 40, 'Fantôme errant': 35, 'Fantôme protecteur': 25 } },
  'Dieux': { prob: 1, subraces: { 'Dieu de la guerre': 30, 'dieu du temp': 3, 'Dieu de la mort': 1, 'dieux normal': 70 } },
  'Fée': { prob: 50, subraces: { 'Fée des bois': 40, 'Fée des eaux': 35, 'Fée des vents': 25 } },
  'Centaure': { prob: 38, subraces: { 'Centaure archer': 45, 'Centaure guerrier': 15 } },
  'Trolls': { prob: 30, subraces: { 'Troll des montagnes': 50, 'Troll des cavernes': 30, 'Troll des marais': 20 } },
  'Géant': { prob: 20, subraces: { 'Géant de feu': 15, 'Géant de glace': 35, 'Géant de pierre': 45 } },
  'Ogres': { prob: 29, subraces: { 'Ogre des forêts': 45, 'Ogre des collines': 35, 'Ogre des marais': 20 } },
  'Nains': { prob: 45, subraces: { 'Nain des montagnes': 50, 'Nain des mines': 30, 'Nain des forges': 20 } },
  'Cyclope': { prob: 27, subraces: { 'Cyclope des montagnes': 50, 'Cyclope des plaines': 30, 'Cyclope marin': 20 } },
  'Anges': { prob: 4, subraces: { 'Ange de lumière': 40, 'Ange déchu': 15, 'ange normaux': 70 } },
  'Démons': { prob: 3, subraces: { 'Démon seigneur': 10, 'Démon prince': 30, 'Démon noble': 50 } },
  'Vampires': { prob: 11, subraces: { 'Vampire noble': 50, 'Vampire seigneur': 30, 'Vampire jeune': 70 } },
  'Loup-Garous': { prob: 32, subraces: { 'Loup-Garou alpha': 20, 'Loup-Garou beta': 60, 'Loup-Garou oméga': 35 } },
  'Sayan': { prob: 0.01, subraces: { 
    'Sayan basique': 60, 
    'Super sayan 1': 30, 
    'Super sayan 2': 15, 
    'Super sayan 3': 2, 
    'Super sayan god': 0.5, 
    'Super sayan Blue': 0.1, 
    'Sayan Ultra Instinct': 0.01 
  }},
  'Clan Uchiha': { prob: 10, subraces: { 
    'Uchiha normal': 60, 
    'Huchiha sharingan': 30, 
    'Uchiha Mangekyô sharingan': 15, 
    'Uchiha susano': 7 
  }},
  'fourmis chimère': { prob: 6, subraces: { 
    'fourmis normal': 60, 
    'Lieutenant fourmis': 30, 
    'commandant fourmis': 15, 
    'garde royal fourmis': 7, 
    'Roi des fourmis': 0.1 
  }}
};

const weapons = [
  { name: 'rien', prob: 70, bonus: 0 },
  { name: 'épée Normal', prob: 50, bonus: 30 },
  { name: 'épée Royale', prob: 11, bonus: 100 },
  { name: 'épée Démoniaque', prob: 6, bonus: 300 },
  { name: 'épée du néant', prob: 1, bonus: 600 },
  { name: 'Dague Rouillée', prob: 60, bonus: 10 },
  { name: 'Hache de Chêne', prob: 35, bonus: 40 },
  { name: 'Lame d’Argent', prob: 20, bonus: 75 },
  { name: 'Lance Céleste', prob: 8, bonus: 150 },
  { name: 'Trident Sanguinaire', prob: 4, bonus: 250 },
  { name: 'Marteau du Jugement', prob: 2, bonus: 500 },
  { name: 'Lame Éternelle', prob: 0.5, bonus: 1000 },
  { name: 'Arme Maudite Instable', prob: 1.5, bonus: 300 },
  { name: 'Arc du Temps Brisé', prob: 3, bonus: 120 },
  { name: 'Gants du Néant', prob: 2.5, bonus: 80 }
];

// Fonction pour choisir un élément basé sur les probabilités
function chooseByProbability(options) {
  const total = Object.values(options).reduce((sum, prob) => sum + prob, 0);
  let rand = Math.random() * total;
  
  for (const [key, prob] of Object.entries(options)) {
    rand -= prob;
    if (rand <= 0) return key;
  }
  
  return Object.keys(options)[0];
}

// Fonction pour générer une valeur avec distribution décroissante
function generateValue(min, max, baseProb) {
  let value = min;
  let currentProb = baseProb;
  let rand = Math.random() * 100;
  
  for (let i = min; i <= max; i++) {
    if (rand <= currentProb) {
      value = i;
      break;
    }
    rand -= currentProb;
    currentProb *= 0.9; // Réduction progressive
  }
  
  return value;
}

// Statistiques par sous-race
const stats = {
  // Elfes
  'Elfes': { dmg: [40, 65, 40], hp: [200, 300, 60] },
  'Elfe noir': { dmg: [95, 130, 95], hp: [450, 600, 60] },
  'Elfe normal': { dmg: [40, 65, 40], hp: [200, 300, 60] },
  
  // Hauts Elfes
  'Hauts Elfes': { dmg: [120, 160, 70], hp: [350, 500, 60] },
  'Haut elfe noir': { dmg: [150, 200, 70], hp: [400, 550, 60] },
  'Haut elfe normal': { dmg: [120, 160, 70], hp: [350, 500, 60] },
  
  // Orques
  'Orques': { dmg: [35, 60, 60], hp: [250, 400, 60] },
  'Orques Guerriers': { dmg: [90, 120, 60], hp: [500, 650, 60] },
  'Orques chaman': { dmg: [87, 117, 60], hp: [480, 620, 60] },
  
  // Humains
  'Humains': { dmg: [11, 28, 60], hp: [100, 200, 60] },
  'Viking': { dmg: [13, 33, 60], hp: [120, 220, 60] },
  'Noble': { dmg: [85, 115, 60], hp: [400, 500, 60] },
  'Roi': { dmg: [95, 125, 60], hp: [500, 600, 60] },
  'Chevalier': { dmg: [90, 110, 60], hp: [450, 550, 60] },
  
  // Dragons
  'Dragon': { dmg: [170, 220, 60], hp: [1000, 1200, 60] },
  'Dragon de feu': { dmg: [200, 245, 60], hp: [1200, 1500, 60] },
  'Dragon normal': { dmg: [170, 220, 60], hp: [1000, 1200, 60] },
  'Dragon ténèbre': { dmg: [250, 285, 60], hp: [1500, 1800, 60] },
  
  // Fantômes
  'Fantômes': { dmg: [33, 55, 60], hp: [200, 300, 60] },
  'Fantôme vengeur': { dmg: [34, 56, 60], hp: [210, 310, 60] },
  'Fantôme errant': { dmg: [35, 57, 60], hp: [220, 320, 60] },
  'Fantôme protecteur': { dmg: [45, 68, 60], hp: [240, 350, 60] },
  
  // Dieux
  'Dieux': { dmg: [240, 275, 60], hp: [2000, 2500, 60] },
  'Dieu de la guerre': { dmg: [250, 285, 60], hp: [2200, 2700, 60] },
  'dieu du temp': { dmg: [350, 380, 60], hp: [3000, 3500, 60] },
  'Dieu de la mort': { dmg: [450, 480, 60], hp: [4000, 4500, 60] },
  'dieux normal': { dmg: [240, 275, 60], hp: [2000, 2500, 60] },
  
  // Fées
  'Fée': { dmg: [25, 50, 60], hp: [150, 250, 60] },
  'Fée des bois': { dmg: [28, 55, 60], hp: [180, 280, 60] },
  'Fée des eaux': { dmg: [30, 58, 60], hp: [200, 300, 60] },
  'Fée des vents': { dmg: [32, 60, 60], hp: [220, 320, 60] },
  
  // Centaures
  'Centaure': { dmg: [45, 70, 60], hp: [300, 400, 60] },
  'Centaure archer': { dmg: [50, 80, 60], hp: [350, 450, 60] },
  'Centaure guerrier': { dmg: [60, 90, 60], hp: [400, 500, 60] },
  
  // Trolls
  'Trolls': { dmg: [55, 80, 60], hp: [450, 600, 60] },
  'Troll des montagnes': { dmg: [60, 90, 60], hp: [500, 700, 60] },
  'Troll des cavernes': { dmg: [58, 85, 60], hp: [480, 650, 60] },
  'Troll des marais': { dmg: [50, 75, 60], hp: [420, 580, 60] },
  
  // Géants
  'Géant': { dmg: [150, 200, 60], hp: [800, 1000, 60] },
  'Géant de feu': { dmg: [170, 230, 60], hp: [900, 1200, 60] },
  'Géant de glace': { dmg: [180, 240, 60], hp: [1000, 1300, 60] },
  'Géant de pierre': { dmg: [160, 220, 60], hp: [850, 1100, 60] },
  
  // Ogres
  'Ogres': { dmg: [70, 120, 60], hp: [600, 800, 60] },
  'Ogre des forêts': { dmg: [75, 130, 60], hp: [650, 900, 60] },
  'Ogre des collines': { dmg: [80, 140, 60], hp: [700, 1000, 60] },
  'Ogre des marais': { dmg: [65, 115, 60], hp: [550, 750, 60] },
  
  // Nains
  'Nains': { dmg: [40, 70, 60], hp: [250, 400, 60] },
  'Nain des montagnes': { dmg: [50, 80, 60], hp: [300, 450, 60] },
  'Nain des mines': { dmg: [45, 75, 60], hp: [280, 430, 60] },
  'Nain des forges': { dmg: [55, 85, 60], hp: [320, 470, 60] },
  
  // Cyclopes
  'Cyclope': { dmg: [100, 150, 60], hp: [700, 900, 60] },
  'Cyclope des montagnes': { dmg: [120, 170, 60], hp: [800, 1000, 60] },
  'Cyclope des plaines': { dmg: [110, 160, 60], hp: [750, 950, 60] },
  'Cyclope marin': { dmg: [130, 180, 60], hp: [850, 1100, 60] },
  
  // Anges
  'Anges': { dmg: [200, 250, 60], hp: [1000, 1200, 60] },
  'Ange de lumière': { dmg: [220, 270, 60], hp: [1100, 1300, 60] },
  'Ange déchu': { dmg: [250, 300, 60], hp: [1200, 1400, 60] },
  'Ange normal': { dmg: [200, 250, 60], hp: [1000, 1200, 60] },
  
  // Démons
  'Démons': { dmg: [180, 220, 60], hp: [900, 1200, 60] },
  'Démon seigneur': { dmg: [250, 300, 60], hp: [1300, 1600, 60] },
  'Démon prince': { dmg: [200, 250, 60], hp: [1100, 1400, 60] },
  'Démon noble': { dmg: [220, 270, 60], hp: [1200, 1500, 60] },
  
  // Vampires
  'Vampires': { dmg: [150, 200, 60], hp: [800, 1000, 60] },
  'Vampire noble': { dmg: [170, 220, 60], hp: [900, 1100, 60] },
  'Vampire seigneur': { dmg: [190, 240, 60], hp: [1000, 1200, 60] },
  'Vampire jeune': { dmg: [140, 190, 60], hp: [700, 900, 60] },
  
  // Loup-Garous
  'Loup-Garous': { dmg: [80, 120, 60], hp: [600, 800, 60] },
  'Loup-Garou alpha': { dmg: [100, 150, 60], hp: [700, 900, 60] },
  'Loup-Garou beta': { dmg: [85, 130, 60], hp: [650, 850, 60] },
  'Loup-Garou oméga': { dmg: [70, 110, 60], hp: [550, 750, 60] },
  
  // Fourmis chimère
  'fourmis normal': { dmg: [70, 100, 60], hp: [600, 800, 60] },
  'Lieutenant fourmis': { dmg: [100, 120, 60], hp: [800, 850, 60] },
  'commandant fourmis': { dmg: [120, 150, 60], hp: [900, 920, 60] },
  'garde royal fourmis': { dmg: [200, 240, 60], hp: [1000, 1100, 60] },
  'Roi des fourmis': { dmg: [280, 330, 60], hp: [2000, 3000, 60] },
  
  // Clan Uchiha
  'Uchiha normal': { dmg: [90, 120, 60], hp: [430, 500, 60] },
  'Huchiha sharingan': { dmg: [110, 135, 60], hp: [490, 550, 60] },
  'Uchiha Mangekyô sharingan': { dmg: [130, 150, 60], hp: [700, 900, 60] },
  'Uchiha susano': { dmg: [150, 175, 60], hp: [1000, 1200, 60] },
  
  // Sayan
  'Sayan basique': { dmg: [230, 250, 60], hp: [900, 1000, 60] },
  'Super sayan 1': { dmg: [270, 330, 60], hp: [1300, 1600, 60] },
  'Super sayan 2': { dmg: [300, 340, 60], hp: [1700, 2000, 60] },
  'Super sayan 3': { dmg: [330, 370, 60], hp: [2300, 2900, 60] },
  'Super sayan god': { dmg: [360, 400, 60], hp: [3100, 3500, 60] },
  'Super sayan Blue': { dmg: [390, 430, 60], hp: [4000, 4500, 60] },
  'Sayan Ultra Instinct': { dmg: [450, 480, 60], hp: [5000, 6000, 60] }
};

// Noms par race pour la génération
const raceNames = {
  'Elfes': ['Aerendyl', 'Thranduil', 'Legolas', 'Eldrin', 'Galadriel'],
  'Hauts Elfes': ['Aerion', 'Seraphina', 'Lorien', 'Valandil', 'Isilme'],
  'Orques': ['Grommash', 'Thrak', 'Zug', 'Mog', 'Karg'],
  'Humains': ['Arthur', 'Gwen', 'Lancelot', 'Richard', 'Eleanor'],
  'Dragon': ['Ignis', 'Frost', 'Draco', 'Pyra', 'Smaug'],
  'Fantômes': ['Specter', 'Wraith', 'Shade', 'Phantom', 'Banshee'],
  'Dieux': ['Zeus', 'Odin', 'Athena', 'Ra', 'Anubis'],
  'Fée': ['Titania', 'Puck', 'Aura', 'Nyx', 'Lumina'],
  'Centaure': ['Chiron', 'Pholus', 'Nessus', 'Kheiron', 'Asbolus'],
  'Trolls': ['Gruk', 'Mog', 'Thrall', 'Borg', 'Ragnar'],
  'Géant': ['Titan', 'Colossus', 'Goliath', 'Atlas', 'Jotunn'],
  'Ogres': ['Ogre', 'Brute', 'Hulk', 'Smash', 'Grunk'],
  'Nains': ['Gimli', 'Thorin', 'Balin', 'Dwalin', 'Gloin'],
  'Cyclope': ['Polyphemus', 'Argus', 'Brontes', 'Steropes', 'Arges'],
  'Anges': ['Gabriel', 'Michael', 'Raphael', 'Uriel', 'Seraphiel'],
  'Démons': ['Lucifer', 'Belial', 'Asmodeus', 'Mephisto', 'Abaddon'],
  'Vampires': ['Vlad', 'Alucard', 'Carmilla', 'Selene', 'Dracula'],
  'Loup-Garous': ['Fenrir', 'Lycaon', 'Remus', 'Ragar', 'Varg'],
  'Sayan': ['Goku', 'Vegeta', 'Gohan', 'Bardock', 'Broly'],
  'Clan Uchiha': ['Sasuke', 'Itachi', 'Madara', 'Obito', 'Shisui'],
  'fourmis chimère': ['Zerg', 'Kerrigan', 'Overmind', 'Cerebrate', 'Infestor']
};

// Fonction principale de génération
function generateCharacter(userId) {
  // 1. Choisir la race principale
  const raceOptions = Object.fromEntries(
    Object.entries(races).map(([race, data]) => [race, data.prob])
  );
  const race = chooseByProbability(raceOptions);
  
  // 2. Choisir la sous-race
  const subrace = chooseByProbability(races[race].subraces);
  
  // 3. Générer les stats
  const raceStats = stats[subrace] || stats[race] || { dmg: [50, 100, 50], hp: [100, 200, 50] };
  const damage = generateValue(raceStats.dmg[0], raceStats.dmg[1], raceStats.dmg[2]);
  const health = generateValue(raceStats.hp[0], raceStats.hp[1], raceStats.hp[2]);
  
  // 4. Choisir une arme
  const weaponOptions = Object.fromEntries(
    weapons.map(w => [w.name, w.prob])
  );
  const weaponName = chooseByProbability(weaponOptions);
  const weapon = weapons.find(w => w.name === weaponName);
  
  // 5. Appliquer le bonus d'arme
  const totalDamage = damage + weapon.bonus;
  
  // 6. Déterminer shiny (0.01% de chance)
  const isShiny = Math.random() < 0.0001;
  
  // 7. Générer un nom approprié
  const nameList = raceNames[race] || ['Guerrier', 'Mage', 'Archer', 'Combattant', 'Héros'];
  const randomName = nameList[Math.floor(Math.random() * nameList.length)];
  
  return {
    userId,
    name: `${randomName} le ${subrace}`,
    race,
    subRace: subrace,
    damage: totalDamage,
    health,
    weapon: weapon.name,
    elo: 50,
    isShiny,
    createdAt: new Date()
  };
}

module.exports = { generateCharacter };