const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors'); 
const path = require('path');

const etablissementRoutes = require('./routes/etablissementRoutes');
const patientRoutes = require('./routes/patientRoutes');
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const disponibiliteRoutes = require('./routes/disponibiliteRoutes')
const rendezvousRoutes = require('./routes/rendezvousRoutes');
const sequelize = require('./config/connexion');
const redisClient = require('./config/redis');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Activer CORS (autoriser le frontend)
app.use(cors({
  origin: '*', // Autoriser seulement le frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Annee-Id'],
  credentials: true,
}));

// Servir les fichiers statiques du dossier Uploads
//app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

app.use("/Uploads", express.static(
  path.join(__dirname, "Uploads"),
  {
    setHeaders: (res/*, filePath */) => {
      // CORP: permet à d’autres origins d’afficher l’image
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      // CORS: optionnel pour <img>, pratique si tu fais des fetch
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    }
  }
));
// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // Limite de requêtes
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
// });
// app.use(limiter);

app.use('/api/disponibilites', disponibiliteRoutes);
app.use('/api/etablissements', etablissementRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/rendezvous', rendezvousRoutes);

// Gestion 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ressource non trouvée' });
});

// Gestion erreurs serveur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;