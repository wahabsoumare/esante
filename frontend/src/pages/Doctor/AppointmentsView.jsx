import React, { useState, useEffect } from 'react';
import api from '../../config/axios';

// ✅ Style selon le statut
const getStatusClasses = (status) => {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    case 'CANCELLED':
      return 'bg-gray-200 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// ✅ Styles des boutons
const buttonStyles = {
  confirm: 'bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded transition',
  reject: 'bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded transition',
  cancel: 'bg-gray-400 hover:bg-gray-500 text-white font-semibold px-3 py-1 rounded transition',
  delete: 'bg-black hover:bg-gray-800 text-white font-semibold px-3 py-1 rounded transition',
};

export default function AppointmentsView() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDate, setFilterDate] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // 🔹 Charger les rendez-vous
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/api/rendezvous/medecin/me');
        setAppointments(res.data || []);
      } catch (err) {
        console.error('Erreur récupération RDV:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // 🔹 Filtrage
  const filteredAppointments = appointments.filter((appt) => {
    const matchStatus =
      filterStatus === 'ALL' ? true : appt.statut === filterStatus;
    const matchDate = filterDate
      ? appt.dateRdv.startsWith(filterDate)
      : true; // compare juste la date YYYY-MM-DD
    return matchStatus && matchDate;
  });

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginated = filteredAppointments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // 🔹 Mettre la page à 1 si filtres changent
  useEffect(() => {
    setPage(1);
  }, [filterStatus, filterDate]);

  // 🔹 Action sur un rendez-vous
  const handleAction = async (id, action) => {
    try {
      let url = '';
      let body = {};

      if (action === 'confirm') url = `/api/rendezvous/${id}/confirm`;
      else if (action === 'reject') {
        const reason = prompt('Motif du rejet :');
        if (!reason) return;
        url = `/api/rendezvous/${id}/reject`;
        body = { reason };
      } else if (action === 'cancel') url = `/api/rendezvous/${id}/cancel`;
      else if (action === 'delete') {
        if (!window.confirm('Supprimer ce rendez-vous ?')) return;
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        return;
      }

      const res = await api.patch(url, body);

      // 🔹 Mettre à jour le statut automatiquement dans l'état
      const updatedStatut = res.data?.rendezvous?.statut;
      if (updatedStatut) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, statut: updatedStatut } : a
          )
        );
      }

      alert(res.data.message || 'Action réussie ✅');
    } catch (err) {
      console.error('Erreur action:', err);
      alert(err.response?.data?.message || "Erreur lors de l'action ❌");
    }
  };

  if (loading) {
    return <h2 className="text-xl font-semibold">Chargement des rendez-vous...</h2>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📅 Mes Rendez-vous</h1>

      {/* 🔍 Filtres */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="CONFIRMED">Confirmé</option>
          <option value="REJECTED">Rejeté</option>
          <option value="CANCELLED">Annulé</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />

        <button
          onClick={() => {
            setFilterDate('');
            setFilterStatus('ALL');
          }}
          className="bg-gray-100 border px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          Réinitialiser
        </button>
      </div>

      {/* 📋 Tableau */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Heure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  Aucun rendez-vous trouvé.
                </td>
              </tr>
            ) : (
              paginated.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {appt.dateRdv} <br />
                    <span className="text-gray-500">
                      {appt.heureDebut} - {appt.heureFin}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {appt.patient
                      ? `${appt.patient.prenom} ${appt.patient.nom}`
                      : '—'}
                    <br />
                    <span className="text-gray-500 text-xs">
                      {appt.patient?.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                        appt.statut
                      )}`}
                    >
                      {appt.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                    {appt.statut === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleAction(appt.id, 'confirm')}
                          className={buttonStyles.confirm}
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => handleAction(appt.id, 'reject')}
                          className={buttonStyles.reject}
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                    {['CONFIRMED', 'REJECTED', 'CANCELLED'].includes(
                      appt.statut
                    ) && (
                      <button
                        onClick={() => handleAction(appt.id, 'cancel')}
                        className={buttonStyles.cancel}
                      >
                        Annuler
                      </button>
                    )}
                    <button
                      onClick={() => handleAction(appt.id, 'delete')}
                      className={buttonStyles.delete}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      {filteredAppointments.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-3">
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
    </div>
  );
}
