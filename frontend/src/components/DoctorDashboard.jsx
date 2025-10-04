import React from "react";

const DoctorDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-green-800 text-white flex flex-col p-4">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://via.placeholder.com/80"
            alt="Doctor Avatar"
            className="w-20 h-20 rounded-full mb-3"
          />
          <h2 className="text-lg font-semibold">Dr. Latir Diouf</h2>
          <p className="text-sm text-gray-300">Cardiologue</p>
        </div>
        <nav className="flex flex-col gap-3">
          <a href="#" className="hover:bg-green-700 p-2 rounded">📊 Tableau de bord</a>
          <a href="#" className="hover:bg-green-700 p-2 rounded">📅 Mes rendez-vous</a>
          <a href="#" className="hover:bg-green-700 p-2 rounded">👥 Mes patients</a>
          <a href="#" className="hover:bg-green-700 p-2 rounded">🔔 Notifications</a>
          <a href="#" className="hover:bg-green-700 p-2 rounded">⚙ Paramètres</a>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
    
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tableau de bord médecin</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
            ✅ Disponible
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">Consultations aujourd’hui</p>
            <h2 className="text-3xl font-bold">12</h2>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">Patients suivis</p>
            <h2 className="text-3xl font-bold">48</h2>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">Note moyenne</p>
            <h2 className="text-3xl font-bold">4.8 ⭐</h2>
          </div>
        </div>

    
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Rendez-vous récents</h2>
          <ul className="divide-y">
            <li className="py-3 flex justify-between">
              <span>Moussa Diop — Diabétologie</span>
              <span className="text-gray-500">10:30</span>
            </li>
            <li className="py-3 flex justify-between">
              <span>Aïcha Ndiaye — Pédiatrie</span>
              <span className="text-gray-500">14:00</span>
            </li>
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Prochains rendez-vous</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Patient</th>
                <th className="p-3">Date</th>
                <th className="p-3">Motif</th>
                <th className="p-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">Fatou Sarr</td>
                <td className="p-3">29/09/2025 - 09:00</td>
                <td className="p-3">Dermatologie</td>
                <td className="p-3">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    En attente
                  </span>
                </td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Ibrahima Fall</td>
                <td className="p-3">29/09/2025 - 11:00</td>
                <td className="p-3">Cardiologie</td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    Confirmé
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">À propos du médecin</h2>
          <p>
            <strong>Nom :</strong> Dr. Latir Diouf <br />
            <strong>Spécialité :</strong> Cardiologue <br />
            <strong>Email :</strong> dr.latir@cliniqueconnect.com
          </p>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
