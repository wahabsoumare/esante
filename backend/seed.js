const db = require('./src/models');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
    try {
        console.log("Synchronizing database...");
        await db.sequelize.sync({ force: true });

        // Hasher les mots de passe
        const hashPassword = async (password) => {
            const saltRounds = 10;
            return await bcrypt.hash(password, saltRounds);
        }

        const adminUser = await db.User.create({
            lastname: "Admin",
            firstname: "Super",
            email: "admin@super.com",
            phone: "0000000000",
            dateOfBirth: "1980-01-01",
            gender: "MALE",
            role: "ADMIN",
            password: await hashPassword("admin123")
        });

        const patientUser = await db.User.create({
            lastname: "Toto",
            firstname: "Fall",
            email: "toto@fall.com",
            phone: "1111111111",
            dateOfBirth: "1990-05-15",
            gender: "MALE",
            role: "PATIENT",
            password: await hashPassword("toto123")
        });

        const doctorUser = await db.User.create({
            lastname: "Soumare",
            firstname: "Wahab",
            email: "wahab@soumare.com",
            phone: "2222222222",
            dateOfBirth: "1985-03-20",
            gender: "MALE",
            role: "DOCTOR",
            password: await hashPassword("wahab123")
        });

        // ----------- Patients & Doctors -----------
        const patient = await db.Patient.create({
            userId: patientUser.id,
            bloodType: "O+",
            allergies: ["pollen"],
            antecedents: "Asthme"
        });

        const doctor = await db.Doctor.create({
            userId: doctorUser.id,
            specialty: "Surgeon Of Death",
            locality: "Dakar",
            cabinetAddress: "Rue des Medecins",
            validationStatus: "APPROVED"
        });

        // ----------- Specialites -----------
        const surgeon = await db.Specialite.create({ name: "Surgeon" });
        const dermato = await db.Specialite.create({ name: "Dermatologie" });

        await doctor.addSpecialite(surgeon); // association doctor -> specialite

        // ----------- RendezVous -----------
        const rendezvous = await db.RendezVous.create({
            patient_id: patient.id,
            medecin_id: doctor.id,
            date_heure: new Date(),
            motif: "Consultation générale",
            statut: "confirme"
        });

        // ----------- Consultation -----------
        const consultation = await db.Consultation.create({
            rendezvous_id: rendezvous.id,
            date_consultation: new Date(),
            rapport: "Patient en bonne santé générale"
        });

        // ----------- Ordonnance -----------
        const ordonnance = await db.Ordonnance.create({
            consultation_id: consultation.id,
            contenu: "Prendre 1 comprimé de vitamine C par jour",
            signature_numerique: "ABC123SIGN"
        });

        // ----------- Prescription -----------
        const prescription = await db.Prescription.create({
            ordonnance_id: ordonnance.id,
            description: "Vitamine C",
            periode: "10 jours",
            indications: "1 comprimé chaque matin"
        });

        // ----------- Analyse -----------
        const analyse = await db.Analyse.create({
            ordonnance_id: ordonnance.id,
            description: "Analyse sanguine complète",
            date_heure: new Date(),
            resultat: "Tout est normal"
        });

        // ----------- Disponibilites -----------
        await db.Disponibilite.create({
            medecin_id: doctor.id,
            start_ts: new Date(Date.now() + 3600000), // +1h
            end_ts: new Date(Date.now() + 7200000),   // +2h
            status: "disponible"
        });

        console.log("Database successfully populated!");
        process.exit(0);

    } catch (error) {
        console.error("Error during population :", error);
        process.exit(1);
    }
}

seedDatabase();
