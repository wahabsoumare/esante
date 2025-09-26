const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Consultation = sequelize.define('Consultation', {
    id: { type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4 
    },
    rendezvous_id: {
      type: DataTypes.UUID, 
      unique: true 
    },
    date_consultation: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    rapport: {
      type: DataTypes.TEXT  
    }
  }, {
    tableName: 'consultations',
    timestamps: false
  });

  Consultation.associate = (models) => {
  Consultation.belongsTo(models.RendezVous, { foreignKey: 'rendezvous_id', as: 'rendezvous' });
  Consultation.hasMany(models.Ordonnance, { foreignKey: 'consultation_id', as: 'ordonnances' });
  };

  return Consultation;
};
