const db = require("../models");
const { Specialite } = db;

exports.create = async (req, res) => {
  try {
    const s = await Specialite.create(req.body);
    res.status(201).json(s);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.list = async (req, res) => {
  try {
    const list = await Specialite.findAll();
    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
