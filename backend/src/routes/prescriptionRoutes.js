const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/prescriptionController');

router.post('/', ctrl.create);
router.get('/by-ordonnance/:ordonnance_id', ctrl.listByOrdonnance);

module.exports = router;
