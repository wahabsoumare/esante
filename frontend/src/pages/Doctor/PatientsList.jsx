// src/pages/Doctor/PatientsList.jsx
import React, { useState, useEffect } from 'react';
import api from '../../config/axios';

export default function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPatientsFromRdv = async () => {
      try {
        const res = await api.get('/api/rendezvous/medecin/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rendezvous = res.data || [];

        const patientMap = {};
        rendezvous.forEach((rdv) => {
          const p = rdv.patient;
          if (!p) return;

          const existing = patientMap[p.id_patient];
          const rdvDate = rdv.dateRdv;
          if (!existing || new Date(rdvDate) > new Date(existing.lastAppointment)) {
            patientMap[p.id_patient] = { ...p, lastAppointment: rdvDate };
          }
        });

        setPatients(Object.values(patientMap));
      } catch (err) {
        console.error('Erreur récupération patients via RDV:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsFromRdv();
  }, [token]);

  const handleVoirDossier = async (id) => {
    try {
      const res = await api.get(`/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPatient(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error('Erreur récupération dossier patient:', err);
      alert('Impossible de récupérer les informations du patient.');
    }
  };

  // 🔹 Filtrage par recherche
  const filteredPatients = patients.filter((p) =>
    `${p.prenom} ${p.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <h2 className="text-xl font-semibold">Chargement des patients...</h2>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">👥 Mes Patients</h1>
      <p className="text-gray-600 mb-4">Liste des patients ayant eu au moins un rendez-vous avec vous.</p>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom..."
        value={searchTerm}
        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
        className="border rounded-lg px-3 py-2 mb-4 w-full md:w-1/3"
      />

      {/* Tableau */}
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
            {paginatedPatients.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Aucun patient trouvé.
                </td>
              </tr>
            ) : (
              paginatedPatients.map((patient) => (
                <tr key={patient.id_patient} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {patient.prenom} {patient.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age || '—'} ans</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.telephone || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.lastAppointment || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                            handleVoirDossier(patient.id_patient);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                    >
                      Voir Dossier
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ⬅ Précédent
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Suivant ➡
          </button>
        </div>
      )}

      {/* Modal dossier patient */}
      {modalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative overflow-auto max-h-[90vh]">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedPatient.prenom} {selectedPatient.nom}</h2>
            <p><strong>Email:</strong> {selectedPatient.email}</p>
            <p><strong>Téléphone:</strong> {selectedPatient.telephone}</p>
            <p><strong>Adresse:</strong> {selectedPatient.adresse || '—'}</p>
            <p><strong>Sexe:</strong> {selectedPatient.sexe || '—'}</p>
            <p><strong>Date de naissance:</strong> {selectedPatient.date_naissance || '—'}</p>
            <p><strong>Allergies:</strong> {selectedPatient.allergies || '—'}</p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Métriques</h3>
            {selectedPatient.metriques && Object.keys(selectedPatient.metriques).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-auto">
                {Object.entries(selectedPatient.metriques).map(([type, entries]) => (
                  <div key={type} className="bg-gray-50 p-3 rounded shadow-sm">
                    <h4 className="font-semibold mb-2 capitalize">{type}</h4>
                    {entries.length === 0 ? (
                      <p className="text-gray-400 text-sm">Aucune donnée</p>
                    ) : (
                      <ul className="space-y-1 text-sm">
                        {entries
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((entry, idx) => (
                            <li key={idx} className="flex justify-between border-b border-gray-200 pb-1">
                              <span>{new Date(entry.date).toLocaleDateString()}</span>
                              <span className="font-medium">{entry.value}</span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Aucune métrique disponible</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
