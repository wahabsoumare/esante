const Disponibilite = require('../models/disponibilite');
const Medecin = require('../models/medecin');
const Utilisateur = require('../models/utilisateur');

// 1️⃣ Créer une disponibilité
const createDisponibilite = async (req, res) => {
  try {
    const utilisateurId = req.user.idu;
    if (req.user.typecompte !== 'ROLE_MEDECIN') {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas un médecin." });
    }

    const medecin = await Medecin.findOne({ where: { utilisateurId } });
    if (!medecin) return res.status(404).json({ message: "Médecin non trouvé." });

    const { jour, heureDebut, heureFin } = req.body;

    if (!jour || !heureDebut || !heureFin) {
      return res.status(400).json({ message: "Champs requis : jour, heureDebut, heureFin." });
    }

    const dispo = await Disponibilite.create({
      medecinId: medecin.idm,
      jour: jour.toLowerCase(),
      heureDebut,
      heureFin,
      actif: true
    });

    res.status(201).json(dispo);
  } catch (error) {
    console.error("Erreur createDisponibilite:", error);
    res.status(500).json({ message: "Erreur lors de la création", error: error.message });
  }
};

// 2️⃣ Modifier disponibilité (jour + heures)
const updateDisponibilite = async (req, res) => {
  try {
    const utilisateurId = req.user.idu;
    if (req.user.typecompte !== 'ROLE_MEDECIN') {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const medecin = await Medecin.findOne({ where: { utilisateurId } });
    if (!medecin) return res.status(404).json({ message: "Médecin non trouvé." });

    const { id } = req.params;
    const { jour, heureDebut, heureFin } = req.body;

    const dispo = await Disponibilite.findOne({ where: { id, medecinId: medecin.idm } });
    if (!dispo) return res.status(404).json({ message: "Disponibilité non trouvée." });

    dispo.jour = jour ? jour.toLowerCase() : dispo.jour;
    dispo.heureDebut = heureDebut || dispo.heureDebut;
    dispo.heureFin = heureFin || dispo.heureFin;

    await dispo.save();
    res.json(dispo);
  } catch (error) {
    console.error("Erreur updateDisponibilite:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// 3️⃣ Supprimer définitivement
const deleteDisponibilite = async (req, res) => {
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

    await dispo.destroy();
    res.json({ message: "Disponibilité supprimée avec succès." });
  } catch (error) {
    console.error("Erreur deleteDisponibilite:", error);
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// 4️⃣ Activer/Désactiver une disponibilité
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
    console.error("Erreur toggleDisponibilite:", error);
    res.status(500).json({ message: "Erreur lors de la modification", error: error.message });
  }
};

// 5️⃣ Récupérer toutes les disponibilités actives
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
              model: Utilisateur,
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
    console.error("Erreur getAllDisponibilites:", error);
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
};

// 6️⃣ Récupérer les disponibilités d’un médecin spécifique
const getDisponibilitesByMedecin = async (req, res) => {
  try {
    const { id } = req.params;

    const medecin = await Medecin.findByPk(id, {
      include: {
        model: Utilisateur,
        as: 'utilisateur',
        attributes: ['prenomu', 'nomu', 'emailu']
      }
    });

    if (!medecin) {
      return res.status(404).json({ message: "Médecin non trouvé." });
    }

    const dispos = await Disponibilite.findAll({
      where: { medecinId: id },
      order: [['jour', 'ASC'], ['heureDebut', 'ASC']]
    });

    res.json({
      medecin: {
        id: medecin.idm,
        prenom: medecin.utilisateur?.prenomu ?? null,
        nom: medecin.utilisateur?.nomu ?? null,
        email: medecin.utilisateur?.emailu ?? null,
        specialite: medecin.specialite
      },
      disponibilites: dispos
    });
  } catch (error) {
    console.error("Erreur getDisponibilitesByMedecin:", error);
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
