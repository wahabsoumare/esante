const { DataTypes } = require('sequelize');
const sequelize = require('../config/connexion');
const Medecin = require('./medecin');

const Disponibilite = sequelize.define('Disponibilite', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  jour: {
    type: DataTypes.ENUM(
      'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'
    ),
    allowNull: false,
  },
  heureDebut: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  heureFin: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'disponibilites',
  timestamps: true,
});

Disponibilite.belongsTo(Medecin, { foreignKey: 'medecinId', as: 'medecin' });
Medecin.hasMany(Disponibilite, { foreignKey: 'medecinId', as: 'disponibilites' });

module.exports = Disponibilite;
