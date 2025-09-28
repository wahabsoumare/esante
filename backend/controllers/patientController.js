const Patient = require('../models/patient');
const redisClient = require('../config/redis');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json(patients);
  } catch (error) {
    console.error('Erreur getAllPatients:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }
    res.json(patient);
  } catch (error) {
    console.error('Erreur getPatientById:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

const createPatient = async (req, res) => {
  try {
    const { prenom, nom, telephone, email, password, sexe, date_naissance, adresse, commune, personne_urgence, langue_pref } = req.body;

    if (!telephone || !email || !password) {
      return res.status(400).json({ error: 'Les champs téléphone, email et mot de passe sont obligatoires' });
    }

    const existingPatient = await Patient.findOne({ where: { email } });
    if (existingPatient) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    if (sexe && !['M', 'F'].includes(sexe)) {
      return res.status(400).json({ error: 'Sexe doit être M ou F' });
    }

    const newPatient = await Patient.create({
      prenom,
      nom,
      telephone,
      email,
      password,
      sexe,
      date_naissance,
      adresse,
      commune,
      personne_urgence,
      langue_pref: langue_pref || 'fr',
      role: 'patient',
      cree_le: new Date(),
    });

    const responsePatient = { ...newPatient.get(), password: undefined };
    res.status(201).json(responsePatient);
  } catch (error) {
    console.error('Erreur createPatient:', error);
    res.status(400).json({ error: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { prenom, nom, telephone, email, password, sexe, date_naissance, adresse, commune, personne_urgence, langue_pref } = req.body;

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }

    if (email && email !== patient.email) {
      const existingPatient = await Patient.findOne({ where: { email } });
      if (existingPatient) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }
    }

    if (sexe && !['M', 'F'].includes(sexe)) {
      return res.status(400).json({ error: 'Sexe doit être M ou F' });
    }

    await patient.update({
      prenom: prenom !== undefined ? prenom : patient.prenom,
      nom: nom !== undefined ? nom : patient.nom,
      telephone: telephone || patient.telephone,
      email: email || patient.email,
      password: password || patient.password,
      sexe: sexe !== undefined ? sexe : patient.sexe,
      date_naissance: date_naissance !== undefined ? date_naissance : patient.date_naissance,
      adresse: adresse !== undefined ? adresse : patient.adresse,
      commune: commune !== undefined ? commune : patient.commune,
      personne_urgence: personne_urgence !== undefined ? personne_urgence : patient.personne_urgence,
      langue_pref: langue_pref || patient.langue_pref,
    });

    const responsePatient = { ...patient.get(), password: undefined };
    res.json(responsePatient);
  } catch (error) {
    console.error('Erreur updatePatient:', error);
    res.status(400).json({ error: error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }

    await patient.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erreur deletePatient:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const patient = await Patient.findOne({ where: { email } });
    if (!patient) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id_patient: patient.id_patient, email: patient.email, role: patient.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const tokenKey = `token:${token}`;
    await redisClient.setEx(tokenKey, 24 * 60 * 60, patient.id_patient.toString());

    res.json({
      token,
      patient: {
        id_patient: patient.id_patient,
        email: patient.email,
        role: patient.role,
      },
    });
  } catch (error) {
    console.error('Erreur loginPatient:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

const logoutPatient = async (req, res) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : req.headers.authorization;
    const tokenKey = `token:${token}`;
    await redisClient.del(tokenKey);
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Erreur logoutPatient:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.user.id_patient, {
      attributes: { exclude: ['password'] },
    });
    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }
    res.json(patient);
  } catch (error) {
    console.error('Erreur getProfile:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { prenom, nom, telephone, email, password, sexe, date_naissance, adresse, commune, personne_urgence, langue_pref } = req.body;

    const patient = await Patient.findByPk(req.user.id_patient);
    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }

    if (email && email !== patient.email) {
      const existingPatient = await Patient.findOne({ where: { email } });
      if (existingPatient) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }
    }

    if (sexe && !['M', 'F'].includes(sexe)) {
      return res.status(400).json({ error: 'Sexe doit être M ou F' });
    }

    await patient.update({
      prenom: prenom !== undefined ? prenom : patient.prenom,
      nom: nom !== undefined ? nom : patient.nom,
      telephone: telephone || patient.telephone,
      email: email || patient.email,
      password: password || patient.password,
      sexe: sexe !== undefined ? sexe : patient.sexe,
      date_naissance: date_naissance !== undefined ? date_naissance : patient.date_naissance,
      adresse: adresse !== undefined ? adresse : patient.adresse,
      commune: commune !== undefined ? commune : patient.commune,
      metriques: req.body.metriques !== undefined ? req.body.metriques : patient.metriques,
      personne_urgence: personne_urgence !== undefined ? personne_urgence : patient.personne_urgence,
      langue_pref: langue_pref || patient.langue_pref,
    });

    const responsePatient = { ...patient.get(), password: undefined };
    res.json(responsePatient);
  } catch (error) {
    console.error('Erreur updateProfile:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  loginPatient,
  logoutPatient,
  getProfile,
  updateProfile,
};