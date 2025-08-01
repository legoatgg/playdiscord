const mongoose = require('mongoose');

const battleLogSchema = new mongoose.Schema({
  userId: String,
  characterId: mongoose.Schema.Types.ObjectId,
  opponentId: mongoose.Schema.Types.ObjectId,
  result: String, // 'win' or 'loss'
  details: String,
  eloChange: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BattleLog', battleLogSchema);ma);