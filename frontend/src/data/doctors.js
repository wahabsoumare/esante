import axios from 'axios'

export const SPECIALTIES = [
  'Médecine générale','Pédiatrie','Gynécologie','Dermatologie','Cardiologie','Psychologie','ORL','Ophtalmologie','Dentisterie','Diabétologie'
]
export const REGIONS = ['Dakar','Abidjan','Bamako','Cotonou','Lomé','Libreville','Brazzaville','Douala']

export const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Mariam Diop',
    specialty: 'Dermatologie',
    region: 'Dakar',
    experience: 10,
    gender: 'F',
    languages: ['fr', 'wolof'],
    fee: '15 000 FCFA',
    availability: 'Lun-Ven 09:00–17:00',
    bio: 'Dermatologue spécialisée en dermatoses inflammatoires et dépistage des lésions cutanées.',
    photo: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Dr. Oumar Traoré',
    specialty: 'Cardiologie',
    region: 'Abidjan',
    experience: 12,
    gender: 'M',
    languages: ['fr'],
    fee: '20 000 FCFA',
    availability: 'Mar-Sam 10:00–18:00',
    bio: 'Cardiologue orienté prévention, suivi de l’hypertension et réadaptation.',
    photo: 'https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Dr. Aïcha Njoya',
    specialty: 'Pédiatrie',
    region: 'Douala',
    experience: 8,
    gender: 'F',
    languages: ['fr', 'en'],
    fee: '12 000 FCFA',
    availability: 'Lun-Ven 08:30–16:30',
    bio: 'Pédiatre, suivi nourrisson-ado, vaccination et éducation parentale.',
    photo: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Dr. Hamza El Idrissi',
    specialty: 'Médecine générale',
    region: 'Lomé',
    experience: 7,
    gender: 'M',
    languages: ['fr', 'ar'],
    fee: '10 000 FCFA',
    availability: 'Lun-Ven 09:00–17:00',
    bio: 'Prise en charge globale, prévention et orientation spécialisée.',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 5,
    name: 'Dr. Sara Bamba',
    specialty: 'Psychologie',
    region: 'Bamako',
    experience: 9,
    gender: 'F',
    languages: ['fr'],
    fee: '18 000 FCFA',
    availability: 'Lun-Jeu 10:00–18:00',
    bio: 'Psychologue clinicienne, gestion du stress et TCC.',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=600&auto=format&fit=crop'
  },
]
