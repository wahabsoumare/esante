<<<<<<< HEAD
export default function PatientStats() {
  const cards = [
    { label: 'Prochains rendez-vous', value: 2 },
    { label: 'Téléconsultations ce mois', value: 1 },
    { label: 'Notifications actives', value: 3 },
    { label: 'Indicateurs suivis', value: 5 },
  ]
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c,i)=>(
        <div key={i} className="card">
          <div className="text-3xl font-bold text-brand-900">{c.value}</div>
          <div className="small-muted mt-1">{c.label}</div>
        </div>
      ))}
      <div className="card sm:col-span-2">
        <div className="h3">Bienvenue 👋</div>
        <p className="mt-2 text-zinc-600 text-sm">Ici vous verrez vos stats, vos prochains rendez-vous et le suivi de vos indicateurs.</p>
=======
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PatientStats({ patientId }) {
  const [patient, setPatient] = useState(null);
  const [rendezvous, setRendezvous] = useState([]);
  const [indicateursSuivis, setIndicateursSuivis] = useState(0);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:3000/api/patients/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      navigate("/login"); // ou "/" selon ta route de redirection
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const resPatient = await axios.get(`/api/patients/${patientId}`);
        setPatient(resPatient.data);

        const resRdv = await axios.get(`/api/rendezvous/patient/${patientId}`);
        const rdvArray = Array.isArray(resRdv.data)
          ? resRdv.data
          : resRdv.data?.rendezvous || resRdv.data?.data || [];
        setRendezvous(rdvArray);

        const token = localStorage.getItem("token");
        const axiosInstance = axios.create({
          baseURL: "http://localhost:3000/api",
          headers: { Authorization: `Bearer ${token}` },
        });

        const { data } = await axiosInstance.get("/patients/profile");
        const metricsCount = Object.keys(data.metriques || {}).length;
        setIndicateursSuivis(metricsCount);
      } catch (error) {
        console.error("Erreur récupération données patient :", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  if (!patient) return <div>Chargement...</div>;

  const prochainsRdv = Array.isArray(rendezvous)
    ? rendezvous.filter((r) => new Date(r.date_heure) > new Date()).length
    : 0;

  const teleconsultations = Array.isArray(rendezvous)
    ? rendezvous.filter((r) =>
        r.motif?.toLowerCase().includes("téléconsultation")
      ).length
    : 0;

  const notificationsActives = patient.metriques?.notifications || 0;

  const cards = [
    { label: "Prochains rendez-vous", value: prochainsRdv },
    { label: "Téléconsultations ce mois", value: teleconsultations },
    { label: "Notifications actives", value: notificationsActives },
    { label: "Indicateurs suivis", value: indicateursSuivis },
  ];

  return (
    <div>
      {/* Bouton Déconnexion */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Déconnexion
        </button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="card">
            <div className="text-3xl font-bold text-brand-900">{c.value}</div>
            <div className="small-muted mt-1">{c.label}</div>
          </div>
        ))}

        <div className="card sm:col-span-2">
          <div className="h3">Bienvenue {patient.prenom} 👋</div>
          <p className="mt-2 text-zinc-600 text-sm">
            Ici vous verrez vos stats, vos prochains rendez-vous et le suivi de
            vos indicateurs.
          </p>
        </div>
>>>>>>> f9782aab274e989495c6f3b5bdab8854974eff80
      </div>
    </div>
  )
}
