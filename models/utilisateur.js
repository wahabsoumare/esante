const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connexion');
const bcrypt = require('bcrypt');

const Utilisateur = sequelize.define(
  'Utilisateur',
  {
    idu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    prenomu: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nomu: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    sexe: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: [['M', 'F']],
      },
    },
    adresse: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    telephoneu: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    emailu: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    fonction: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    etat: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    typecompte: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: [['ROLE_ADMIN', 'ROLE_SECRETAIRE', 'ROLE_MEDECIN']],
      },
    },
    dateajout: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      validate: {
        isDate: true,
      },
    },
  },
  {
    tableName: 'utilisateurs',
    timestamps: false,
    hooks: {
      beforeCreate: async (utilisateur) => {
        if (utilisateur.password) {
          utilisateur.password = await bcrypt.hash(utilisateur.password, 10);
        }
      },
      beforeUpdate: async (utilisateur) => {
        if (utilisateur.changed('password') && utilisateur.password) {
          utilisateur.password = await bcrypt.hash(utilisateur.password, 10);
        }
      },
    },
  }
);

module.exports = Utilisateur;