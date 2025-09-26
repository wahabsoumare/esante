const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const User = sequelize.define("User", {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
        lastname: { type: DataTypes.STRING, allowNull: false },
        firstname: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
        adress: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true, defaultValue: DataTypes.NOW },
        gender: { type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"), allowNull: true },
        role: { type: DataTypes.ENUM("ADMIN", "PATIENT", "DOCTOR"), allowNull: true, defaultValue: "PATIENT" },
        password: { type: DataTypes.STRING, allowNull: false },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    User.associate = (models) => {
        User.hasOne(models.Patient, { foreignKey: "userId", as: "patient" });
        User.hasOne(models.Doctor, { foreignKey: "userId", as: "doctor" });
    };

    return User;
};