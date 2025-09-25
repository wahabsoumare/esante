const { Patient, User } = require("../models");

const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await Patient.findOne({
            where: { userId: id },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["firstname", "lastname", "email", "phone", "gender", "dateOfBirth"],
                },
            ],
        });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({ patient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { getPatientById };
