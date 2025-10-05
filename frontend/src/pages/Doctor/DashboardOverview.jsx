import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../config/axios";
import { User, CalendarCheck, Users, Star } from "lucide-react";

export default function DashboardOverview() {
  const [profile, setProfile] = useState(null);
  const [rendezvous, setRendezvous] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Récupération du token
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, rdvRes] = await Promise.all([
          api.get("/api/utilisateurs/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/rendezvous/medecin/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProfile(profileRes.data);
        setRendezvous(rdvRes.data);
      } catch (err) {
        console.error("Erreur chargement dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <p className="text-lg text-gray-600">Chargement du tableau de bord...</p>;
  }

  // 🔹 Calculs
  const today = new Date().toISOString().split("T")[0];
  const consultationsToday = rendezvous.filter(
    (rdv) => rdv.dateRdv === today && rdv.statut === "CONFIRMED"
  ).length;

  const patientsUniques = [
    ...new Set(rendezvous.map((rdv) => rdv.patient?.id_patient)),
  ].length;

  const rdvRecents = [...rendezvous]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const rdvProchains = rendezvous
    .filter((r) => new Date(r.dateRdv) >= new Date(today))
    .sort((a, b) => new Date(a.dateRdv) - new Date(b.dateRdv))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          👨‍⚕️ Tableau de bord médecin
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          ✅ Disponible
        </motion.button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500"
        >
          <div className="flex items-center gap-3">
            <CalendarCheck className="text-green-500" />
            <div>
              <p className="text-gray-500">Consultations aujourd’hui</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {consultationsToday}
              </h2>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500"
        >
          <div className="flex items-center gap-3">
            <Users className="text-green-500" />
            <div>
              <p className="text-gray-500">Patients suivis</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {patientsUniques}
              </h2>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500"
        >
          <div className="flex items-center gap-3">
            <Star className="text-green-500" />
            <div>
              <p className="text-gray-500">Note moyenne</p>
              <h2 className="text-3xl font-bold text-gray-800">4.8 ⭐</h2>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rendez-vous récents */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <CalendarCheck className="text-green-500" /> Rendez-vous récents
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">Patient</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Heure</th>
                <th className="py-2 px-4">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rdvRecents.map((rdv) => (
                <tr key={rdv.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {rdv.patient?.prenom} {rdv.patient?.nom}
                  </td>
                  <td className="py-2 px-4">{rdv.dateRdv}</td>
                  <td className="py-2 px-4">{rdv.heureDebut}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        rdv.statut === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : rdv.statut === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {rdv.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prochains rendez-vous */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <CalendarCheck className="text-green-500" /> Prochains rendez-vous
        </h2>
        <ul className="space-y-3">
          {rdvProchains.map((rdv) => (
            <li
              key={rdv.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {rdv.patient?.prenom} {rdv.patient?.nom}
                </p>
                <p className="text-gray-500 text-sm">
                  {rdv.dateRdv} • {rdv.heureDebut}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  rdv.statut === "CONFIRMED"
                    ? "bg-green-100 text-green-700"
                    : rdv.statut === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {rdv.statut}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Informations médecin */}
      {profile && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <User className="text-green-500" /> À propos du médecin
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Nom :</strong> {profile.prenomu} {profile.nomu}
            </p>
            <p>
              <strong>Email :</strong> {profile.emailu}
            </p>
            <p>
              <strong>Téléphone :</strong> {profile.telephoneu}
            </p>
            <p>
              <strong>Adresse :</strong> {profile.adresse}
            </p>
            <p>
              <strong>Spécialité :</strong> {profile.medecin?.specialite}
            </p>
            <p>
              <strong>État :</strong>{" "}
              <span
                className={`font-semibold ${
                  profile.etat === "actif" ? "text-green-600" : "text-red-600"
                }`}
              >
                {profile.etat}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
