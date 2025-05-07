const { admin } = require('../firebase');

async function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const idToken = header.replace('Bearer ', '');

  if (!idToken) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = { verifyToken }; 