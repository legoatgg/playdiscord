const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  userId: String,
  name: String,
  race: String,
  subRace: String,
  damage: Number,
  health: Number,
  weapon: String,
  elo: { type: Number, default: 50 },
  battles: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  lastBattle: Date,
  createdAt: { type: Date, default: Date.now },
  isShiny: Boolean
});

// Mettre à jour le rôle de l'utilisateur en fonction de l'ELO
characterSchema.post('save', async function(doc) {
  const User = require('./User');
  const user = await User.findOne({ userId: doc.userId });
  
  if (!user) return;
  
  // Déterminer le nouveau rôle basé sur l'ELO
  let newRole = 'Paysant Niveau 10';
  if (doc.elo >= 200) newRole = 'Bourgeois Niveau 15';
  if (doc.elo >= 500) newRole = 'Nobles Niveau 20';
  if (doc.elo >= 700) newRole = 'Baron/Baronne Niveau 25';
  if (doc.elo >= 850) newRole = 'Vicomte / Vicomtesse Niveau 30';
  if (doc.elo >= 1000) newRole = 'Comte / Comtesse Niveau 35';
  if (doc.elo >= 1150) newRole = 'Marquis / Marquise Niveau 40';
  if (doc.elo >= 1400) newRole = 'Duc / Duchesse Niveau 45';
  if (doc.elo >= 1600) newRole = 'Garde Royal Niveau 50';
  if (doc.elo >= 1850) newRole = 'Prince / Princesse Niveau 55';
  if (doc.elo >= 2050) newRole = 'Roi / Reine Niveau 60';
  
  // Mettre à jour si nécessaire
  if (user.role !== newRole) {
    user.role = newRole;
    await user.save();
  }
});

module.exports = mongoose.model('Character', characterSchema);