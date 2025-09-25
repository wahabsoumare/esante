const express = require("express");
const router = express.Router();
const { getAllApprovedDoctors, getMyProfile, updateMyProfile } = require("../controllers/doctorController");
const { verifyToken, isDoctor, isPatient } = require("../middlewares/verifyUser");

router.get("/", verifyToken, isPatient, getAllApprovedDoctors);

router.get("/me", verifyToken, isDoctor, getMyProfile);

router.put("/me", verifyToken, isDoctor, updateMyProfile);

module.exports = router;