const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/specialiteController');

router.post('/', ctrl.create);
router.get('/', ctrl.list);

module.exports = router;
