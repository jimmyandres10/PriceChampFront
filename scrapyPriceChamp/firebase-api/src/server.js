// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./firebase');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API viva 🔥' });
});

// Nombre de colección en Firestore
const COLLECTION = 'productos';

// GET /api/productos → lista todos los documentos de 'productos'
app.get('/api/productos', async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION).get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error) {
    console.error('Error al leer productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// (Opcional: añade otros endpoints CRUD aquí cambiando también '/api/products' por '/api/productos')

// Arranca el servidor
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
