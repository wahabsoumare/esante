const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/consultationController');

router.post('/', ctrl.create);
router.get('/by-rdv/:rendezvous_id', ctrl.getByRdv);

module.exports = router;
