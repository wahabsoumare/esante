const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connexion');
const bcrypt = require('bcrypt');

const Patient = sequelize.define(
  'Patient',
  {
    id_patient: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    prenom: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    telephone: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: { msg: 'Email invalide' },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        notEmpty: { msg: 'Mot de passe requis' },
      },
    },
    sexe: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      validate: {
        isIn: [['M', 'F']],
      },
    },
    date_naissance: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
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
    personne_urgence: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    langue_pref: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'fr',
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'patient',
      validate: {
        isIn: [['patient']],
      },
    },
    metriques: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    cree_le: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      validate: {
        isDate: true,
      },
    },
  },
  {
    tableName: 'patients',
    timestamps: false,
    hooks: {
      beforeCreate: async (patient) => {
        if (patient.password) {
          patient.password = await bcrypt.hash(patient.password, 10);
        }
      },
      beforeUpdate: async (patient) => {
        if (patient.changed('password') && patient.password) {
          patient.password = await bcrypt.hash(patient.password, 10);
        }
      },
    },
  }
);

module.exports = Patient;