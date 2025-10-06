import React, { useEffect, useState } from "react";
import { FaUsers, FaUserMd, FaVideo } from "react-icons/fa";
import StatCard from "../../components/StatCard";
import api from "../../config/axios"; // ton axios déjà configuré

export default function Dashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    medecins: 0,
    rendezvous: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, medecinsRes, rdvRes] = await Promise.all([
          api.get("/api/patients"),
          api.get("/api/utilisateurs/public/medecins"),
          api.get("/api/rendezvous"),
        ]);

        setStats({
          patients: patientsRes.data?.length || 0,
          medecins: medecinsRes.data?.length || 0,
          rendezvous: rdvRes.data?.length || 0,
        });
      } catch (error) {
        console.error("Erreur récupération statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="h-auto w-full">
      <div className="flex px-5 py-10 items-center justify-between bg-white text-stone-600 border rounded-xl shadow-md">
        <div className="py-4">
          <h2 className="text-green-500 text-2xl font-bold">
            Tableau de bord - Téléconsultation
          </h2>
          <p>Supervision du projet eSanté - Données en temps réel</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full bg-blue-600 size-9 text-white font-bold flex items-center justify-center">
            AD
          </div>
          <div>
            <p className="text-lg">Admin</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<FaUsers />}
          value={loading ? "..." : stats.patients}
          label="Patients inscrits"
          color="text-blue-500"
        />

        <StatCard
          icon={<FaUserMd />}
          value={loading ? "..." : stats.medecins}
          label="Médecins actifs"
          color="text-green-500"
        />

        <StatCard
          icon={<FaVideo />}
          value={loading ? "..." : stats.rendezvous}
          label="Rendez-vous enregistrés"
          color="text-purple-500"
        />
      </div>
    </div>
  );
}
