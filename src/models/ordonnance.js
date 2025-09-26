const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ordonnance = sequelize.define('Ordonnance', {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4 
    },

    consultation_id: { 
      type: DataTypes.UUID 
    },

    date_emission: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },

    contenu: { 
      type: DataTypes.TEXT 
    },
    
    signature_numerique: { 
      type: DataTypes.TEXT 
    }
  }, {
    tableName: 'ordonnance',
    timestamps: false
  });

  Ordonnance.associate = (models) => {
    Ordonnance.belongsTo(models.Consultation, { foreignKey: 'consultation_id', as: 'consultation' });
    Ordonnance.hasMany(models.Prescription, { foreignKey: 'ordonnance_id', as: 'prescriptions' });
    Ordonnance.hasMany(models.Analyse, { foreignKey: 'ordonnance_id', as: 'analyses' });
  };

  return Ordonnance;
};
