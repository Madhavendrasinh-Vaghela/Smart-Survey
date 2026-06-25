import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Trash2, ToggleLeft, ToggleRight, BrainCircuit, Loader2 } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Surveys() {
    const [surveys, setSurveys] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const fetchSurveys = async () => {
        try {
            const res = await api.get('/surveys')
            setSurveys(res.data || [])
        } catch {
            toast.error('Failed to load surveys')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchSurveys() }, [])

    const toggleStatus = async (id) => {
        try {
            await api.patch(`/surveys/${id}/toggle`)
            toast.success('Status updated')
            fetchSurveys()
        } catch {
            toast.error('Failed to update status')
        }
    }

    const deleteSurvey = async (id) => {
        if (!window.confirm('Delete this survey?')) return
        try {
            await api.delete(`/surveys/${id}`)
            toast.success('Survey deleted')
            fetchSurveys()
        } catch {
            toast.error('Failed to delete')
        }
    }

    const generateAnalysis = async (surveyId) => {
        try {
            toast.loading('Generating AI analysis...', { id: 'ai' })
            await api.post('/analysis/generate', { surveyId })
            toast.success('Analysis generated!', { id: 'ai' })
        } catch {
            toast.error('Failed to generate analysis', { id: 'ai' })
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#01696f]" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Surveys</h2>
                    <p className="text-sm text-gray-500 mt-1">{surveys.length} total surveys</p>
                </div>
                <button
                    onClick={() => navigate('/surveys/create')}
                    className="flex items-center gap-2 bg-[#01696f] hover:bg-[#0c4e54] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                    <Plus size={16} />
                    Create Survey
                </button>
            </div>

            {surveys.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-sm">No surveys yet.</p>
                    <button
                        onClick={() => navigate('/surveys/create')}
                        className="mt-4 text-[#01696f] text-sm font-medium hover:underline"
                    >
                        Create your first survey →
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-5 py-3 text-gray-600 font-medium">Title</th>
                                <th className="text-left px-5 py-3 text-gray-600 font-medium">Questions</th>
                                <th className="text-left px-5 py-3 text-gray-600 font-medium">Status</th>
                                <th className="text-left px-5 py-3 text-gray-600 font-medium">Created</th>
                                <th className="text-right px-5 py-3 text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {surveys.map((s) => (
                                <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-gray-800">{s.title}</p>
                                        {s.description && (
                                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{s.description}</p>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">{s.questions?.length || 0}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${s.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {s.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-gray-500 text-xs">
                                        {new Date(s.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => navigate(`/responses/${s._id}`)}
                                                title="View Responses"
                                                className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => generateAnalysis(s._id)}
                                                title="Generate AI Analysis"
                                                className="p-2 rounded-lg hover:bg-purple-50 text-purple-500 transition-colors"
                                            >
                                                <BrainCircuit size={16} />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/analysis/${s._id}`)}
                                                title="View Analysis"
                                                className="px-3 py-1.5 rounded-lg hover:bg-teal-50 text-[#01696f] transition-colors text-xs font-semibold"
                                            >
                                                AI
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(s._id)}
                                                title="Toggle Status"
                                                className={`p-2 rounded-lg transition-colors ${s.isActive
                                                        ? 'hover:bg-orange-50 text-orange-500'
                                                        : 'hover:bg-green-50 text-green-500'
                                                    }`}
                                            >
                                                {s.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                            </button>
                                            <button
                                                onClick={() => deleteSurvey(s._id)}
                                                title="Delete"
                                                className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}