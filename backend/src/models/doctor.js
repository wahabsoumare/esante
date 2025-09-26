const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Doctor = sequelize.define("Doctor", {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
        specialty: { type: DataTypes.STRING, allowNull: false },
        locality: { type: DataTypes.STRING, allowNull: false },
        cabinetAddress: { type: DataTypes.STRING, allowNull: false },
        validationStatus: { type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"), allowNull: false, defaultValue: "PENDING" }
    });

    Doctor.associate = (models) => {
        Doctor.belongsTo(models.User, { foreignKey: "userId", as: "user" });
        Doctor.belongsToMany(models.Specialite, {
            through: models.MedecinSpecialite,
            foreignKey: "medecin_id",
            otherKey: "specialite_id"
        });
        Doctor.hasMany(models.RendezVous, { foreignKey: "medecin_id", as: "rendezvous" });
        Doctor.hasMany(models.Disponibilite, { foreignKey: "medecin_id", as: "disponibilites" });
    };

    return Doctor;
};