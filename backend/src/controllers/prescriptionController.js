const db = require("../models");
const { Prescription } = db;

exports.create = async (req, res) => {
  try {
    const pres = await Prescription.create(req.body);
    res.status(201).json(pres);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.listByOrdonnance = async (req, res) => {
  try {
    const pres = await Prescription.findAll({ where: { ordonnance_id: req.params.ordonnance_id } });
    res.json(pres);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
