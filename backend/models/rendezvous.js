// models/rendezvous.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connexion');

const Medecin = require('./medecin');
const Patient = require('./patient');
const Disponibilite = require('./disponibilite'); // suppose que ce fichier existe

const RendezVous = sequelize.define(
  'RendezVous',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    medecinId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // référence logique vers Medecin.idm
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      // référence logique vers Patient.id_patient
    },
    disponibiliteId: {
      type: DataTypes.INTEGER,
      allowNull: true // optionnel si réservation depuis template
    },
    dateRdv: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    heureDebut: {
      type: DataTypes.TIME,
      allowNull: false
    },
    heureFin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    statut: {
      type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  },
  {
    tableName: 'rendezvous',
    timestamps: true
  }
);

// Associations (utiles si tu relies via include)
RendezVous.belongsTo(Medecin, { foreignKey: 'medecinId', as: 'medecin' });
RendezVous.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
RendezVous.belongsTo(Disponibilite, { foreignKey: 'disponibiliteId', as: 'disponibilite' });

module.exports = RendezVous;
