const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },

        adress: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        gender: {
            type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
            allowNull: false,
        },

        role: {
            type: DataTypes.ENUM('ADMIN', 'PATIENT', 'DOCTOR'),
            allowNull: false,
            defaultValue: 'PATIENT',
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    return User;
}