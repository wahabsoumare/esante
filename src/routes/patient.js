const express = require("express");
const router = express.Router();
const { getPatientById } = require("../controllers/patientController");
const verifyDoctor = require("../middlewares/verifyUser");

router.get("/patient/:id", verifyUser, getPatientById);

module.exports = router;