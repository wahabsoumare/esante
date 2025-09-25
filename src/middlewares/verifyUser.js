const jwt = require("jsonwebtoken");
const { Doctor, User } = require("../models");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized access : Token missing or incorrectly formatted" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const isDoctor = async (req, res, next) => {
    if (req.user.role !== "DOCTOR") {
        return res.status(403).json({ message: "Access denied : Only doctors are allowed" });
    }

    try {
        const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
        if (!doctor || doctor.validationStatus !== "APPROVED") {
            return res.status(403).json({ message: "Access denied : Your doctor account has not yet been validated" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const isPatient = (req, res, next) => {
    if (req.user.role !== "PATIENT") {
        return res.status(403).json({ message: "Access denied : Only patients are allowed" });
    }
    next();
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Access denied : Only administrators are authorized" });
    }
    next();
};


module.exports = { verifyToken, isDoctor, isPatient, isAdmin };