const express = require("express");
const app = express();
require("dotenv").config();
const { sequelize } = require("./src/models");

// Middlewares
app.use(express.json());

// Routes
const authRoutes = require("./src/routes/auth");
const patientRoutes = require("./src/routes/patient");

app.use("/api/auth", authRoutes);
app.use("/api", patientRoutes);

// Route test
app.get("/", (req, res) => res.send("Server is running!"));

// Démarrage serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log("DB connected");
    } catch (err) {
        console.error("DB connection error:", err);
    }
});