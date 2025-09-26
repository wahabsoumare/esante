const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Specialite = sequelize.define("Specialite", {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  });

  Specialite.associate = (models) => {
    Specialite.belongsToMany(models.Doctor, {
      through: models.MedecinSpecialite,
      foreignKey: "specialite_id",
      otherKey: "medecin_id"
    });
  };

  return Specialite;
};