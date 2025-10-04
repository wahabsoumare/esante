// src/pages/Doctor/AppointmentsView.jsx

import React, { useState, useEffect } from 'react';

// Données statiques (Simule la réponse de GET /api/appointments/doctor)
const mockAppointments = [
  { id: 1, patient: 'Marie Kant', date: '29/09/2025', time: '14:00', duration: '30min', motif: 'Consultation annuelle', status: 'Confirmé' },
  { id: 2, patient: 'Jean Traoré', date: '29/09/2025', time: '15:30', duration: '45min', motif: 'Suivi cardiaque', status: 'En attente' },
  { id: 3, patient: 'Fatou Sarr', date: '30/09/2025', time: '09:00', duration: '30min', motif: 'Contrôle tension', status: 'Confirmé' },
  { id: 4, patient: 'Ibrahima Fall', date: '01/10/2025', time: '11:00', duration: '60min', motif: 'Nouveau patient', status: 'Annulé' },
];

// Helper function pour déterminer la couleur du statut
const getStatusClasses = (status) => {
    switch (status) {
        case 'Confirmé':
            return 'bg-green-100 text-green-800';
        case 'En attente':
            return 'bg-yellow-100 text-yellow-800';
        case 'Annulé':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function AppointmentsView() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // --- Étape d'intégration API ---
        // Ici, vous ferez l'appel à votre API : GET /api/appointments/doctor
        
        setTimeout(() => {
            setAppointments(mockAppointments);
            setLoading(false);
        }, 300);
    }, []);

    if (loading) {
        return <h2 className="text-xl font-semibold">Chargement des rendez-vous...</h2>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">📅 Mes Rendez-vous</h1>
            
            {/* Filtres de la vue (à implémenter plus tard) */}
            <div className="flex space-x-4 mb-6">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Aujourd'hui</button>
                <button className="bg-white border text-gray-700 px-4 py-2 rounded-lg">Cette semaine</button>
                <button className="bg-white border text-gray-700 px-4 py-2 rounded-lg">Tous</button>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Heure</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motif</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {appointments.map((appt) => (
                            <tr key={appt.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.date} à {appt.time} ({appt.duration})</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.patient}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.motif}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(appt.status)}`}>
                                        {appt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900">Gérer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}