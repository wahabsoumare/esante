module.exports = (sequelize, DataTypes) => {
  const Prescription = sequelize.define('Prescription', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    ordonnance_id: { type: DataTypes.UUID },
    description: { type: DataTypes.TEXT },
    periode: { type: DataTypes.STRING(150) },
    indications: { type: DataTypes.TEXT }
  }, {
    tableName: 'prescription',
    timestamps: false
  });

  Prescription.associate = (models) => {
    Prescription.belongsTo(models.Ordonnance, { foreignKey: 'ordonnance_id', as: 'ordonnance' });
  };

  return Prescription;
};
