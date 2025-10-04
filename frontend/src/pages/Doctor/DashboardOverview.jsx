import React from 'react';

const DashboardOverview = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord médecin</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
          ✅ Disponible
        </button>
      </div>

      {/* Stats Cards */}
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

      {/* Rendez-vous récents */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Rendez-vous récents</h2>
        {/* ... (Contenu de la liste des RDV) ... */}
      </div>

      {/* Prochains rendez-vous (tableau) */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        {/* ... (Contenu du tableau des RDV) ... */}
      </div>

      {/* Infos médecin */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">À propos du médecin</h2>
        {/* ... (Contenu des infos médecin) ... */}
      </div>
    </>
  );
};

export default DashboardOverview;