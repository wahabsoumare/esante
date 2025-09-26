const Sequilize = require('sequelize');
const config = require('../config/db.config');
const sequelize = new Sequilize(config)

const db = {};

db.User = require('./user')(sequelize);
db.Patient = require('./patient')(sequelize);
db.Doctor = require('./doctor')(sequelize);

db.Specialite = require('./specialite')(sequelize);
db.MedecinSpecialite = require('./medecin_specialite')(sequelize);
db.RendezVous = require('./rendezvous')(sequelize);
db.Consultation = require('./consultation')(sequelize);
db.Ordonnance = require('./ordonnance')(sequelize);
db.Prescription = require('./prescription')(sequelize);
db.Analyse = require('./analyse')(sequelize);
db.Disponibilite = require('./disponibilite')(sequelize);

db.Sequelize = sequelize;

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) db[modelName].associate(db);
});

module.exports = db;
