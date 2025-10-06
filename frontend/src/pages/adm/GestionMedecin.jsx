import { useEffect, useState, useMemo } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import api from "../../config/axios";

export default function AdminMedecins() {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [form, setForm] = useState({
    prenomu: "",
    nomu: "",
    telephoneu: "",
    emailu: "",
    fonction: "",
    password: "",
    etat: "actif",
    specialite: "",
    sexe: "",
    adresse: "",
  });

  // Fetch médecins
  const fetchMedecins = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/utilisateurs/medecins");
      setMedecins(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedecins();
  }, []);

  // Filtrage et pagination
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return medecins;
    return medecins.filter((m) => {
      const name = `${m.prenomu || ""} ${m.nomu || ""}`.toLowerCase();
      return (
        name.includes(q) ||
        (m.emailu || "").toLowerCase().includes(q) ||
        (m.telephoneu || "").toLowerCase().includes(q) ||
        (m.specialite || "").toLowerCase().includes(q)
      );
    });
  }, [medecins, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Ouvrir modals
  const openCreate = () => {
    setEditing(null);
    setForm({
      prenomu: "",
      nomu: "",
      telephoneu: "",
      emailu: "",
      fonction: "",
      password: "",
      etat: "actif",
      specialite: "",
      sexe: "",
      adresse: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({
      prenomu: m.prenomu || "",
      nomu: m.nomu || "",
      telephoneu: m.telephoneu || "",
      emailu: m.emailu || "",
      fonction: m.fonction || "",
      password: "",
      etat: m.etat || "actif",
      specialite: m.specialite || "",
      sexe: m.sexe || "",
      adresse: m.adresse || "",
    });
    setIsModalOpen(true);
  };

  // Submit formulaire
  const submitForm = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError("");

    try {
      const payload = { ...form, typecompte: "ROLE_MEDECIN" };

      if (editing) {
        if (!payload.password) delete payload.password;
        await api.put(`/api/utilisateurs/${editing.idu}`, payload);
      } else {
        await api.post("/api/utilisateurs", payload);
      }

      await fetchMedecins();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Supprimer médecin
  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression : action irréversible.")) return;
    try {
      setActionLoading(true);
      await api.delete(`/api/utilisateurs/${id}`);
      await fetchMedecins();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">Gestion des médecins</h2>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher (nom, email, téléphone, spécialité)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10"
            />
            <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
          </div>
          <button
            onClick={openCreate}
            className="bg-blue-500 text-white px-3 py-2 rounded-xl hover:bg-blue-600 flex items-center gap-2"
          >
            <FaPlus />
            Nouveau médecin
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="text-red-600 mb-4">{error}</div>
      ) : medecins.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">Aucun médecin</div>
          <button onClick={openCreate} className="bg-blue-500 text-white px-4 py-2 rounded">
            Créer un médecin
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Médecin</th>
                  <th className="p-3">Téléphone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Spécialité</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((m) => (
                  <tr key={m.idu} className="border-t hover:bg-gray-50">
                    <td className="p-3">{`${m.prenomu} ${m.nomu}`}</td>
                    <td className="p-3">{m.telephoneu}</td>
                    <td className="p-3">{m.emailu}</td>
                    <td className="p-3">{m.specialite}</td>
                    <td className="p-3">{m.etat}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => openEdit(m)} className="text-blue-600 px-2 py-1 rounded hover:bg-blue-50 flex items-center gap-1">
                        <FaEdit /> Modifier
                      </button>
                      <button onClick={() => handleDelete(m.idu)} className="text-red-600 px-2 py-1 rounded hover:bg-red-50 flex items-center gap-1">
                        <FaTrash /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""} — page {page}/{totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Préc
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Suiv
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => !actionLoading && setIsModalOpen(false)} />
          <form onSubmit={submitForm} className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editing ? "Modifier médecin" : "Nouveau médecin"}</h3>
              <button type="button" onClick={() => !actionLoading && setIsModalOpen(false)} className="text-gray-500">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={form.prenomu} onChange={(e) => setForm({ ...form, prenomu: e.target.value })} placeholder="Prénom" className="px-3 py-2 rounded border" />
              <input value={form.nomu} onChange={(e) => setForm({ ...form, nomu: e.target.value })} placeholder="Nom" className="px-3 py-2 rounded border" />
              <input value={form.telephoneu} onChange={(e) => setForm({ ...form, telephoneu: e.target.value })} placeholder="Téléphone" className="px-3 py-2 rounded border" />
              <input value={form.emailu} onChange={(e) => setForm({ ...form, emailu: e.target.value })} placeholder="Email" className="px-3 py-2 rounded border" />
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editing ? "Laisser vide pour garder le mot de passe" : "Mot de passe"} type="password" className="px-3 py-2 rounded border" />
              <input value={form.fonction} onChange={(e) => setForm({ ...form, fonction: e.target.value })} placeholder="Fonction" className="px-3 py-2 rounded border" />
              <select value={form.etat} onChange={(e) => setForm({ ...form, etat: e.target.value })} className="px-3 py-2 rounded border">
                <option value="actif">ACTIF</option>
                <option value="inactif">INACTIF</option>
              </select>
              <input value={form.specialite} onChange={(e) => setForm({ ...form, specialite: e.target.value })} placeholder="Spécialité" className="px-3 py-2 rounded border" />
              <select value={form.sexe} onChange={(e) => setForm({ ...form, sexe: e.target.value })} className="px-3 py-2 rounded border">
                <option value="">Sexe</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
              <input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} placeholder="Adresse" className="px-3 py-2 rounded border" />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => !actionLoading && setIsModalOpen(false)} className="px-4 py-2 rounded border">Annuler</button>
              <button type="submit" disabled={actionLoading} className="px-4 py-2 rounded bg-blue-600 text-white">{actionLoading ? "En cours..." : editing ? "Enregistrer" : "Créer"}</button>
            </div>

            {error && <div className="text-red-600 mt-3">{error}</div>}
          </form>
        </div>
      )}
    </div>
  );
}
