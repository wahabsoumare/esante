import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUser, FaUserMd, FaUserShield, FaUserInjured } from 'react-icons/fa';

export default function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState("");
    
    const [formData, setFormData] = useState({
        // Champs de base
        prenomu: '',
        nomu: '',
        emailu: '',
        telephoneu: '',
        sexe: '',
        adresse: '',
        fonction: '',
        typecompte: 'ROLE_PATIENT',
        password: '',
        confirmPassword: '',
        etat: 'actif',
        
        // Champs spécifiques médecin
        specialite: ''
    });

    // Récupérer les données de l'utilisateur
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setFetchLoading(true);
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                const token = localStorage.getItem('token');

                const response = await fetch(`${API_URL}/api/utilisateurs/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Utilisateur non trouvé');
                }

                const userData = await response.json();
                
                // Pré-remplir le formulaire
                setFormData({
                    prenomu: userData.prenomu || '',
                    nomu: userData.nomu || '',
                    emailu: userData.emailu || '',
                    telephoneu: userData.telephoneu || '',
                    sexe: userData.sexe || '',
                    adresse: userData.adresse || '',
                    fonction: userData.fonction || '',
                    typecompte: userData.typecompte || 'ROLE_PATIENT',
                    password: '', // Ne pas pré-remplir le mot de passe
                    confirmPassword: '',
                    etat: userData.etat || 'actif',
                    specialite: userData.medecin?.specialite || ''
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setFetchLoading(false);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation des mots de passe si remplis
        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        if (formData.typecompte === 'ROLE_MEDECIN' && !formData.specialite) {
            setError("La spécialité est obligatoire pour un médecin");
            return;
        }

        setLoading(true);

        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const token = localStorage.getItem('token');

            // Préparer les données pour l'API
            const userData = {
                prenomu: formData.prenomu,
                nomu: formData.nomu,
                emailu: formData.emailu,
                telephoneu: formData.telephoneu,
                sexe: formData.sexe,
                adresse: formData.adresse,
                fonction: formData.fonction,
                typecompte: formData.typecompte,
                etat: formData.etat,
                ...(formData.password && { password: formData.password }),
                ...(formData.typecompte === 'ROLE_MEDECIN' && {
                    specialite: formData.specialite
                })
            };

            const response = await fetch(`${API_URL}/api/utilisateurs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la modification');
            }

            // Succès - redirection vers la liste
            alert('Utilisateur modifié avec succès !');
            navigate('/admin/users');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'ROLE_ADMIN': return <FaUserShield className="text-red-500" />;
            case 'ROLE_MEDECIN': return <FaUserMd className="text-blue-500" />;
            case 'ROLE_SECRETAIRE': return <FaUser className="text-purple-500" />;
            case 'ROLE_PATIENT': return <FaUserInjured className="text-green-500" />;
            default: return <FaUser />;
        }
    };

    const getTypeLabel = (type) => {
        const types = {
            'ROLE_ADMIN': 'Administrateur',
            'ROLE_MEDECIN': 'Médecin',
            'ROLE_SECRETAIRE': 'Secrétaire',
            'ROLE_PATIENT': 'Patient'
        };
        return types[type] || type;
    };

    if (fetchLoading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-center items-center h-32">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                        <div className="text-lg text-gray-600">Chargement des données...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-md">
            {/* En-tête */}
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                    <FaArrowLeft />
                    Retour
                </button>
                <div>
                    <h1 className="text-xl font-bold">Modifier l'utilisateur</h1>
                    <p className="text-sm text-gray-600">Modifier les informations de {formData.prenomu} {formData.nomu}</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Prénom */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom *
                        </label>
                        <input
                            type="text"
                            name="prenomu"
                            value={formData.prenomu}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom *
                        </label>
                        <input
                            type="text"
                            name="nomu"
                            value={formData.nomu}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="emailu"
                            value={formData.emailu}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Téléphone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Téléphone *
                        </label>
                        <input
                            type="tel"
                            name="telephoneu"
                            value={formData.telephoneu}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Sexe */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sexe *
                        </label>
                        <select
                            name="sexe"
                            value={formData.sexe}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Sélectionner</option>
                            <option value="M">Masculin</option>
                            <option value="F">Féminin</option>
                        </select>
                    </div>

                    {/* Type de compte */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type de compte *
                        </label>
                        <select
                            name="typecompte"
                            value={formData.typecompte}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="ROLE_PATIENT">Patient</option>
                            <option value="ROLE_MEDECIN">Médecin</option>
                            <option value="ROLE_SECRETAIRE">Secrétaire</option>
                            <option value="ROLE_ADMIN">Administrateur</option>
                        </select>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            {getTypeIcon(formData.typecompte)}
                            {getTypeLabel(formData.typecompte)}
                        </div>
                    </div>
                </div>

                {/* Adresse */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse *
                    </label>
                    <textarea
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Fonction */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fonction *
                    </label>
                    <input
                        type="text"
                        name="fonction"
                        value={formData.fonction}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Spécialité (conditionnel pour médecin) */}
                {formData.typecompte === 'ROLE_MEDECIN' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Spécialité *
                        </label>
                        <input
                            type="text"
                            name="specialite"
                            value={formData.specialite}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="Ex: Cardiologie, Pédiatrie, Généraliste..."
                        />
                    </div>
                )}

                {/* Mot de passe (optionnel) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nouveau mot de passe (laisser vide pour ne pas changer)
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nouveau mot de passe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmer le nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirmer le mot de passe"
                        />
                    </div>
                </div>

                {/* Statut */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut *
                    </label>
                    <select
                        name="etat"
                        value={formData.etat}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="actif">Actif</option>
                        <option value="inactif">Inactif</option>
                    </select>
                </div>

                {/* Boutons */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/users')}
                        className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                    >
                        <FaSave />
                        {loading ? 'Modification...' : 'Modifier l\'utilisateur'}
                    </button>
                </div>
            </form>
        </div>
    );
}