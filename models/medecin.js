// models/Medecin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/connexion');
const Utilisateur = require('./utilisateur');

const Medecin = sequelize.define(
  'Medecin',
  {
    idm: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    specialite: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    utilisateurId: {
      type: DataTypes.INTEGER,
      references: {
        model: Utilisateur,
        key: 'idu',
    },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'medecins',
    timestamps: false,
  }
);

Utilisateur.hasOne(Medecin, { foreignKey: 'utilisateurId', as: 'medecin' });
Medecin.belongsTo(Utilisateur, { foreignKey: 'utilisateurId', as: 'utilisateur' });

module.exports = Medecin;
