const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Patient, Doctor } = require("../models");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            email,
            phone,
            role,
            adress,
            password,
            dateOfBirth,
            gender,
            bloodType,
            allergies,
            antecedents,
            validationStatus,
            cabinetAddress,
            specialty,
            locality,
        } = req.body;

        if (!phone || !role || !password) {
            return res.status(400).json({ message: "Phone, role and password are required" });
        }

        const existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            return res.status(400).json({ message: "User with this phone number already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstname,
            lastname,
            gender,
            email,
            phone,
            dateOfBirth,
            adress,
            createdAt: new Date(),
            role: role.toUpperCase(),
            password: hashedPassword,
        });

        const userRole = role.toUpperCase();

        if (userRole === "PATIENT") {
            await Patient.create({
                userId: newUser.id,
                bloodType,
                allergies,
                antecedents,
            });
        } else if (userRole === "DOCTOR") {
            await Doctor.create({
                userId: newUser.id,
                specialty,
                locality,
                cabinetAddress,
                validationStatus: validationStatus || "PENDING",
            });
        }

        const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                profile:
                    userRole === "PATIENT"
                        ? { dateOfBirth, gender, bloodType, allergies, antecedents }
                        : { specialty, locality, cabinetAddress, validationStatus },
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = { register, login };