const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connexion');

const Etablissement = sequelize.define(
  'Etablissement',
  {
    id_etablissement: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nom: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: DataTypes.ENUM('Hopital', 'CentreSante', 'Cabinet'),
      allowNull: false,
      validate: {
        isIn: [['Hopital', 'CentreSante', 'Cabinet']],
      },
    },
    adresse: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    commune: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    actif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    cree_le: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'etablissements',
    timestamps: false,
  }
);

module.exports = Etablissement;