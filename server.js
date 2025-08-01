require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const characterRoutes = require('./routes/characters');
const battleRoutes = require('./routes/battles');
const adminRoutes = require('./routes/admin');
const { generateCharacter } = require('./utils/characterGenerator');
const Character = require('./models/Character');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connecté'))
.catch(err => console.error(err));

// Routes
app.use('/api/characters', characterRoutes);
app.use('/api/battles', battleRoutes);
app.use('/api/admin', adminRoutes);

// Créer un utilisateur s'il n'existe pas
app.post('/api/user', async (req, res) => {
  const { userId } = req.body;
  
  try {
    let user = await User.findOne({ userId });
    
    if (!user) {
      user = new User({ 
        userId,
        role: 'Paysant Niveau 10',
        lastCharacterCreated: new Date(0) // Date très ancienne
      });
      await user.save();
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Générer un personnage
app.post('/api/characters/generate', async (req, res) => {
  const { userId } = req.body;
  
  try {
    // Vérifier si l'utilisateur peut créer un personnage
    const user = await User.findOne({ userId });
    const now = new Date();
    const lastCreation = user.lastCharacterCreated || new Date(0);
    const diffHours = (now - lastCreation) / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      const remainingMinutes = Math.ceil(60 - (diffHours * 60));
      return res.status(400).json({ 
        message: `Vous devez attendre ${remainingMinutes} minutes avant de créer un nouveau personnage` 
      });
    }
    
    // Créer le personnage
    const character = generateCharacter(userId);
    const newCharacter = new Character(character);
    await newCharacter.save();
    
    // Mettre à jour l'utilisateur
    user.lastCharacterCreated = now;
    await user.save();
    
    res.json(newCharacter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));