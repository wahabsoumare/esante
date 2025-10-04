// src/pages/Doctor/PatientsList.jsx

import React, { useState, useEffect } from 'react';

// Données statiques (Simule la réponse de GET /api/patients)
const mockAllPatients = [
  { id: 101, name: "Marie Kant", email: "m.kant@mail.com", phone: "77 123 45 67", age: 45, lastAppointment: "20/09/2025" },
  { id: 102, name: "Jean Traoré", email: "j.traore@mail.com", phone: "78 987 65 43", age: 62, lastAppointment: "15/09/2025" },
  { id: 103, name: "Fatou Sarr", email: "f.sarr@mail.com", phone: "70 111 22 33", age: 29, lastAppointment: "N/A" },
  { id: 104, name: "Moussa Diop", email: "m.diop@mail.com", phone: "76 543 21 00", age: 33, lastAppointment: "01/09/2025" },
];

export default function PatientsList() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // --- Étape d'intégration API ---
        // Ici, vous ferez l'appel à votre API : GET /api/patients
        // Le Backend doit être configuré pour accepter le rôle 'MEDECIN' sur cette route.
        
        setTimeout(() => {
            setPatients(mockAllPatients);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return <h2 className="text-xl font-semibold">Chargement de la liste des patients...</h2>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">👥 Liste de Tous les Patients Inscrits</h1>
            <p className="text-gray-600 mb-6">
              Aperçu des dossiers et coordonnées de tous les utilisateurs ayant le rôle "Patient".
            </p>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Âge</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernier RDV</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {patients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age} ans</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.lastAppointment}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-green-600 hover:text-green-900">Voir Dossier</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}