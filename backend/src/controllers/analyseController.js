const db = require("../models");
const { Analyse } = db;

exports.create = async (req, res) => {
  try {
    const a = await Analyse.create(req.body);
    res.status(201).json(a);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.listByOrdonnance = async (req, res) => {
  try {
    const list = await Analyse.findAll({ where: { ordonnance_id: req.params.ordonnance_id } });
    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
