const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  logoutPatient,
  getProfile,
  updateProfile,
  addMetrique,
} = require('../controllers/patientController');
const { authMiddleware, restrictToRoles } = require('../middleware/auth');

router.post('/logout', authMiddleware, logoutPatient);
router.get('/profile', authMiddleware, restrictToRoles('ROLE_PATIENT', 'ROLE_ADMIN', 'ROLE_MEDECIN'), getProfile);
router.put('/profile', authMiddleware, restrictToRoles('ROLE_PATIENT', 'ROLE_ADMIN', 'ROLE_MEDECIN'), updateProfile);
router.post('/profile/metriques', authMiddleware, restrictToRoles('ROLE_PATIENT', 'ROLE_ADMIN', 'ROLE_MEDECIN'), addMetrique);

router.get('/', authMiddleware, getAllPatients);
router.get('/:id', authMiddleware, restrictToRoles('ROLE_ADMIN', 'ROLE_MEDECIN'), getPatientById);
router.post('/', createPatient);
router.put('/:id', authMiddleware, restrictToRoles('ROLE_ADMIN', 'ROLE_PATIENT'), updatePatient);
router.delete('/:id', authMiddleware, restrictToRoles('ROLE_ADMIN'), deletePatient);

module.exports = router;