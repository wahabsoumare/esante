import { NavLink, Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const linkCls = ({ isActive }) =>
  'px-3 py-2 rounded-lg ' +
  (isActive ? 'bg-brand-600 text-white' : 'hover:bg-brand-50 text-brand-900');

export default function PatientLayout() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:3000/api/patients/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatient(data);
      } catch (error) {
        console.error('Erreur lors du chargement du patient connecté :', error);
      }
    };

    fetchPatient();
  }, []);

  return (
    <div className="min-h-screen bg-brand-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold text-brand-900 text-xl">
            Clinique<span className="text-brand-600">Connect</span>
          </Link>

          {/* ✅ Remplacement dynamique ici */}
          <div className="text-sm text-zinc-600">
            {patient ? `Espace de ${patient.prenom} ${patient.nom}` : 'Espace patient'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-5 gap-6">
        <aside className="card h-fit md:sticky md:top-6">
          <nav className="grid gap-2">
            <NavLink to="/patient" end className={linkCls}>
              Tableau de bord
            </NavLink>
            <NavLink to="/patient/rendez-vous" className={linkCls}>
              Rendez-vous
            </NavLink>
            <NavLink to="/patient/teleconsultations" className={linkCls}>
              Téléconsultations
            </NavLink>
            <NavLink to="/patient/indicateurs" className={linkCls}>
              Indicateurs de santé
            </NavLink>
            <NavLink to="/patient/preinscriptions" className={linkCls}>
              Préinscriptions
            </NavLink>
            <NavLink to="/patient/rappels" className={linkCls}>
              Rappels
            </NavLink>
          </nav>
        </aside>

        <main className="md:col-span-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
