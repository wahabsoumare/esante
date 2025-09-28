const Etablissement = require('../models/etablissement');

const getAllEtablissements = async (req, res) => {
  try {
    const etablissements = await Etablissement.findAll();
    res.json(etablissements);
  } catch (error) {
    console.error('Erreur getAllEtablissements:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

const getEtablissementById = async (req, res) => {
  try {
    const etablissement = await Etablissement.findByPk(req.params.id);
    if (!etablissement) {
      return res.status(404).json({ error: 'Établissement non trouvé' });
    }
    res.json(etablissement);
  } catch (error) {
    console.error('Erreur getEtablissementById:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

const createEtablissement = async (req, res) => {
  try {
    const { nom, type, adresse, commune, actif } = req.body;

    if (!nom || !type) {
      return res.status(400).json({ error: 'Les champs nom et type sont obligatoires' });
    }
    if (!['Hopital', 'CentreSante', 'Cabinet'].includes(type)) {
      return res.status(400).json({ error: 'Type d’établissement invalide' });
    }

    const newEtablissement = await Etablissement.create({
      nom,
      type,
      adresse,
      commune,
      actif: actif !== undefined ? actif : true,
    });

    res.status(201).json(newEtablissement);
  } catch (error) {
    console.error('Erreur createEtablissement:', error);
    res.status(400).json({ error: error.message });
  }
};

const updateEtablissement = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, type, adresse, commune, actif } = req.body;

    const etablissement = await Etablissement.findByPk(id);
    if (!etablissement) {
      return res.status(404).json({ error: 'Établissement non trouvé' });
    }

    if (type && !['Hopital', 'CentreSante', 'Cabinet'].includes(type)) {
      return res.status(400).json({ error: 'Type d’établissement invalide' });
    }

    await etablissement.update({
      nom: nom || etablissement.nom,
      type: type || etablissement.type,
      adresse: adresse !== undefined ? adresse : etablissement.adresse,
      commune: commune !== undefined ? commune : etablissement.commune,
      actif: actif !== undefined ? actif : etablissement.actif,
    });

    res.json(etablissement);
  } catch (error) {
    console.error('Erreur updateEtablissement:', error);
    res.status(400).json({ error: error.message });
  }
};

const deleteEtablissement = async (req, res) => {
  try {
    const { id } = req.params;
    const etablissement = await Etablissement.findByPk(id);
    if (!etablissement) {
      return res.status(404).json({ error: 'Établissement non trouvé' });
    }

    await etablissement.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erreur deleteEtablissement:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

module.exports = {
  getAllEtablissements,
  getEtablissementById,
  createEtablissement,
  updateEtablissement,
  deleteEtablissement,
};