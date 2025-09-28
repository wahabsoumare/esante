const Utilisateur = require('../models/utilisateur');
const redisClient = require('../config/redis');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const getUtilisateurById = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const createUtilisateur = async (req, res) => {
  try {
    const { prenomu, nomu, sexe, adresse, telephoneu, emailu, fonction, password, etat, typecompte } = req.body;

    if (!prenomu || !nomu || !sexe || !adresse || !telephoneu || !emailu || !fonction || !password || !etat || !typecompte) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
    }

    const newUtilisateur = await Utilisateur.create({
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
      dateajout: new Date(),
    });

    const responseUtilisateur = { ...newUtilisateur.get(), password: undefined };
    res.status(201).json(responseUtilisateur);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const { prenomu, nomu, sexe, adresse, telephoneu, emailu, fonction, password, etat, typecompte } = req.body;

    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    await utilisateur.update({
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
    });

    const responseUtilisateur = { ...utilisateur.get(), password: undefined };
    res.json(responseUtilisateur);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    await utilisateur.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const loginUtilisateur = async (req, res) => {
  try {
    const { emailu, password } = req.body;

    if (!emailu || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const utilisateur = await Utilisateur.findOne({ where: { emailu } });
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
        idu: utilisateur.idu,
        emailu: utilisateur.emailu,
        typecompte: utilisateur.typecompte,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

const logoutUtilisateur = async (req, res) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : req.headers.authorization;
    const tokenKey = `token:${token}`;
    await redisClient.del(tokenKey);
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.user.idu, {
      attributes: { exclude: ['password'] },
    });
    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { prenomu, nomu, sexe, adresse, telephoneu, emailu, fonction, password } = req.body;

    const utilisateur = await Utilisateur.findByPk(req.user.idu);
    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    await utilisateur.update({
      prenomu: prenomu || utilisateur.prenomu,
      nomu: nomu || utilisateur.nomu,
      sexe: sexe || utilisateur.sexe,
      adresse: adresse || utilisateur.adresse,
      telephoneu: telephoneu || utilisateur.telephoneu,
      emailu: emailu || utilisateur.emailu,
      fonction: fonction || utilisateur.fonction,
      password: password || utilisateur.password,
    });

    const responseUtilisateur = { ...utilisateur.get(), password: undefined };
    res.json(responseUtilisateur);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
};
