const { Doctor, User } = require("../models");

const getAllApprovedDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            where: { validationStatus: "APPROVED" },
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "firstname", "lastname", "email", "phone"]
            }],
            attributes: ["specialty", "locality", "cabinetAddress"]
        });
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: " Internal server error", error: error.message });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            where: { userId: req.user.id },
            include: [{
                model: User,
                as: "user",
                attributes: { exclude: ["password"] }
            }]
        });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: "Interval server error", error: error.message });
    }
};

const updateMyProfile = async (req, res) => {
    const { specialty, locality, cabinetAddress, firstname, lastname, phone, adress } = req.body;

    try {
        const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }
        await doctor.update({ specialty, locality, cabinetAddress });

        const user = await User.findByPk(req.user.id);
        await user.update({ firstname, lastname, phone, adress });

        res.status(200).json({ message: "Profile successfully updated" });
    } catch (error) {
        res.status(500).json({ message: "Interval server error", error: error.message });
    }
};

module.exports = {
    getAllApprovedDoctors,
    getMyProfile,
    updateMyProfile
};