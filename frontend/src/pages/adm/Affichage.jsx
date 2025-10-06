import React, { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import api from "../../config/axios"; // adapte le chemin si besoin
import { FaUserInjured, FaStethoscope, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";

/**
 * Dashboard - Affichage des statistiques et activité
 * - récupère /api/patients, /api/medecins, /api/rendezvous
 * - calcule totaux, activité récente (5 derniers RDV) et alertes simples
 * - pas d'auth requis (tu as dit non)
 */

export default function Affichage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [rendezvous, setRendezvous] = useState([]);

  // Récupère les ressources en parallèle
  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [pRes, mRes, rRes] = await Promise.all([
          api.get("/api/patients"),
          api.get("/api/utilisateurs/public/medecins"),
          api.get("/api/rendezvous"),
        ]);
        if (!mounted) return;
        setPatients(Array.isArray(pRes.data) ? pRes.data : []);
        setMedecins(Array.isArray(mRes.data) ? mRes.data : []);
        setRendezvous(Array.isArray(rRes.data) ? rRes.data : []);
      } catch (err) {
        console.error("Erreur récupération dashboard:", err);
        setError(err.response?.data?.message || err.response?.data?.error || err.message || "Erreur serveur");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  // Totaux simples
  const totals = useMemo(() => {
    return {
      patients: patients.length,
      medecins: medecins.length,
      rendezvous: rendezvous.length,
    };
  }, [patients, medecins, rendezvous]);

  // Statut counts (PENDING, CONFIRMED, CANCELLED, REJECTED, ...)
  const statutCounts = useMemo(() => {
    const map = {};
    for (const r of rendezvous) {
      const s = (r.statut || "UNKNOWN").toUpperCase();
      map[s] = (map[s] || 0) + 1;
    }
    return map;
  }, [rendezvous]);

  // 5 derniers rendez-vous (triés par dateRdv + heureDebut, descendant)
  const recentRdv = useMemo(() => {
    const copy = [...rendezvous];
    copy.sort((a, b) => {
      const da = a.dateRdv ? `${a.dateRdv} ${a.heureDebut || ""}` : "";
      const db = b.dateRdv ? `${b.dateRdv} ${b.heureDebut || ""}` : "";
      return db.localeCompare(da);
    });
    return copy.slice(0, 5);
  }, [rendezvous]);

  // Alerte simple : taux d'annulation élevé, beaucoup de PENDING, ou RDV aujourd'hui > seuil
  const alerts = useMemo(() => {
    const total = rendezvous.length || 1;
    const cancelled = statutCounts["CANCELLED"] || statutCounts["ANNULLED"] || statutCounts["REJECTED"] || 0;
    const pending = statutCounts["PENDING"] || 0;
    const confirmed = statutCounts["CONFIRMED"] || 0;

    const cancelRate = Math.round((cancelled / total) * 100);
    const pendingRate = Math.round((pending / total) * 100);

    // RDV prévus aujourd'hui
    const todayISO = dayjs().format("YYYY-MM-DD");
    const todayCount = rendezvous.filter(r => r.dateRdv === todayISO).length;

    const out = [];

    if (cancelRate >= 10) {
      out.push({
        level: "urgent",
        title: `${cancelRate}% de rendez-vous annulés`,
        detail: `Taux d'annulation élevé (${cancelRate}%) — ${cancelled}/${total} RDV annulés.`,
      });
    }

    if (pendingRate >= 25) {
      out.push({
        level: "warning",
        title: `${pendingRate}% de RDV en attente`,
        detail: `${pending} RDV en statut PENDING — vérifie confirmations.`,
      });
    }

    if (todayCount >= 20) {
      out.push({
        level: "info",
        title: `${todayCount} RDV prévus aujourd'hui`,
        detail: `Charge importante aujourd'hui — ${todayCount} rendez-vous planifiés.`,
      });
    }

    // Alerte par défaut si aucune alerte calculée
    if (out.length === 0) {
      out.push({
        level: "ok",
        title: `Système stable`,
        detail: `Pas d'alerte critique détectée (${confirmed} confirmés).`,
      });
    }

    return out;
  }, [rendezvous, statutCounts]);

  // Helpers d'affichage
  const formatDateTime = (r) => {
    if (!r) return "—";
    const date = r.dateRdv ? dayjs(r.dateRdv).format("DD/MM/YYYY") : "—";
    const time = r.heureDebut ? `${r.heureDebut}${r.heureFin ? ` - ${r.heureFin}` : ""}` : "";
    return `${date} ${time}`.trim();
  };

  if (loading) {
    return (
      <div className="bg-gray-100 h-auto py-9 w-full">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3" />
          <div>Chargement des statistiques...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 h-auto py-9 w-full">
        <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">
          <div className="text-red-600 font-semibold mb-2">Erreur</div>
          <div className="text-sm text-gray-700 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-auto py-9 w-full">
      <div className="max-w-6xl mx-auto px-4">
        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-full">
              <FaUserInjured className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Patients</div>
              <div className="text-2xl font-bold">{totals.patients}</div>
              <div className="text-xs text-gray-400 mt-1">Total comptes patients</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-full">
              <FaStethoscope className="text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Médecins</div>
              <div className="text-2xl font-bold">{totals.medecins}</div>
              <div className="text-xs text-gray-400 mt-1">Total fiches médecins</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-full">
              <FaCalendarAlt className="text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Rendez-vous</div>
              <div className="text-2xl font-bold">{totals.rendezvous}</div>
              <div className="text-xs text-gray-400 mt-1">Total rendez-vous enregistrés</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          {/* Alertes */}
          <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[350px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Alertes système</h2>
              <span className="bg-blue-300 text-white px-3 py-1 rounded-full text-sm font-medium">
                {alerts.length} détectée{alerts.length > 1 ? "s" : ""}
              </span>
            </div>

            {alerts.map((a, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      a.level === "urgent" ? "bg-red-100 text-red-700" :
                      a.level === "warning" ? "bg-yellow-100 text-yellow-700" :
                      a.level === "info" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    }`}
                  >
                    {a.level === "urgent" ? "Urgent" : a.level === "warning" ? "A vérifier" : a.level === "info" ? "Info" : "OK"}
                  </span>
                  <span className="text-gray-400 text-xs">{/* placeholder time if needed */}</span>
                </div>
                <div className="text-gray-700 mt-1 font-medium">{a.title}</div>
                <div className="text-gray-500 text-sm mt-1">{a.detail}</div>
                {idx < alerts.length - 1 && <hr className="my-3" />}
              </div>
            ))}
          </div>

          {/* Activité récente */}
          <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Activité récente</h2>
              <span className="text-xs text-gray-400">5 derniers rendez-vous</span>
            </div>

            {recentRdv.length === 0 ? (
              <div className="text-gray-500">Aucun rendez-vous récent</div>
            ) : (
              recentRdv.map((r) => (
                <div key={r.id} className="mb-3">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="font-semibold text-sm">
                        {r.statut ? r.statut : "—"} • {formatDateTime(r)}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        { /* affichage des noms si présents via include */ }
                        {r.medecin?.utilisateur ? (
                          <span>Dr {r.medecin.utilisateur.prenomu} {r.medecin.utilisateur.nomu}</span>
                        ) : r.medecin?.specialite ? (
                          <span>Médecin ID: {r.medecinId}</span>
                        ) : (
                          <span>Médecin: {r.medecinId || "—"}</span>
                        )}
                        {" — "}
                        {r.patient ? (
                          <span>{r.patient.prenom} {r.patient.nom}</span>
                        ) : (
                          <span>Patient ID: {r.patientId || "—"}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{dayjs(r.createdAt || r.updatedAt || r.dateRdv).fromNow ? dayjs(r.dateRdv).fromNow() : ""}</div>
                  </div>
                  <div className="text-gray-500 text-sm mt-1">{r.notes || ""}</div>
                  <hr className="my-3" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* breakdown rapide des statuts */}
        <div className="bg-white rounded-xl shadow p-6 mt-6">
          <h3 className="font-semibold mb-3">Répartition par statut (RDV)</h3>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(statutCounts).length === 0 ? (
              <div className="text-gray-500">Aucune donnée</div>
            ) : (
              Object.entries(statutCounts).map(([k, v]) => (
                <div key={k} className="px-4 py-3 rounded-lg border bg-gray-50">
                  <div className="text-xs text-gray-500">{k}</div>
                  <div className="text-lg font-bold">{v}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
