const db = require("../models");
const { Ordonnance, Consultation } = db;

exports.create = async (req, res) => {
  try {
    const { consultation_id, contenu, signature_numerique } = req.body;
    const consult = await Consultation.findByPk(consultation_id);
    if (!consult) return res.status(404).json({ error: "Consultation non trouvée" });

    const ord = await Ordonnance.create({ consultation_id, contenu, signature_numerique });
    res.status(201).json(ord);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getByConsultation = async (req, res) => {
  try {
    const ords = await Ordonnance.findAll({ where: { consultation_id: req.params.consultation_id } });
    res.json(ords);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
