const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Disponibilite = sequelize.define('Disponibilite', {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4 
    },
    medecin_id: { 
      type: DataTypes.UUID 
    },
    start_ts: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
    end_ts: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
    status: { 
      type: DataTypes.ENUM('disponible','reserve'), 
      defaultValue: 'disponible' 
    }
  }, {
    tableName: 'disponibilite',
    timestamps: false
  });

  Disponibilite.associate = (models) => {
  Disponibilite.belongsTo(models.Doctor, { foreignKey: 'medecin_id', as: 'medecin' });
  
  };

  return Disponibilite;
};
