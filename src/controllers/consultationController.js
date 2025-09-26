const db = require("../models");
const { Consultation, RendezVous } = db;

exports.create = async (req, res) => {
  try {
    const { rendezvous_id, rapport } = req.body;
    const rdv = await RendezVous.findByPk(rendezvous_id);
    if (!rdv) return res.status(404).json({ error: "Rendez-vous introuvable" });

    const consult = await Consultation.create({ rendezvous_id, rapport });
    res.status(201).json(consult);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getByRdv = async (req, res) => {
  try {
    const consult = await Consultation.findOne({ where: { rendezvous_id: req.params.rendezvous_id } });
    if (!consult) return res.status(404).json({ error: "Consultation non trouvée" });
    res.json(consult);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
