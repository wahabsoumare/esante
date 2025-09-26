const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize } = require('./src/models');

app.use(cors());

const authRoutes = require('./src/routes/authRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const rendezvousRoutes = require('./src/routes/rendezvousRoutes');
const ordonnanceRoutes = require('./src/routes/ordonnanceRoutes');
const analyseRoutes = require('./src/routes/analyseRoutes');
const prescriptionRoutes = require('./src/routes/prescriptionRoutes');
const specialiteRoutes = require('./src/routes/specialiteRoutes');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rendezvous', rendezvousRoutes);
app.use('/api/ordonnances', ordonnanceRoutes);
app.use('/api/analyses', analyseRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/specialites', specialiteRoutes);

app.use('/', (req, res) => {
    res.send('Welcome to the API');
});

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