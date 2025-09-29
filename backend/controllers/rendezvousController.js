// controllers/rendezvousController.js
const { Op } = require('sequelize');
const sequelize = require('../config/connexion');

const RendezVous = require('../models/rendezvous');
const Medecin = require('../models/medecin');
const Patient = require('../models/patient');
const Utilisateur = require('../models/utilisateur');
const Disponibilite = require('../models/disponibilite');

/**
 * Helper : vérifie s'il y a chevauchement pour un médecin sur une date donnée
 * ignoreRdvId : optionnel pour exclure le RDV courant (utile pour update/confirm)
 */
const hasOverlap = async (medecinId, dateRdv, heureDebut, heureFin, transaction = null, ignoreRdvId = null) => {
  // On veut trouver des RDV PENDING ou CONFIRMED qui se chevauchent
  const where = {
    medecinId,
    dateRdv,
    statut: { [Op.in]: ['PENDING', 'CONFIRMED'] }
  };

  // Conditions qui EXCLUENT les non-chevauchements :
  // existing.heureFin <= new.heureDebut OR existing.heureDebut >= new.heureFin => pas de chevauchement
  // On transforme ça en NOT (one of those)
  where[Op.not] = [
    { heureFin: { [Op.lte]: heureDebut } },
    { heureDebut: { [Op.gte]: heureFin } }
  ];

  if (ignoreRdvId) {
    where.id = { [Op.not]: ignoreRdvId };
  }

  const count = await RendezVous.count({ where, transaction });
  return count > 0;
};

/**
 * 1) Création d'un rendez-vous (patient connecté)
 * - req.user.id_patient (JWT Patient login) doit exister
 * - body: { medecinId, disponibiliteId (opt), dateRdv, heureDebut (opt), heureFin (opt), notes (opt) }
 */
const createRendezVous = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (!req.user || !req.user.id_patient) {
      await t.rollback();
      return res.status(403).json({ message: 'Accès refusé : vous devez être un patient connecté.' });
    }

    const patientId = req.user.id_patient;
    const { medecinId, disponibiliteId, dateRdv, heureDebut: hbBody, heureFin: hfBody, notes } = req.body;

    if (!medecinId || !dateRdv) {
      await t.rollback();
      return res.status(400).json({ message: 'medecinId et dateRdv sont requis.' });
    }

    const medecin = await Medecin.findByPk(medecinId, { transaction: t });
    if (!medecin) {
      await t.rollback();
      return res.status(404).json({ message: 'Médecin introuvable.' });
    }

    // déterminer heures
    let heureDebut = hbBody;
    let heureFin = hfBody;

    if (disponibiliteId) {
      const dispo = await Disponibilite.findOne({ where: { id: disponibiliteId, medecinId }, transaction: t });
      if (!dispo) {
        await t.rollback();
        return res.status(404).json({ message: 'Disponibilité template introuvable pour ce médecin.' });
      }

      // vérifier que le jour de la dateRdv correspond au template
      const jourNom = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'][new Date(dateRdv).getDay()];
      if (jourNom !== dispo.jour) {
        await t.rollback();
        return res.status(400).json({ message: `La date choisie (${dateRdv}) n'est pas le jour ${dispo.jour} attendu par la disponibilité.` });
      }

      if (!heureDebut) heureDebut = dispo.heureDebut;
      if (!heureFin) heureFin = dispo.heureFin;
    } else {
      if (!heureDebut || !heureFin) {
        await t.rollback();
        return res.status(400).json({ message: 'heureDebut et heureFin requis si pas de disponibiliteId.' });
      }
    }

    // sanity: heureDebut < heureFin
    if (!(heureDebut < heureFin)) {
      await t.rollback();
      return res.status(400).json({ message: 'heureDebut doit être antérieure à heureFin.' });
    }

    // vérifier chevauchement
    const overlap = await hasOverlap(medecinId, dateRdv, heureDebut, heureFin, t);
    if (overlap) {
      await t.rollback();
      return res.status(409).json({ message: 'Conflit : ce créneau est déjà réservé.' });
    }

    const rdv = await RendezVous.create({
      medecinId,
      patientId,
      disponibiliteId: disponibiliteId || null,
      dateRdv,
      heureDebut,
      heureFin,
      statut: 'PENDING',
      notes: notes || null
    }, { transaction: t });

    await t.commit();
    return res.status(201).json(rdv);
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: 'Erreur lors de la création du rendez-vous.', error: error.message });
  }
};

/**
 * 2) Médecin confirme un RDV
 * - req.user.idu (utilisateur médecin) -> on retrouve Medecin via utilisateurId
 * - vérification d'absence de conflit avant confirmation
 */
const confirmRendezVous = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (!req.user || !req.user.idu) {
      await t.rollback();
      return res.status(403).json({ message: 'Accès refusé : utilisateur non authentifié.' });
    }

    const utilisateurId = req.user.idu;
    const medecin = await Medecin.findOne({ where: { utilisateurId }, transaction: t });
    if (!medecin) {
      await t.rollback();
      return res.status(404).json({ message: 'Fiche médecin introuvable.' });
    }

    const { id } = req.params; // RDV id (integer)
    const rdv = await RendezVous.findOne({ where: { id, medecinId: medecin.idm }, transaction: t });
    if (!rdv) {
      await t.rollback();
      return res.status(404).json({ message: 'Rendez-vous introuvable.' });
    }

    if (rdv.statut !== 'PENDING') {
      await t.rollback();
      return res.status(400).json({ message: `Impossible de confirmer un RDV en statut ${rdv.statut}.` });
    }

    // vérifier overlap (exclure ce rdv)
    const overlap = await hasOverlap(medecin.idm, rdv.dateRdv, rdv.heureDebut, rdv.heureFin, t, rdv.id);
    if (overlap) {
      await t.rollback();
      return res.status(409).json({ message: 'Conflit détecté : un autre rendez-vous chevauche ce créneau.' });
    }

    rdv.statut = 'CONFIRMED';
    await rdv.save({ transaction: t });
    await t.commit();
    return res.json(rdv);
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: 'Erreur lors de la confirmation.', error: error.message });
  }
};

/**
 * 3) Médecin rejette un RDV (option : reason)
 */
const rejectRendezVous = async (req, res) => {
  try {
    if (!req.user || !req.user.idu) {
      return res.status(403).json({ message: 'Accès refusé.' });
    }

    const utilisateurId = req.user.idu;
    const medecin = await Medecin.findOne({ where: { utilisateurId } });
    if (!medecin) return res.status(404).json({ message: 'Médecin introuvable.' });

    const { id } = req.params;
    const { reason } = req.body;

    const rdv = await RendezVous.findOne({ where: { id, medecinId: medecin.idm } });
    if (!rdv) return res.status(404).json({ message: 'Rendez-vous introuvable.' });

    rdv.statut = 'REJECTED';
    if (reason) rdv.notes = (rdv.notes ? rdv.notes + '\n' : '') + `Rejet: ${reason}`;
    await rdv.save();

    return res.json({ message: 'Rendez-vous rejeté.', rdv });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors du rejet.', error: error.message });
  }
};

/**
 * 4) Annulation d'un RDV (patient propriétaire, ou médecin lié, ou admin)
 */
const cancelRendezVous = async (req, res) => {
  try {
    const role = req.user?.typecompte || req.user?.role || null; // s'adapte selon token utilisé
    const utilisateurId = req.user?.idu;
    const patientTokenId = req.user?.id_patient;
    const { id } = req.params;

    const rdv = await RendezVous.findByPk(id);
    if (!rdv) return res.status(404).json({ message: 'Rendez-vous introuvable.' });

    // patient annule son RDV
    if (patientTokenId) {
      if (rdv.patientId !== patientTokenId) {
        return res.status(403).json({ message: "Accès refusé : vous n'êtes pas le patient propriétaire." });
      }
      rdv.statut = 'CANCELLED';
      await rdv.save();
      return res.json({ message: 'Rendez-vous annulé par le patient.', rdv });
    }

    // médecin annule son RDV
    if (utilisateurId) {
      const medecin = await Medecin.findOne({ where: { utilisateurId } });
      if (!medecin) return res.status(403).json({ message: "Accès refusé : médecin introuvable." });
      if (medecin.idm !== rdv.medecinId) {
        return res.status(403).json({ message: "Accès refusé : vous n'êtes pas le médecin lié." });
      }
      rdv.statut = 'CANCELLED';
      await rdv.save();
      return res.json({ message: 'Rendez-vous annulé par le médecin.', rdv });
    }

    // sinon : accès refusé (ou admin si tu veux autoriser)
    return res.status(403).json({ message: "Accès refusé." });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur annulation.', error: error.message });
  }
};

/**
 * 5) Récupérer les RDV du patient connecté
 */
const getRendezVousByPatient = async (req, res) => {
  try {
    if (!req.user || !req.user.id_patient) {
      return res.status(403).json({ message: 'Accès refusé : patient non authentifié.' });
    }
    const patientId = req.user.id_patient;
    const rdvs = await RendezVous.findAll({
      where: { patientId },
      include: [
        {
          model: Medecin,
          as: 'medecin',
          include: [{ model: Utilisateur, as: 'utilisateur', attributes: ['prenomu', 'nomu', 'emailu'] }]
        },
        { model: Disponibilite, as: 'disponibilite' }
      ],
      order: [['dateRdv', 'ASC'], ['heureDebut', 'ASC']]
    });
    return res.json(rdvs);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur récupération RDV patient.', error: error.message });
  }
};

/**
 * 6) Récupérer RDV du médecin connecté
 */
const getRendezVousByMedecinMe = async (req, res) => {
  try {
    if (!req.user || !req.user.idu) {
      return res.status(403).json({ message: 'Accès refusé : utilisateur non authentifié.' });
    }
    const utilisateurId = req.user.idu;
    const medecin = await Medecin.findOne({ where: { utilisateurId } });
    if (!medecin) return res.status(404).json({ message: 'Médecin introuvable.' });

    const rdvs = await RendezVous.findAll({
      where: { medecinId: medecin.idm },
      include: [
        { model: Patient, as: 'patient', attributes: ['id_patient', 'prenom', 'nom', 'telephone', 'email'] },
        { model: Disponibilite, as: 'disponibilite' }
      ],
      order: [['dateRdv', 'ASC'], ['heureDebut', 'ASC']]
    });

    return res.json(rdvs);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur récupération RDV médecin.', error: error.message });
  }
};

/**
 * 7) Récupérer RDV confirmés d'un médecin (public / patient)
 *    - renvoie uniquement RDV statut CONFIRMED pour le medecinId passé en param
 */
const getRendezVousByMedecin = async (req, res) => {
  try {
    const { id } = req.params; // medecinId (idm)
    const rdvs = await RendezVous.findAll({
      where: { medecinId: id, statut: 'CONFIRMED' },
      include: [
        { model: Patient, as: 'patient', attributes: ['id_patient', 'prenom', 'nom'] },
        { model: Disponibilite, as: 'disponibilite' }
      ],
      order: [['dateRdv', 'ASC'], ['heureDebut', 'ASC']]
    });
    return res.json(rdvs);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur récupération RDV par médecin.', error: error.message });
  }
};

module.exports = {
  createRendezVous,
  confirmRendezVous,
  rejectRendezVous,
  cancelRendezVous,
  getRendezVousByPatient,
  getRendezVousByMedecinMe,
  getRendezVousByMedecin
};
