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

router.get('/', authMiddleware, getAllDisponibilites);

router.get('/medecin/:id', getDisponibilitesByMedecin);
// Médecin
router.post('/', authMiddleware, restrictToRoles('ROLE_MEDECIN'), createDisponibilite);

router.put('/:id', authMiddleware, restrictToRoles('ROLE_MEDECIN'), updateDisponibilite);   

router.delete('/:id', authMiddleware, restrictToRoles('ROLE_MEDECIN'), deleteDisponibilite);

router.patch('/:id/toggle', authMiddleware, restrictToRoles('ROLE_MEDECIN'), toggleDisponibilite);

// Patients / Admins / Médecins

module.exports = router;
