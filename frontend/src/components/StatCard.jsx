import { FaUsers , FaUserMd, FaVideo, FaMoneyBillWave } from 'react-icons/fa'


export default function StatCard ({icon , value , label , change , color}) {
    return (
        <div className="bg-white p-3 rounded-2xl flex flex-col gap-2 border border-gray-100 shadow-md">
            <div className={`text-3xl ${color}`}>{icon}</div>
            <h2 className=" font-bold">{label}</h2>
            <p className="text-gray-500 text-md">{value}</p>
            <p className='text-sm text-green-400 font-semibold'>{change}</p>
        </div>
    )
}