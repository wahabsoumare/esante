import React, { useEffect, useState } from 'react';
import api from '../../config/axios';

export default function DisponibilitiesPage() {
  const [dispos, setDispos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDispos = async () => {
      try {
        // This endpoint returns the doctor's own disponibilites (based on token)
        const res = await api.get('/api/disponibilites/medecin');
        setDispos(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Erreur récupération disponibilités');
      } finally {
        setLoading(false);
      }
    };

    fetchDispos();
  }, []);

  const toggle = async (id) => {
    try {
      await api.patch(`/api/disponibilites/${id}/toggle`);
      setDispos((d) => d.map(x => x.id === id ? { ...x, actif: !x.actif } : x));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur lors du changement');
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/api/disponibilites/${id}`);
      setDispos((d) => d.filter(x => x.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur lors de la suppression');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mes disponibilités (Dashboard)</h1>

      {dispos.length === 0 ? (
        <div>Aucune disponibilité trouvée.</div>
      ) : (
        <ul className="space-y-3">
          {dispos.map(d => (
            <li key={d.id} className="card flex justify-between items-center p-3">
              <div>
                <div className="font-medium">{d.jour} — {d.heureDebut} à {d.heureFin}</div>
                <div className="text-sm text-zinc-600">Template: {d.template || '—'}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggle(d.id)} className={`px-3 py-1 rounded ${d.actif ? 'bg-red-200' : 'bg-green-200'}`}>
                  {d.actif ? 'Désactiver' : 'Activer'}
                </button>
                <button onClick={() => remove(d.id)} className="px-3 py-1 rounded bg-gray-200">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
