module.exports = (sequelize, DataTypes) => {
  const MedecinSpecialite = sequelize.define('MedecinSpecialite', {
    medecin_user_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    specialite_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true }
  }, {
    tableName: 'medecin_specialite',
    timestamps: false
  });

  return MedecinSpecialite;
};
