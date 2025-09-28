const express = require('express');
const router = express.Router();
const {
  getAllEtablissements,
  getEtablissementById,
  createEtablissement,
  updateEtablissement,
  deleteEtablissement,
} = require('../controllers/etablissementController');
const { authMiddleware, restrictToRoles } = require('../middleware/auth');

router.get('/', authMiddleware, restrictToRoles('ROLE_ADMIN'),getAllEtablissements);
router.get('/:id',authMiddleware, restrictToRoles('ROLE_ADMIN'), getEtablissementById);
router.post('/', authMiddleware, restrictToRoles('ROLE_ADMIN'),createEtablissement);
router.put('/:id',authMiddleware, restrictToRoles('ROLE_ADMIN'), updateEtablissement);
router.delete('/:id', authMiddleware, restrictToRoles('ROLE_ADMIN'),deleteEtablissement);

module.exports = router;