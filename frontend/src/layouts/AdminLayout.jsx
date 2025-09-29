import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom';
import Dashboard from '../pages/adm/Dashboard';
import Affichage from '../pages/adm/Affichage';
import GestionUsers from '../pages/adm/GestionUsers';



export default function AdminLayout ()  {
    return (
        <div className="flex gap-10 h-screen">
            {/* sidebar fixé à gauche*/}
            <Sidebar />
            {/* Zone principal*/}
            <main className="flex-1 ml-[260px] overflow-y-auto p-6">
                {/* ici s'affichent les pages enfants*/}
             
                <Outlet />
            </main>
        </div>
    )
}