const express = require('express');
const app = express();
const { sequelize } = require('./src/models');

const authRoutes = require('./src/routes/authRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server listens on port ${PORT}`);
    try {
        await sequelize.sync({ alter: true });
        console.log('Database Synchronized');
    } catch (error) {
        console.error('Unable to connect to the database :', error);
    }
});