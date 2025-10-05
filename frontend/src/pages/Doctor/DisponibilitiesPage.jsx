import React, { useEffect, useState } from 'react';
import api from '../../config/axios';

export default function DisponibilitiesPage() {
  const [dispos, setDispos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null); // 👈 ID de la disponibilité en édition
  const [form, setForm] = useState({ jour: '', heureDebut: '', heureFin: '' });
  const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  useEffect(() => {
    const fetchDispos = async () => {
      try {
        let medecinId = null;
        try {
          const profile = await api.get('/api/utilisateurs/profile');
          medecinId =
            profile.data?.medecin?.idm ||
            profile.data?.medecin?.id;
        } catch (e) {}
        let res;
        if (medecinId) {
          res = await api.get(`/api/disponibilites/medecin/${medecinId}`);
          const payload = res.data;
          setDispos(payload.disponibilites || payload || []);
        } else {
          res = await api.get('/api/disponibilites');
          setDispos(res.data || []);
        }
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

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const normalizeTime = (t) => {
    if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
    if (/^\d{1,2}:\d{2}$/.test(t)) return t.padStart(5, '0') + ':00';
    const m = t.match(/(\d{1,2}):(\d{2})/);
    if (m) return m[1].padStart(2,'0') + ':' + m[2] + ':00';
    throw new Error('Format heure invalide (ex: 09:00)');
  };

  const createDisponibilite = async () => {
    setCreating(true);
    try {
      if (!form.jour) throw new Error('Choisir un jour');
      if (!form.heureDebut || !form.heureFin) throw new Error('Heure début et fin requises');

      const payload = {
        jour: String(form.jour).toLowerCase(),
        heureDebut: normalizeTime(form.heureDebut),
        heureFin: normalizeTime(form.heureFin),
      };

      const res = await api.post(`/api/disponibilites`, payload);
      setDispos(d => [res.data, ...d]);
      setForm({ jour: '', heureDebut: '', heureFin: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur création');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (d) => {
    setEditingId(d.id);
    setForm({
      jour: d.jour,
      heureDebut: d.heureDebut.slice(0,5),
      heureFin: d.heureFin.slice(0,5)
    });
  };

  const saveEdit = async (id) => {
    try {
      const payload = {
        jour: form.jour,
        heureDebut: normalizeTime(form.heureDebut),
        heureFin: normalizeTime(form.heureFin),
      };
      const res = await api.put(`/api/disponibilites/${id}`, payload);
      setDispos(d => d.map(x => x.id === id ? res.data : x));
      setEditingId(null);
      setForm({ jour: '', heureDebut: '', heureFin: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur mise à jour');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mes disponibilités</h1>

      {/* Formulaire création */}
      {!editingId && (
        <div className="card mb-4 p-4">
          <div className="grid grid-cols-3 gap-2">
            <select name="jour" value={form.jour} onChange={onChange} className="input">
              <option value="">-- Choisir jour --</option>
              {DAYS.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
            </select>
            <input name="heureDebut" value={form.heureDebut} onChange={onChange} placeholder="09:00" className="input" />
            <input name="heureFin" value={form.heureFin} onChange={onChange} placeholder="12:00" className="input" />
          </div>
          <div className="mt-3">
            <button onClick={createDisponibilite} disabled={creating} className="btn bg-brand-600 text-white">
              {creating ? 'Création...' : 'Créer disponibilité'}
            </button>
          </div>
        </div>
      )}

      {/* Liste des disponibilités */}
      {dispos.length === 0 ? (
        <div>Aucune disponibilité trouvée.</div>
      ) : (
        <ul className="space-y-3">
          {dispos.map(d => (
            <li key={d.id} className="card flex justify-between items-center p-3">
              {editingId === d.id ? (
                // === MODE ÉDITION ===
                <div className="flex flex-col w-full gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    <select name="jour" value={form.jour} onChange={onChange} className="input">
                      {DAYS.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                    <input name="heureDebut" value={form.heureDebut} onChange={onChange} className="input" />
                    <input name="heureFin" value={form.heureFin} onChange={onChange} className="input" />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => saveEdit(d.id)} className="px-3 py-1 bg-green-500 text-white rounded">Sauvegarder</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-300 rounded">Annuler</button>
                  </div>
                </div>
              ) : (
                // === MODE AFFICHAGE ===
                <>
                  <div>
                    <div className="font-medium">{d.jour} — {d.heureDebut} à {d.heureFin}</div>
                    <div className="text-sm text-zinc-600">Template: {d.template || '—'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggle(d.id)} className={`px-3 py-1 rounded ${d.actif ? 'bg-red-200' : 'bg-green-200'}`}>
                      {d.actif ? 'Désactiver' : 'Activer'}
                    </button>
                    <button onClick={() => startEdit(d)} className="px-3 py-1 rounded bg-blue-200">Modifier</button>
                    <button onClick={() => remove(d.id)} className="px-3 py-1 rounded bg-gray-200">Supprimer</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
