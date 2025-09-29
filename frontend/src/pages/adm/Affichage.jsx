import React from "react";

export default function Affichage() {
  return (
    <div className="bg-gray-100 h-auto py-9 w-full">
      <div className="flex flex-wrap gap-6">
        {/* Alertes système */}
        <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[350px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Alertes système</h2>
                <span className="bg-blue-300 text-white px-3 py-1 rounded-full text-sm font-medium">
                    3 nouvelles
                </span>
            </div>
            {/* Alerte Urgent */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-blue-300 text-white px-2 py-1 rounded font-semibold text-xs">
                Urgent
              </span>
              <span className="text-gray-400 text-xs">Il y a 5 min</span>
            </div>
            <div className="text-gray-700 mt-1">
              Serveur de vidéo congestionné - Région Abidjan
            </div>
          </div>
          <hr className="my-2" />
          {/* Alerte Normal */}
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded font-semibold text-xs">
                Normal
              </span>
              <span className="text-gray-400 text-xs">Il y a 1h</span>
            </div>
            <div className="text-gray-700 mt-1">
              Pic de connexions - 15h00-17h00
            </div>
          </div>
        </div>
        {/* Activité récente */}
        <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[300px]">
          <h2 className="font-semibold text-lg mb-4">Activité récente</h2>
          <div className="mb-4">
            <div className="font-semibold">Nouvelle inscription</div>
            <div className="text-gray-700 text-sm">
              Dr. Kouamé - Cardiologue · Abidjan
            </div>
            <div className="text-gray-400 text-xs">Il y a 10 min</div>
          </div>
          <hr className="my-2" />
          <div>
            <div className="font-semibold">Consultation terminée</div>
            <div className="text-gray-700 text-sm">
              Patient N°45872 – Dr. Diallo
            </div>
            <div className="text-gray-400 text-xs">Il y a 15 min</div>
          </div>
        </div>
      </div>
    </div>
  );
}