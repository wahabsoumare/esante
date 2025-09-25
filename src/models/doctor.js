const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Doctor = sequelize.define("Doctor", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },

        specialty: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        locality: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        cabinetAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        validationStatus: {
            type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
            allowNull: false,
            defaultValue: "PENDING",
        },
    });

    Doctor.associate = (models) => {
        Doctor.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user",
        });
    };

    return Doctor;
};
