const Utilisateur = require('../models/utilisateur');
const Medecin = require('../models/medecin');
const redisClient = require('../config/redis');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Liste des utilisateurs (inclut spécialité si médecin)
const getAllUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: Medecin, as: 'medecin' }]
    });
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

// Récupérer un utilisateur par ID (inclut spécialité si médecin)
const getUtilisateurById = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Medecin, as: 'medecin' }]
    });
    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

// Création utilisateur
const createUtilisateur = async (req, res) => {
  const t = await Utilisateur.sequelize.transaction();

  try {
    const {
      prenomu,
      nomu,
      sexe,
      adresse,
      telephoneu,
      emailu,
      fonction,
      password,
      etat,
      typecompte,
      specialite, // spécifique aux médecins
    } = req.body;

    if (!prenomu || !nomu || !sexe || !adresse || !telephoneu || !emailu || !fonction || !password || !etat || !typecompte) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUtilisateur = await Utilisateur.create(
      {
        prenomu,
        nomu,
        sexe,
        adresse,
        telephoneu,
        emailu,
        fonction,
        password: hashedPassword,
        etat,
        typecompte,
        dateajout: new Date(),
      },
      { transaction: t }
    );

    if (typecompte === 'ROLE_MEDECIN') {
      if (!specialite) {
        await t.rollback();
        return res.status(400).json({ error: 'Un médecin doit avoir une spécialité' });
      }

      await Medecin.create(
        {
          specialite,
          utilisateurId: newUtilisateur.idu,
        },
        { transaction: t }
      );
    }

    await t.commit();

    const utilisateurAvecMedecin = await Utilisateur.findByPk(newUtilisateur.idu, {
      attributes: { exclude: ['password'] },
      include: [{ model: Medecin, as: 'medecin' }]
    });

    res.status(201).json(utilisateurAvecMedecin);

  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

// Mise à jour utilisateur (+ médecin si nécessaire)
const updateUtilisateur = async (req, res) => {
  const t = await Utilisateur.sequelize.transaction();

  try {
    const { id } = req.params;
    const {
      prenomu, nomu, sexe, adresse, telephoneu, emailu, fonction,
      password, etat, typecompte, specialite
    } = req.body;

    const utilisateur = await Utilisateur.findByPk(id, { transaction: t });
    if (!utilisateur) {
      await t.rollback();
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const updates = {
      prenomu: prenomu ?? utilisateur.prenomu,
      nomu: nomu ?? utilisateur.nomu,
      sexe: sexe ?? utilisateur.sexe,
      adresse: adresse ?? utilisateur.adresse,
      telephoneu: telephoneu ?? utilisateur.telephoneu,
      emailu: emailu ?? utilisateur.emailu,
      fonction: fonction ?? utilisateur.fonction,
      etat: etat ?? utilisateur.etat,
      typecompte: typecompte ?? utilisateur.typecompte,
    };

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    await utilisateur.update(updates, { transaction: t });

    // Si médecin → mettre à jour spécialité
    if (utilisateur.typecompte === 'ROLE_MEDECIN') {
      let medecin = await Medecin.findOne({ where: { utilisateurId: utilisateur.idu }, transaction: t });

      if (medecin) {
        await medecin.update({ specialite: specialite ?? medecin.specialite }, { transaction: t });
      } else if (specialite) {
        await Medecin.create({ specialite, utilisateurId: utilisateur.idu }, { transaction: t });
      }
    }

    await t.commit();

    const utilisateurAvecMedecin = await Utilisateur.findByPk(utilisateur.idu, {
      attributes: { exclude: ['password'] },
      include: [{ model: Medecin, as: 'medecin' }]
    });

    res.json(utilisateurAvecMedecin);

  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

// Suppression utilisateur (+ médecin si nécessaire)
const deleteUtilisateur = async (req, res) => {
  const t = await Utilisateur.sequelize.transaction();

  try {
    const { id } = req.params;
    const utilisateur = await Utilisateur.findByPk(id, { transaction: t });

    if (!utilisateur) {
      await t.rollback();
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (utilisateur.typecompte === 'ROLE_MEDECIN') {
      await Medecin.destroy({ where: { utilisateurId: utilisateur.idu }, transaction: t });
    }

    await utilisateur.destroy({ transaction: t });
    await t.commit();

    res.status(204).send();
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

// Login (inchangé, déjà bien)
const loginUtilisateur = async (req, res) => {
  try {
    const { emailu, password } = req.body;

    if (!emailu || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const utilisateur = await Utilisateur.findOne({
      where: { emailu },
      include: [{ model: Medecin, as: 'medecin' }]
    });

    if (!utilisateur) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const isPasswordValid = await bcrypt.compare(password, utilisateur.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { idu: utilisateur.idu, emailu: utilisateur.emailu, typecompte: utilisateur.typecompte },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const tokenKey = `token:${token}`;
    await redisClient.setEx(tokenKey, 24 * 60 * 60, utilisateur.idu.toString());

    res.json({
      token,
      utilisateur: {
        ...utilisateur.get(),
        password: undefined
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

// Logout (inchangé)
const logoutUtilisateur = async (req, res) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : req.headers.authorization;
    const tokenKey = `token:${token}`;
    await redisClient.del(tokenKey);
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

// Profil connecté (inclut spécialité si médecin)
const getProfile = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.user.idu, {
      attributes: { exclude: ['password'] },
      include: [{ model: Medecin, as: 'medecin' }]
    });

    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

// Mise à jour du profil connecté (+ médecin si nécessaire)
const updateProfile = async (req, res) => {
  const t = await Utilisateur.sequelize.transaction();

  try {
    const { prenomu, nomu, sexe, adresse, telephoneu, emailu, fonction, password, specialite } = req.body;

    const utilisateur = await Utilisateur.findByPk(req.user.idu, { transaction: t });
    if (!utilisateur) {
      await t.rollback();
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const updates = {
      prenomu: prenomu ?? utilisateur.prenomu,
      nomu: nomu ?? utilisateur.nomu,
      sexe: sexe ?? utilisateur.sexe,
      adresse: adresse ?? utilisateur.adresse,
      telephoneu: telephoneu ?? utilisateur.telephoneu,
      emailu: emailu ?? utilisateur.emailu,
      fonction: fonction ?? utilisateur.fonction,
    };

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    await utilisateur.update(updates, { transaction: t });

    if (utilisateur.typecompte === 'ROLE_MEDECIN') {
      let medecin = await Medecin.findOne({ where: { utilisateurId: utilisateur.idu }, transaction: t });

      if (medecin) {
        await medecin.update({ specialite: specialite ?? medecin.specialite }, { transaction: t });
      } else if (specialite) {
        await Medecin.create({ specialite, utilisateurId: utilisateur.idu }, { transaction: t });
      }
    }

    await t.commit();

    const utilisateurAvecMedecin = await Utilisateur.findByPk(utilisateur.idu, {
      attributes: { exclude: ['password'] },
      include: [{ model: Medecin, as: 'medecin' }]
    });

    res.json(utilisateurAvecMedecin);

  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

// Récupérer uniquement les médecins
const getPublicMedecins = async (req, res) => {
  try {
    const medecins = await Utilisateur.findAll({
      where: { typecompte: 'ROLE_MEDECIN', etat: 'actif' }, // seulement les actifs
      attributes: ['idu', 'prenomu', 'nomu'], // infos basiques
      include: [{
        model: Medecin,
        as: 'medecin',
        attributes: ['specialite']
      }]
    });

    res.json(medecins);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};


module.exports = {
  getAllUtilisateurs,
  getUtilisateurById,
  createUtilisateur,
  updateUtilisateur,
  deleteUtilisateur,
  loginUtilisateur,
  logoutUtilisateur,
  getProfile,
  updateProfile,
  getPublicMedecins
};
