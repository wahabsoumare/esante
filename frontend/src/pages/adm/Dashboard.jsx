import { FaUsers, FaUserMd,FaVideo,FaMoneyBillWave } from "react-icons/fa";
import StatCard from "../../components/StatCard";

export default function Dashboard () {
    return (
        <div className=" h-auto w-full ">
            <div className="flex  px-5 py-10 h-20 items-center justify-between bg-white text-stone-600 border rounded-xl shadow-md">
               <div className="py-4">
                <h2 className="text-green-500 text-2xl font-bold">Tableau de bord  - Teleconsultation</h2>
                <p>Supervision du projet eSanté - Données en temps réel</p>
               </div>

               <div className="flex items-center gap-2">
                     <div className="rounded-full bg-blue-600 size-9 text-white font-bold flex items-center justify-center">AD</div>
                     <div>
                         <p className="text-lg">Admin</p>
                         
                     </div>
                
               </div>

            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <StatCard 
                   icon={<FaUsers />}
                   value="12567"
                   label="Patients inscrits"
                   color="text-blue-400"
                   change="+12 % de ce moi"
                   

                />

                <StatCard 
                   icon={<FaUserMd />}
                   value="916"
                   label="Medecins actifs"
                   color="text-blue-400"
                   change="+8 % de ce moi"

                />

                <StatCard 
                   icon={<FaVideo />}
                   value="3316"
                   label="Consultations/mois"
                   color="text-blue-300"
                   change="+15 % de ce moi"

                />

                <StatCard 
                   icon={<FaMoneyBillWave />}
                   value="399"
                   label="chiffres d'affaires"
                   color="text-blue-400"
                   change="+22 % de ce moi"

                />

                   
            </div>
        </div>
    )
}