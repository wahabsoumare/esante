const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MedecinSpecialite = sequelize.define("MedecinSpecialite", {
    medecin_id: { type: DataTypes.UUID, allowNull: false, references: { model: "Doctors", key: "id" } },
    specialite_id: { type: DataTypes.UUID, allowNull: false, references: { model: "Specialites", key: "id" } }
  }, {
    tableName: "medecin_specialites",
    timestamps: false
  });

  return MedecinSpecialite;
};