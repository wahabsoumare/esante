const db = require("../models");
const { Disponibilite, Medecin } = db;

exports.create = async (req, res) => {
  try {
    const { medecin_id, start_ts, end_ts } = req.body;
    const med = await Medecin.findByPk(medecin_id);
    if (!med) return res.status(404).json({ error: "Médecin non trouvé" });

    const created = await Disponibilite.create({ medecin_id, start_ts, end_ts });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.listByMedecin = async (req, res) => {
  try {
    const rows = await Disponibilite.findAll({ where: { medecin_id: req.params.medecin_id } });
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
