import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUser, FaUserMd, FaUserShield, FaUserInjured } from 'react-icons/fa';

export default function CreateUser() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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

        // Validation
        if (formData.password !== formData.confirmPassword) {
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
                password: formData.password,
                etat: formData.etat,
                ...(formData.typecompte === 'ROLE_MEDECIN' && {
                    specialite: formData.specialite
                })
            };

            const response = await fetch(`${API_URL}/api/utilisateurs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la création');
            }

            // Succès - redirection vers la liste
            alert('Utilisateur créé avec succès !');
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
                    <h1 className="text-xl font-bold">Créer un nouvel utilisateur</h1>
                    <p className="text-sm text-gray-600">Ajouter un nouvel utilisateur au système</p>
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

                {/* Mot de passe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mot de passe *
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmer le mot de passe *
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
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
                        {loading ? 'Création...' : 'Créer l\'utilisateur'}
                    </button>
                </div>
            </form>
        </div>
    );
}