const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/disponibiliteController');

router.post('/', ctrl.create);
router.get('/medecin/:medecin_id', ctrl.listByMedecin);

module.exports = router;
