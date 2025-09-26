const { Doctor, User } = require("../models");

const updateDoctorStatus = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { validationStatus } = req.body;

        if (!["APPROVED", "REJECTED", "PENDING"].includes(validationStatus)) {
            return res.status(400).json({ message: "Invalid validation status" });
        }

        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        await doctor.update({ validationStatus });

        res.status(200).json({
            message: `Doctor status updated to ${validationStatus}`,
            doctor,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const user = await User.findByPk(doctor.userId);
        if (!user) {
            return res.status(404).json({ message: "Associated user not found" });
        }

        await doctor.destroy();
        await user.destroy();

        res.status(200).json({ message: "Doctor and associated user deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { updateDoctorStatus, deleteDoctor };