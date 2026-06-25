import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, BrainCircuit, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/surveys', label: 'Surveys', icon: ClipboardList },
]

export default function Sidebar() {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        toast.success('Logged out')
        navigate('/login')
    }

    return (
        <aside className="w-64 bg-[#0c4e54] text-white flex flex-col h-full">
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <BrainCircuit size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">SmartSurvey</h1>
                        <p className="text-xs text-white/50">Admin Panel</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                ? 'bg-white/20 text-white'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    )
}