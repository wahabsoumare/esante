const express = require('express');
const router = express.Router();
const {
  createDisponibilite,
  updateDisponibilite,
  deleteDisponibilite,
  toggleDisponibilite,
  getAllDisponibilites,
  getDisponibilitesByMedecin
} = require('../controllers/disponibiliteController');
const { authMiddleware, restrictToRoles } = require('../middleware/auth');

// 🔹 Récupérer toutes les disponibilités actives (auth requise)
router.get('/', authMiddleware, getAllDisponibilites);

// 🔹 Récupérer les disponibilités d’un médecin spécifique
router.get('/medecin/:id', getDisponibilitesByMedecin);

// 🔹 Création (médecin uniquement)
router.post('/', authMiddleware, restrictToRoles('ROLE_MEDECIN'), createDisponibilite);

// 🔹 Modification (jour + heures)
router.put('/:id', authMiddleware, restrictToRoles('ROLE_MEDECIN'), updateDisponibilite);

// 🔹 Suppression
router.delete('/:id', authMiddleware, restrictToRoles('ROLE_MEDECIN'), deleteDisponibilite);

// 🔹 Activation/Désactivation
router.patch('/:id/toggle', authMiddleware, restrictToRoles('ROLE_MEDECIN'), toggleDisponibilite);

module.exports = router;
