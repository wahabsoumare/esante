import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserDoctor, faHouse, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";

// --- Sidebar du médecin ---
const Sidebar = ({ doctor }) => {
  const location = useLocation();

  const links = [
    { path: ".", label: "Tableau de bord" },
    { path: "appointments", label: "Mes rendez-vous" },
    { path: "patients", label: "Mes patients" },
    { path: "disponibilites", label: "Mes disponibilités" },
    { path: "profile", label: "Mon profil" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 shadow-lg">
      {/* Profil médecin */}
      <div className="flex flex-col items-center mb-10 mt-4">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-3">
          <FontAwesomeIcon icon={faUserDoctor} className="text-4xl" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          {doctor?.prenomu} {doctor?.nomu}
        </h2>
        <p className="text-sm text-green-600">
          {doctor?.medecin?.specialite || "Spécialité non définie"}
        </p>
      </div>

      {/* Liens de navigation */}
      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const isActive = location.pathname.endsWith(link.path) || location.pathname === `/doctor/${link.path}`;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`p-3 rounded-lg font-medium ${
                isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

// --- Header du médecin ---
const DoctorHeader = ({ onLogout }) => {
  const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-700 hover:text-green-600"
      >
        <FontAwesomeIcon icon={faHouse} />
        Accueil
      </button>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-red-600 hover:text-red-800"
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
        Déconnexion
      </button>
    </header>
  );
};

// --- Layout principal du médecin ---
const DoctorLayout = () => {
  const { getToken, logout } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error("Token manquant. Impossible de charger le profil médecin.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/api/utilisateurs/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDoctor(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil médecin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Chargement du profil...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar doctor={doctor} />
      <div className="flex-1 flex flex-col">
        <DoctorHeader onLogout={handleLogout} />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
