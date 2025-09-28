const sequelize = require('./config/connexion'); // ta connexion Sequelize
const Patient = require('./models/patient');
const utilisateur = require('./models/utilisateur');
const Etablissement = require('./models/etablissement');

const resetDatabase = async () => {
    try {
        console.log('Réinitialisation de la base de données en cours...');

        // ⚠️ force: true supprime toutes les tables existantes
        await sequelize.sync({ force: true });

        console.log('Toutes les tables ont été supprimées et recréées !');

        // Exemple : créer un patient de test
        await Patient.create({
            prenom: 'Toto',
            nom: 'Fall',
            telephone: '0000000000',
            email: 'toto@fall.com',
            password: 'toto123',
            sexe: 'M',
            langue_pref: 'fr',
            role: 'patient',
        });

        console.log('Données de test créées !');
        process.exit(0);
    } catch (err) {
        console.error('Erreur lors de la réinitialisation :', err);
        process.exit(1);
    }
};

resetDatabase();
