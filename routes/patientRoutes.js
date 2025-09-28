const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  loginPatient,
  logoutPatient,
  getProfile,
  updateProfile,
} = require('../controllers/patientController');
const { authMiddleware, restrictToRoles } = require('../middleware/auth');

router.post('/login', loginPatient);
router.post('/logout', authMiddleware, logoutPatient);
router.get('/profile', authMiddleware, restrictToRoles('patient'), getProfile);
router.put('/profile', authMiddleware, restrictToRoles('patient'), updateProfile);

router.get('/', authMiddleware, restrictToRoles('ROLE_ADMIN'), getAllPatients);
router.get('/:id', authMiddleware, restrictToRoles('patient'), getPatientById);
router.post('/', createPatient);
router.put('/:id', authMiddleware, restrictToRoles('ROLE_ADMIN'), updatePatient);
router.delete('/:id', authMiddleware, restrictToRoles('ROLE_ADMIN'), deletePatient);

module.exports = router;