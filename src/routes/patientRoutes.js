const express = require("express");
const router = express.Router();
const { getPatientById, getMyProfile, updateMyProfile } = require("../controllers/patientController");
const { verifyToken, isDoctor, isPatient } = require("../middlewares/verifyUser");

router.get("/:id", verifyToken, isDoctor, getPatientById);

router.get("/me/profile", verifyToken, isPatient, getMyProfile);

router.put("/me/profile", verifyToken, isPatient, updateMyProfile);

module.exports = router;