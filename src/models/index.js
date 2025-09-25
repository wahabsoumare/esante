const Sequilize = require('sequelize');
const config = require('../config/db.config');
const sequelize = new Sequilize(config)

const User = require('./user')(sequelize);
const Patient = require('./patient')(sequelize);
const Doctor = require('./doctor')(sequelize);

Object.values(sequelize.models).forEach((model) => {
    if (model.associate) {
        model.associate(sequelize.models);
    }
});

module.exports = { sequelize, User, Patient, Doctor };