const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Analyse = sequelize.define('Analyse', {
    id: { 
      type: DataTypes.UUID, primaryKey: true, 
      defaultValue: DataTypes.UUIDV4 
    },
    ordonnance_id: { 
      type: DataTypes.UUID 
    },
    description: { 
      type: DataTypes.TEXT 
    },
    date_heure: { 
      type: DataTypes.DATE 
    },
    resultat: { 
      type: DataTypes.TEXT 
    }
  }, {
    tableName: 'analyses',
    timestamps: false
  });

    Analyse.associate = (models) => {
    Analyse.belongsTo(models.Ordonnance, { foreignKey: 'ordonnance_id', as: 'ordonnance' });
  };

  return Analyse;
};
