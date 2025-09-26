const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MedecinSpecialite = sequelize.define('MedecinSpecialite', {
    medecin_user_id: { 
      type: DataTypes.UUID, 
      allowNull: false, primaryKey: true 
    },
    specialite_id: {
      type: DataTypes.UUID, 
      allowNull: false, 
      primaryKey: true 
    }
  }, {
    tableName: 'medecin_specialites',
    timestamps: false
  });

  return MedecinSpecialite;
};
