const { sequelize } = require("./src/models");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à PostgreSQL réussie !");
    await sequelize.sync({ alter: true });
    console.log("Modèles synchronisés !");
  } catch (error) {
    console.error("Erreur de connexion :", error);
  } finally {
    await sequelize.close(); 
  }
})();