// routes/rendezvous.routes.js
const express = require('express');
const router = express.Router();

const {
  createRendezVous,
  confirmRendezVous,
  rejectRendezVous,
  cancelRendezVous,
  getRendezVousByPatient,
  getRendezVousByMedecinMe,
  getRendezVousByMedecin,
  getAllRendezvous
} = require('../controllers/rendezvousController');

const { authMiddleware, restrictToRoles } = require('../middleware/auth');

router.get('/',
  authMiddleware,
  restrictToRoles('ROLE_ADMIN'),
  getAllRendezvous
);
// Patient crée un RDV (auth token patient contenant id_patient)
router.post(
  '/',
  authMiddleware,
  createRendezVous
);

// Médecin confirme / rejette (utilisateur avec typecompte ROLE_MEDECIN)
router.patch(
  '/:id/confirm',
  authMiddleware,
  restrictToRoles('ROLE_MEDECIN'),
  confirmRendezVous
);

router.patch(
  '/:id/reject',
  authMiddleware,
  restrictToRoles('ROLE_MEDECIN'),
  rejectRendezVous
);

// Patient ou médecin annule
router.patch(
  '/:id/cancel',
  authMiddleware,
  restrictToRoles('ROLE_PATIENT', 'ROLE_MEDECIN', 'ROLE_ADMIN'),
  cancelRendezVous
);

// Récupérations
router.get(
  '/patient/me',
  authMiddleware,
  getRendezVousByPatient
);

router.get(
  '/medecin/me',
  authMiddleware,
  restrictToRoles('ROLE_MEDECIN'),
  getRendezVousByMedecinMe
);

// Voir RDV confirmés d'un médecin (pour un patient qui consulte la fiche médecin)
router.get(
  '/medecin/:id',
  authMiddleware,
  restrictToRoles('ROLE_PATIENT', 'ROLE_MEDECIN', 'ROLE_ADMIN'),
  getRendezVousByMedecin
);

module.exports = router;
