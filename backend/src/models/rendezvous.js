const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RendezVous = sequelize.define("RendezVous", {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    patient_id: { type: DataTypes.UUID, allowNull: false },
    medecin_id: { type: DataTypes.UUID, allowNull: false },
    date_heure: { type: DataTypes.DATE, allowNull: false },
    motif: { type: DataTypes.TEXT },
    statut: { type: DataTypes.ENUM("confirme", "annule", "en_attente"), allowNull: false, defaultValue: "en_attente" },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "rendezvous",
    timestamps: false
  });

  RendezVous.associate = (models) => {
    RendezVous.belongsTo(models.Patient, { foreignKey: "patient_id", as: "patient" });
    RendezVous.belongsTo(models.Doctor, { foreignKey: "medecin_id", as: "medecin" });
    RendezVous.hasOne(models.Consultation, { foreignKey: "rendezvous_id", as: "consultation" });
    RendezVous.hasOne(models.Prescription, { foreignKey: "rendezvousId", as: "prescription" });
  };

  return RendezVous;
};