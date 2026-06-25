import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { BrainCircuit, ClipboardList, ArrowRight, Loader2, LogOut, User } from 'lucide-react'

export default function Home() {
    const [surveys, setSurveys] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const res = await api.get('/surveys')
                setSurveys((res.data || []).filter((s) => s.isActive))
            } catch {
                toast.error('Failed to load surveys')
            } finally {
                setLoading(false)
            }
        }
        fetchSurveys()
    }, [])

    const handleLogout = () => {
        logout()
        toast.success('Logged out successfully')
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-[#f7f6f2]">
            {/* Header */}
            <header className="bg-[#0c4e54] text-white py-5 px-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                            <BrainCircuit size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">SmartSurvey</h1>
                            <p className="text-xs text-white/60">Share your feedback</p>
                        </div>
                    </div>

                    {/* User info + Logout */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                                <User size={14} className="text-white" />
                            </div>
                            <span className="text-sm text-white/90 hidden sm:block">{user?.email}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} className="text-white/80" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-10">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Hello, {user?.email?.split('@')[0]} 👋
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Pick a survey below and share your valuable feedback
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <Loader2 size={32} className="animate-spin text-[#01696f]" />
                    </div>
                ) : surveys.length === 0 ? (
                    <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                        <ClipboardList size={48} className="text-gray-200 mx-auto mb-4" />
                        <h3 className="text-gray-600 font-medium mb-1">No surveys available</h3>
                        <p className="text-gray-400 text-sm">Check back later for new surveys.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {surveys.map((s) => (
                            <div
                                key={s._id}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#01696f]/20 transition-all cursor-pointer group"
                                onClick={() => navigate(`/survey/${s._id}`)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                                            <span className="text-xs text-green-600 font-medium">Active</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#01696f] transition-colors">
                                            {s.title}
                                        </h3>
                                        {s.description && (
                                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{s.description}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-3">
                                            {s.questions?.length || 0} questions
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-[#e6f0f0] group-hover:bg-[#01696f] flex items-center justify-center transition-colors flex-shrink-0">
                                        <ArrowRight size={18} className="text-[#01696f] group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}