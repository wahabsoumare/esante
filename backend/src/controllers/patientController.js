const { Patient, User } = require("../models");

const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findOne({
            where: { userId: id },
            include: [{
                model: User,
                as: "user",
                attributes: ["firstname", "lastname", "email", "phone", "gender", "dateOfBirth"],
            }],
        });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            where: { userId: req.user.id },
            include: [{
                model: User,
                as: "user",
                attributes: { exclude: ["password"] }
            }]
        });

        if (!patient) {
            return res.status(404).json({ message: "Patient profile not found" });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const updateMyProfile = async (req, res) => {
    const { bloodType, allergies, antecedents, firstname, lastname, phone, adress, dateOfBirth, gender } = req.body;

    try {
        const patient = await Patient.findOne({ where: { userId: req.user.id } });
        if (!patient) {
            return res.status(404).json({ message: "Patient profile not found" });
        }
        await patient.update({ bloodType, allergies, antecedents });

        const user = await User.findByPk(req.user.id);
        await user.update({ firstname, lastname, phone, adress, dateOfBirth, gender });

        res.status(200).json({ message: "Profile successfully updated" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    getPatientById,
    getMyProfile,
    updateMyProfile
};