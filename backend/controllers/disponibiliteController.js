const Disponibilite = require('../models/disponibilite');
const Medecin = require('../models/medecin');
const User = require('../models/utilisateur'); // pour récupérer nom/prénom

// 1. Créer une disponibilité
const createDisponibilite = async (req, res) => {
  try {
    const utilisateurId = req.user.idu;
    if (req.user.typecompte !== 'ROLE_MEDECIN') {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas un médecin." });
    }

    const medecin = await Medecin.findOne({ where: { utilisateurId } });
    if (!medecin) {
      return res.status(404).json({ message: "Médecin non trouvé." });
    }

    const { jour, heureDebut, heureFin } = req.body;

    const dispo = await Disponibilite.create({
      medecinId: medecin.idm,
      jour,
      heureDebut,
      heureFin,
      actif: true
    });

    res.status(201).json(dispo);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création", error: error.message });
  }
};

// 2. Modifier disponibilité (heures uniquement)
const updateDisponibilite = async (req, res) => {
  try {
    const utilisateurId = req.user.idu;
    if (req.user.typecompte !== 'ROLE_MEDECIN') {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const medecin = await Medecin.findOne({ where: { utilisateurId } });
    if (!medecin) return res.status(404).json({ message: "Médecin non trouvé." });

    const { id } = req.params;
    const { heureDebut, heureFin } = req.body;

    const dispo = await Disponibilite.findOne({ where: { id, medecinId: medecin.idm } });
    if (!dispo) return res.status(404).json({ message: "Disponibilité non trouvée." });

    dispo.heureDebut = heureDebut || dispo.heureDebut;
    dispo.heureFin = heureFin || dispo.heureFin;

    await dispo.save();
    res.json(dispo);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// 3. Supprimer définitivement
const deleteDisponibilite = async (req, res) => {
  try {
    const utilisateurId = req.user.idu;
    if (req.user.typecompte !== 'ROLE_MEDECIN') {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const medecin = await Medecin.findOne({ where: { utilisateurId } });
    if (!medecin) return res.status(404).json({ message: "Médecin non trouvé." });

    const { id } = req.params;
    const dispo = await Disponibilite.findOne({ where: { id } });
    if (!dispo) return res.status(404).json({ message: "Disponibilité non trouvée." });

    await dispo.destroy();
    res.json({ message: "Disponibilité supprimée définitivement." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// 4. Activer/Désactiver disponibilité
const toggleDisponibilite = async (req, res) => {
  try {
    const utilisateurId = req.user.idu;
    if (req.user.typecompte !== 'ROLE_MEDECIN') {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const medecin = await Medecin.findOne({ where: { utilisateurId } });
    if (!medecin) return res.status(404).json({ message: "Médecin non trouvé." });

    const { id } = req.params;
    const dispo = await Disponibilite.findOne({ where: { id, medecinId: medecin.idm } });
    if (!dispo) return res.status(404).json({ message: "Disponibilité non trouvée." });

    dispo.actif = !dispo.actif;
    await dispo.save();

    res.json({ message: `Disponibilité ${dispo.actif ? "activée" : "désactivée"}.`, dispo });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification", error: error.message });
  }
};

// 5. Toutes les disponibilités + infos médecin
const getAllDisponibilites = async (req, res) => {
  try {
    const dispos = await Disponibilite.findAll({
      where: { actif: true },
      include: [
        {
          model: Medecin,
          as: 'medecin',
          include: [
            {
              model: User,
              as: 'utilisateur',
              attributes: ['prenomu', 'nomu', 'emailu']
            }
          ],
          attributes: ['specialite']
        }
      ],
      order: [['jour', 'ASC'], ['heureDebut', 'ASC']]
    });

    res.json(dispos);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
};

// 6. Récupérer toutes les disponibilités d’un médecin spécifique
const getDisponibilitesByMedecin = async (req, res) => {
  try {
    const { id } = req.params; // id du médecin

    const medecin = await Medecin.findByPk(id, {
      include: {
        model: User,
        as: 'utilisateur',
        attributes: ['prenomu', 'nomu', 'emailu']
      }
    });

    if (!medecin) {
      return res.status(404).json({ message: "Médecin non trouvé." });
    }

    const dispos = await Disponibilite.findAll({
      where: { medecinId: id, actif: true },
      order: [['jour', 'ASC'], ['heureDebut', 'ASC']]
    });

    res.json({
      medecin: {
        id: medecin.idm,
        nom: medecin.utilisateur.prenomu,
        prenom: medecin.utilisateur.nomu,
        email: medecin.utilisateur.emailu,
        specialite: medecin.specialite
      },
      disponibilites: dispos
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
};

module.exports = {
  createDisponibilite,
  updateDisponibilite,
  deleteDisponibilite,
  toggleDisponibilite,
  getAllDisponibilites,
  getDisponibilitesByMedecin
};
