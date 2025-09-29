import { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash, FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


export default function GestionUsers() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMenu, setActionMenu] = useState(null); // { userId, x, y }
    const navigate = useNavigate();

    // Récupérer les utilisateurs depuis l'API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");
            
            const API_URL ='http://localhost:3001';
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_URL}/api/utilisateurs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error('Session expirée');
                if (response.status === 403) throw new Error('Droits administrateur requis');
                throw new Error(`Erreur ${response.status}`);
            }

            const data = await response.json();
            setUsers(data);
            
        } catch (err) {
            setError(err.message);
            console.error('Erreur API:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Formater les données selon votre schéma de base de données
    const formatUserData = (apiUsers) => {
        return apiUsers.map(user => ({
            id: user.idu,
            name: `${user.prenomu} ${user.nomu}`,
            email: user.emailu,
            type: user.typecompte,
            typeLabel: getTypeLabel(user.typecompte),
            region: user.adresse || 'Non spécifié',
            date: new Date(user.dateajout).toLocaleDateString('fr-FR'),
            status: user.etat,
            telephone: user.telephoneu,
            sexe: user.sexe,
            fonction: user.fonction,
            specialty: user.medecin?.specialite || null,
            // Données brutes pour édition
            rawData: user
        }));
    };

    // Traduire les types de compte
    const getTypeLabel = (typecompte) => {
        const types = {
            'ROLE_ADMIN': 'Administrateur',
            'ROLE_MEDECIN': 'Médecin',
            'ROLE_SECRETAIRE': 'Secrétaire',
            'ROLE_PATIENT': 'Patient'
        };
        return types[typecompte] || typecompte;
    };

    const formattedUsers = formatUserData(users);

    const filteredUsers = formattedUsers.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.region.toLowerCase().includes(search.toLowerCase())
    );

    // Fonction pour déterminer la classe CSS selon le statut
    const getStatusClass = (status) => {
        if (status?.toLowerCase() === "actif") {
            return "bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs";
        } else {
            return "bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs";
        }
    };

    // Ouvrir le menu d'actions
    const handleActionClick = (userId, event) => {
        event.stopPropagation();
        setActionMenu({
            userId,
            x: event.clientX,
            y: event.clientY
        });
    };

    // Fermer le menu d'actions
    const closeActionMenu = () => {
        setActionMenu(null);
    };

    // Supprimer un utilisateur
    const handleDelete = async (userId) => {
        closeActionMenu();
        
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
            return;
        }

        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/api/utilisateurs/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression');
            }

            // Rafraîchir la liste
            fetchUsers();
            alert('Utilisateur supprimé avec succès !');
            
        } catch (err) {
            setError(err.message);
            alert('Erreur lors de la suppression: ' + err.message);
        }
    };

    // Modifier un utilisateur
    const handleEdit = (userId) => {
        closeActionMenu();
        navigate(`/admin/users/edit/${userId}`);
    };

    // Navigation vers la page de création
    const handleNewUser = () => {
        navigate('/admin/users/create');
    };

    // Fermer le menu si on clique ailleurs
    useEffect(() => {
        const handleClickOutside = () => {
            setActionMenu(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-center items-center h-32">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                        <div className="text-lg text-gray-600">Chargement des utilisateurs...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-center py-8">
                    <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
                    <button 
                        onClick={fetchUsers}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="rechercher"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-600 rounded-lg px-3 text-sm"
                    />
                    <button 
                        onClick={handleNewUser}
                        className="bg-blue-400 text-white px-3 py-2 rounded-xl text-sm hover:bg-blue-600 flex items-center gap-2"
                    >
                        <FaPlus />
                        Nouvel utilisateur
                    </button>
                </div>
            </div>

            <table className="w-full text-sm text-left">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3">Utilisateur</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Region</th>
                        <th className="p-3">Date d'inscription</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-t hover:bg-gray-50">
                            <td className="p-3">
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-gray-500 text-xs">{user.email}</p>
                                </div>
                            </td>
                            <td className="p-3">{user.typeLabel}</td>
                            <td className="p-3">{user.region}</td>
                            <td className="p-3">{user.date}</td>
                            <td className="p-3">
                                <span className={getStatusClass(user.status)}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="p-3 relative">
                                <button 
                                    onClick={(e) => handleActionClick(user.id, e)}
                                    className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                                >
                                    <FaEllipsisV />
                                </button>

                                {/* Menu d'actions */}
                                {actionMenu?.userId === user.id && (
                                    <div 
                                        className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                        style={{
                                            top: '100%',
                                            left: 'auto',
                                            right: '0'
                                        }}
                                    >
                                        <button
                                            onClick={() => handleEdit(user.id)}
                                            className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                                        >
                                            <FaEdit />
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <FaTrash />
                                            Supprimer
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {filteredUsers.length === 0 && users.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                    Aucun utilisateur trouvé avec ces critères de recherche
                </div>
            )}

            {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <div className="text-lg mb-2">Aucun utilisateur</div>
                    <button 
                        onClick={handleNewUser}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Créer le premier utilisateur
                    </button>
                </div>
            )}
        </div>
    );
}