const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Patient = sequelize.define("Patient", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        bloodType: {
            type: DataTypes.ENUM("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"),
            allowNull: true,
        },
        allergies: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
        antecedents: { type: DataTypes.TEXT, allowNull: true },
    });

    Patient.associate = (models) => {
        Patient.belongsTo(models.User, { foreignKey: "userId", as: "user" });
        Patient.hasMany(models.RendezVous, {
            foreignKey: "patient_id",
            as: "rendezvous",
        });
    };

    return Patient;
};
