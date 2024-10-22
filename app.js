const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');  // Importer cors

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(express.json());

// Configuration de CORS
app.use(cors({
  origin: 'http://localhost:3000',  // Autoriser l'accès depuis le front-end local
  methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',  // Autoriser ces méthodes HTTP
  allowedHeaders: 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',  // Autoriser ces en-têtes
}));

// Routes API
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// Pour servir les fichiers d'images
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;