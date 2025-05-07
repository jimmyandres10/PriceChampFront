require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { admin, db } = require('./firebase');
const fetch = require('node-fetch');
const { verifyToken } = require('./middleware/verifyToken');

const app = express();
const PORT = process.env.PORT || 3000;
const COLLECTION = 'productos';

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API viva 🔥' });
});

// POST /api/register – create a new Firebase Auth user
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRecord = await admin.auth().createUser({ email, password });
    const token = await admin.auth().createCustomToken(userRecord.uid);
    res.status(201).json({ uid: userRecord.uid, token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: error.message });
  }
});

// POST /api/login – sign in an existing user via Firebase REST API
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    res.json({
      uid: data.localId,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/users/me  -> Detalle de perfil
app.get('/api/users/me', verifyToken, async (req, res) => {
  try {
    const uid = req.uid;
    const userRecord = await admin.auth().getUser(uid);
    const profileSnap = await db.collection('users').doc(uid).get();
    const profileData = profileSnap.exists ? profileSnap.data() : {};
    res.json({
      uid,
      email: userRecord.email,
      displayName: profileData.displayName || null,
      photoURL: profileData.photoURL || null,
      metadata: {
        createdAt: userRecord.metadata.creationTime,
        lastSignIn: userRecord.metadata.lastSignInTime
      },
      searchHistory: profileData.searchHistory || [],
      favorites: profileData.favorites || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo perfil de usuario.' });
  }
});

// GET /api/productos  -> lista productos
app.get('/api/productos', verifyToken, async (req, res) => {
  try {
    const source = req.query.source;
    const productosDoc = await db.collection('productos').doc('productos_falabella').get();
    const mercaDoc = await db.collection('productos').doc('productos_mercadolibre').get();
    let all = [
      ...(productosDoc.exists ? productosDoc.data().productos : []),
      ...(mercaDoc.exists ? mercaDoc.data().productos : [])
    ];
    if (source === 'falabella') all = productosDoc.data().productos;
    if (source === 'mercadolibre') all = mercaDoc.data().productos;
    res.json({ productos: all });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /api/productos/:id  -> detalle de producto
app.get('/api/productos/:id', async (req, res) => {
  try {
    const doc = await db.collection(COLLECTION).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// POST /api/productos  -> crear producto
app.post('/api/productos', async (req, res) => {
  try {
    const data = req.body;
    const ref = await db.collection(COLLECTION).add(data);
    res.status(201).json({ id: ref.id, ...data });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /api/productos/:id  -> actualizar producto
app.put('/api/productos/:id', async (req, res) => {
  try {
    const data = req.body;
    await db.collection(COLLECTION).doc(req.params.id).update(data);
    res.json({ id: req.params.id, ...data });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE /api/productos/:id  -> eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
  try {
    await db.collection(COLLECTION).doc(req.params.id).delete();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// POST /api/search-history  -> guardar historial de busquedas
app.post('/api/search-history', verifyToken, async (req, res) => {
  try {
    const uid = req.uid;
    const { searchQuery } = req.body;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const currentHistory = userDoc.exists ? userDoc.data().searchHistory || [] : [];
    const updatedHistory = [...new Set([searchQuery, ...currentHistory.slice(0, 10)])]; // Limit to 10 recent searches
    await userRef.set({ searchHistory: updatedHistory }, { merge: true });
    res.status(201).json({ message: 'Search history updated', searchHistory: updatedHistory });
  } catch (error) {
    console.error('Error saving search history:', error);
    res.status(500).json({ error: 'Error saving search history' });
  }
});

// GET /api/search-history  -> obtener historial de búsquedas
app.get('/api/search-history', verifyToken, async (req, res) => {
  try {
    const uid = req.uid;
    const userDoc = await db.collection('users').doc(uid).get();
    const searchHistory = userDoc.exists ? userDoc.data().searchHistory || [] : [];
    res.json({ searchHistory });
  } catch (error) {
    console.error('Error retrieving search history:', error);
    res.status(500).json({ error: 'Error retrieving search history' });
  }
});

// POST /api/favorites  -> guardar favoritos
app.post('/api/favorites', verifyToken, async (req, res) => {
  try {
    const uid = req.uid;
    const { productId } = req.body;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const currentFavorites = userDoc.exists ? userDoc.data().favorites || [] : [];
    if (!currentFavorites.includes(productId)) {
      const updatedFavorites = [...currentFavorites, productId];
      await userRef.set({ favorites: updatedFavorites }, { merge: true });
      res.status(201).json({ message: 'Favorite added', favorites: updatedFavorites });
    } else {
      res.status(400).json({ error: 'Product already in favorites' });
    }
  } catch (error) {
    console.error('Error saving favorite:', error);
    res.status(500).json({ error: 'Error saving favorite' });
  }
});

// GET /api/favorites  -> obtener favoritos
app.get('/api/favorites', verifyToken, async (req, res) => {
  try {
    const uid = req.uid;
    const userDoc = await db.collection('users').doc(uid).get();
    const favorites = userDoc.exists ? userDoc.data().favorites || [] : [];
    res.json({ favorites });
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    res.status(500).json({ error: 'Error retrieving favorites' });
  }
});

// DELETE /api/favorites/:productId  -> eliminar favorito
app.delete('/api/favorites/:productId', verifyToken, async (req, res) => {
  try {
    const uid = req.uid;
    const productId = req.params.productId;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const currentFavorites = userDoc.exists ? userDoc.data().favorites || [] : [];
    const updatedFavorites = currentFavorites.filter(id => id !== productId);
    await userRef.set({ favorites: updatedFavorites }, { merge: true });
    res.json({ message: 'Favorite removed', favorites: updatedFavorites });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Error removing favorite' });
  }
});

// Arrancar servidor
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
 