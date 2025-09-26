const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ordonnanceController');

router.post('/', ctrl.create);
router.get('/by-consultation/:consultation_id', ctrl.getByConsultation);

module.exports = router;
