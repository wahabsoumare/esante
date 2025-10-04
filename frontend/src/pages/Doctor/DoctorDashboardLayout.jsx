// src/pages/Doctor/DashboardOverview.jsx

import React from 'react';

// NOTE : Vous devrez déplacer les mockData, StatsCard et autres composants
// non essentiels à la réutilisabilité ici ou dans un fichier data/mockData.js
// pour garder ce composant propre.

// Les données statiques que nous avions (juste pour l'exemple)
const mockData = {
    stats: [
        { label: "Consultations aujourd’hui", value: 12 },
        { label: "Patients suivis", value: 48 },
        { label: "Note moyenne", value: "4.8 ⭐" },
    ],
    recentAppointments: [
        { id: 1, patient: "Moussa Diop", motif: "Diabétologie", time: "10:30" },
        { id: 2, patient: "Aïcha Ndiaye", motif: "Pédiatrie", time: "14:00" },
    ],
    // ... (autres données)
};

const StatsCard = ({ label, value }) => (
    <div className="bg-white shadow-md rounded-xl p-6">
      <p className="text-gray-500">{label}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
);


const DashboardOverview = () => {
    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-2 border-b">
                <h1 className="text-3xl font-extrabold text-gray-800">
                    Tableau de bord
                </h1>
                <button className="bg-green-600 text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-green-700 transition">
                    ✅ Disponible
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {mockData.stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Conteneur principal (Rendez-vous et Infos) */}
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-3 lg:col-span-2 space-y-8">
                    {/* Rendez-vous Récents */}
                    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">Rendez-vous d'aujourd’hui</h2>
                        <ul className="divide-y divide-gray-100">
                            {mockData.recentAppointments.map(appt => (
                                <li key={appt.id} className="py-4 flex justify-between items-center text-gray-700">
                                    {/* ... Contenu du RDV ... */}
                                    <p className="font-semibold">{appt.patient}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Prochains rendez-vous (Tableau complet) */}
                    {/* ... (Code du tableau des RDV) ... */}
                </div>

                {/* Colonne Droite (Activité et Infos Médecin) */}
                <div className="col-span-3 lg:col-span-1 space-y-8">
                    {/* ... (Activité de la Semaine) ... */}
                    {/* ... (Infos médecin) ... */}
                </div>
            </div>
        </>
    );
};

export default DashboardOverview;