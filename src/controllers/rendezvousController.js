const db = require("../models");
const { sequelize, RendezVous, Disponibilite } = db;

exports.create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { patient_id, medecin_id, date_heure, motif } = req.body;
    const dispo = await Disponibilite.findOne({
      where: {
        medecin_id,
        start_ts: { [db.Sequelize.Op.lte]: date_heure },
        end_ts: { [db.Sequelize.Op.gte]: date_heure }
      },
      transaction: t
    });

    if (!dispo) {
      await t.rollback();
      return res.status(400).json({ error: "Médecin non disponible à ce créneau" });
    }

    const rdv = await RendezVous.create({ patient_id, medecin_id, date_heure, motif }, { transaction: t });
    await t.commit();
    res.status(201).json(rdv);
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const rdvs = await RendezVous.findAll();
    res.json(rdvs);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const rdv = await RendezVous.findByPk(req.params.id, { include: [{ all: true }] });
    if (!rdv) return res.status(404).json({ error: "Rendez-vous non trouvé" });
    res.json(rdv);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const rdv = await RendezVous.findByPk(req.params.id);
    if (!rdv) return res.status(404).json({ error: "Rendez-vous non trouvé" });
    await rdv.update(req.body);
    res.json(rdv);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const rdv = await RendezVous.findByPk(req.params.id);
    if (!rdv) return res.status(404).json({ error: "Rendez-vous non trouvé" });
    await rdv.destroy();
    res.json({ message: "Supprimé" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
