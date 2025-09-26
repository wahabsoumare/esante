const express = require("express");
const router = express.Router();
const { updateDoctorStatus, deleteDoctor } = require("../controllers/adminController");
const { verifyToken, isAdmin } = require("../middlewares/verifyUser");

router.put("/doctor/:doctorId/status", verifyToken, isAdmin, updateDoctorStatus);
router.delete("/doctor/:doctorId", verifyToken, isAdmin, deleteDoctor);

module.exports = router;