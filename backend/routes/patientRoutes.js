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
} = require('../controllers/patientController');
const { authMiddleware, restrictToRoles } = require('../middleware/patientAuth');

router.post('/logout', authMiddleware, logoutPatient);
router.get('/profile', authMiddleware, restrictToRoles('ROLE_PATIENT'), getProfile);
router.put('/profile', authMiddleware, restrictToRoles('ROLE_PATIENT'), updateProfile);

router.get('/', authMiddleware, getAllPatients);
router.get('/:id', authMiddleware, restrictToRoles('ROLE_PATIENT'), getPatientById);
router.post('/', createPatient);
router.put('/:id', authMiddleware, restrictToRoles('ROLE_ADMIN'), updatePatient);
router.delete('/:id', authMiddleware, restrictToRoles('ROLE_ADMIN'), deletePatient);

module.exports = router;