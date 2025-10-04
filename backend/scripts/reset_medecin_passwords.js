// scripts/reset_medecin_passwords.js
// Usage: node scripts/reset_medecin_passwords.js
// This script finds all Utilisateur accounts with typecompte === 'ROLE_MEDECIN' and
// sets a new random password for each using utilisateur.update({...}). The model's
// beforeUpdate hook will hash the new password correctly. The script prints email -> newPassword

const crypto = require('crypto');
const sequelize = require('../config/connexion');
const Utilisateur = require('../models/utilisateur');

const randomPassword = (len = 12) => crypto.randomBytes(len).toString('base64').slice(0, len);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB authenticated. Scanning medecins...');

    const medecins = await Utilisateur.findAll({ where: { typecompte: 'ROLE_MEDECIN' } });

    if (!medecins || medecins.length === 0) {
      console.log('No medecin accounts found.');
      process.exit(0);
    }

    console.log(`Found ${medecins.length} medecin(s). Resetting passwords...`);

    for (const user of medecins) {
      const newPass = randomPassword(12);
      // Update via instance.update so model hooks (beforeUpdate) run and hash the password
      await user.update({ password: newPass });
      console.log(`${user.emailu} -> ${newPass}`);
    }

    console.log('All done. Communicate the new passwords securely to users or force them to reset.');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting medecin passwords:', err);
    process.exit(1);
  }
})();
