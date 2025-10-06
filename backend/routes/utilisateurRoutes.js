const express = require('express');
const router = express.Router();
const {
  getAllUtilisateurs,
  getUtilisateurById,
  createUtilisateur,
  updateUtilisateur,
  deleteUtilisateur,
  loginUtilisateur,
  logoutUtilisateur,
  getProfile,
  updateProfile,
  getPublicMedecins,
  getPublicMedecinById,
  getAllMedecins
} = require('../controllers/utilisateurController');
const { authMiddleware, restrictToRoles } = require('../middleware/auth');

router.get('/public/medecins', getPublicMedecins);
router.get('/medecins', authMiddleware, restrictToRoles('ROLE_ADMIN'), getAllMedecins);
router.get('/public/medecins/:id', getPublicMedecinById);

router.post('/login', loginUtilisateur);
router.post('/logout', authMiddleware, logoutUtilisateur);
router.get('/profile', authMiddleware, restrictToRoles('ROLE_ADMIN', 'ROLE_MEDECIN', 'ROLE_SECRETAIRE'), getProfile);
router.put('/profile', authMiddleware, restrictToRoles('ROLE_ADMIN', 'ROLE_MEDECIN', 'ROLE_SECRETAIRE'), updateProfile);

router.get('/', authMiddleware, restrictToRoles('ROLE_ADMIN'), getAllUtilisateurs);
router.get('/:id', authMiddleware, restrictToRoles('ROLE_ADMIN'), getUtilisateurById);
router.post('/', authMiddleware, restrictToRoles('ROLE_ADMIN'), createUtilisateur);
router.put('/:id', authMiddleware, restrictToRoles('ROLE_ADMIN'), updateUtilisateur);
router.delete('/:id', authMiddleware, restrictToRoles('ROLE_ADMIN'), deleteUtilisateur);


module.exports = router;