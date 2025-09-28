const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('patientAuthMiddleware: En-tête authorization:', req.headers.authorization);
    let token = req.headers.authorization || req.headers.Authorization;
    if (!token) {
      console.log('patientAuthMiddleware: Aucun jeton fourni');
      return res.status(401).json({ error: 'Aucun jeton fourni', details: 'L\'en-tête Authorization est requis' });
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }
    console.log('patientAuthMiddleware: Jeton extrait:', token);

    const tokenKey = `token:${token}`;
    console.log('patientAuthMiddleware: Vérification dans Redis:', tokenKey);
    let tokenExists;
    try {
      tokenExists = await redisClient.get(tokenKey);
    } catch (redisError) {
      console.error('patientAuthMiddleware: Erreur Redis:', redisError.message);
      return res.status(500).json({ error: 'Erreur serveur', details: 'Erreur de connexion à Redis' });
    }
    if (!tokenExists) {
      console.log('patientAuthMiddleware: Jeton non trouvé dans Redis');
      return res.status(401).json({ error: 'Jeton invalide ou expiré', details: 'Le jeton n\'est pas valide ou a expiré' });
    }

    console.log('patientAuthMiddleware: Vérification JWT');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error('patientAuthMiddleware: Erreur JWT:', jwtError.message);
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Jeton expiré', details: 'Le jeton a expiré, veuillez vous reconnecter' });
      }
      return res.status(401).json({ error: 'Jeton invalide', details: 'Le jeton fourni n\'est pas valide' });
    }

    console.log('patientAuthMiddleware: Jeton décodé:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('patientAuthMiddleware: Erreur inattendue:', error.message, error.stack);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

const restrictToRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      console.log('restrictToRoles: Données patient manquantes');
      return res.status(401).json({ error: 'Patient non authentifié', details: 'Aucune donnée patient trouvée' });
    }
    if (!roles.includes(req.user.role)) {
      console.log('restrictToRoles: Accès refusé pour le rôle:', req.user.role);
      return res.status(403).json({ error: 'Accès non autorisé', details: `Rôle ${req.user.role} non autorisé` });
    }
    next();
  };
};

module.exports = { authMiddleware, restrictToRoles };