const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

mongoose.connect(process.env.MONGODB)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
}));

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;