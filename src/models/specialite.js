module.exports = (sequelize, DataTypes) => {
  const Specialite = sequelize.define('Specialite', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING(150), allowNull: false, unique: true }
  }, {
    tableName: 'specialites',
    timestamps: false
  });

  Specialite.associate = (models) => {
    Specialite.belongsToMany(models.Medecin, {
      through: models.MedecinSpecialite,
      foreignKey: 'specialite_id',
      otherKey: 'medecin_user_id',
      as: 'medecins'
    });
  };

  return Specialite;
};
