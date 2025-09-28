import { useEffect, useState } from "react";
import axios from "axios";

export default function PatientStats({ patientId }) {
  const [patient, setPatient] = useState(null);
  const [rendezvous, setRendezvous] = useState([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Récupération des infos du patient
        const resPatient = await axios.get(`/api/patients/${patientId}`);
        setPatient(resPatient.data);

        // Récupération des rendez-vous du patient
        const resRdv = await axios.get(`/api/rendezvous/patient/${patientId}`);
        // Vérifie que c'est bien un tableau
        const rdvArray = Array.isArray(resRdv.data)
          ? resRdv.data
          : resRdv.data?.rendezvous || resRdv.data?.data || [];
        setRendezvous(rdvArray);
      } catch (error) {
        console.error("Erreur récupération données patient :", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  if (!patient) return <div>Chargement...</div>;

  // Calcul des stats en sécurité
  const prochainsRdv = Array.isArray(rendezvous)
    ? rendezvous.filter(r => new Date(r.date_heure) > new Date()).length
    : 0;

  const teleconsultations = Array.isArray(rendezvous)
    ? rendezvous.filter(r => r.motif?.toLowerCase().includes("téléconsultation")).length
    : 0;

  const notificationsActives = patient.metriques?.notifications || 0;
  const indicateursSuivis = patient.metriques?.indicateurs?.length || 0;

  const cards = [
    { label: 'Prochains rendez-vous', value: prochainsRdv },
    { label: 'Téléconsultations ce mois', value: teleconsultations },
    { label: 'Notifications actives', value: notificationsActives },
    { label: 'Indicateurs suivis', value: indicateursSuivis },
  ];

  return (
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
          Ici vous verrez vos stats, vos prochains rendez-vous et le suivi de vos indicateurs.
        </p>
      </div>
    </div>
  );
}
