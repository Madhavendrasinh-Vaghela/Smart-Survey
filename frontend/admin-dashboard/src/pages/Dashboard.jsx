import { useEffect, useState } from 'react'
import { ClipboardList, MessageSquare, BrainCircuit, TrendingUp } from 'lucide-react'
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import StatCard from '../components/StatCard'
import api from '../api/axios'

const COLORS = ['#01696f', '#f59e0b', '#ef4444']

export default function Dashboard() {
    const [surveys, setSurveys] = useState([])
    const [loading, setLoading] = useState(true)
    const [analysisData, setAnalysisData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const surveysRes = await api.get('/surveys')
                setSurveys(surveysRes.data || [])

                const analyses = []
                for (const s of (surveysRes.data || []).slice(0, 5)) {
                    try {
                        const aRes = await api.get(`/analysis?surveyId=${s._id}`)
                        if (aRes.data?.length > 0) {
                            analyses.push({
                                name: s.title.length > 20 ? s.title.slice(0, 20) + '...' : s.title,
                                count: aRes.data.length
                            })
                        }
                    } catch (_) { }
                }
                setAnalysisData(analyses)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const activeSurveys = surveys.filter((s) => s.isActive).length
    const inactiveSurveys = surveys.length - activeSurveys

    const pieData = [
        { name: 'Active', value: activeSurveys },
        { name: 'Inactive', value: inactiveSurveys },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#01696f]" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-500 text-sm mt-1">Overview of your survey platform</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Surveys" value={surveys.length} icon={ClipboardList} color="teal" />
                <StatCard title="Active Surveys" value={activeSurveys} icon={TrendingUp} color="green" />
                <StatCard title="Inactive Surveys" value={inactiveSurveys} icon={MessageSquare} color="orange" />
                <StatCard title="AI Analyses" value={analysisData.length} icon={BrainCircuit} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base font-semibold text-gray-800 mb-4">Survey Status</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                                {pieData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-base font-semibold text-gray-800 mb-4">AI Analyses per Survey</h3>
                    {analysisData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={analysisData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#01696f" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                            No analysis data yet.
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Recent Surveys</h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {surveys.slice(0, 5).map((s) => (
                        <div key={s._id} className="flex items-center justify-between px-5 py-4">
                            <div>
                                <p className="text-sm font-medium text-gray-800">{s.title}</p>
                                <p className="text-xs text-gray-400">{s.questions?.length || 0} questions</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${s.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {s.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    ))}
                    {surveys.length === 0 && (
                        <div className="px-5 py-10 text-center text-gray-400 text-sm">
                            No surveys yet. Create your first survey!
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}