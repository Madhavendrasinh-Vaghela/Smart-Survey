import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, BrainCircuit, RefreshCw, Loader2 } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Analysis() {
    const { surveyId } = useParams()
    const navigate = useNavigate()
    const [results, setResults] = useState([])
    const [survey, setSurvey] = useState(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)

    const fetchData = async () => {
        try {
            const [sRes, aRes] = await Promise.all([
                api.get(`/surveys/${surveyId}`),
                api.get(`/analysis?surveyId=${surveyId}`),
            ])
            setSurvey(sRes.data)
            setResults(aRes.data || [])
        } catch {
            toast.error('Failed to load analysis')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [surveyId])

    const generateAnalysis = async () => {
        setGenerating(true)
        try {
            await api.post('/analysis/generate', { surveyId })
            toast.success('Analysis generated!')
            await fetchData()
        } catch {
            toast.error('Failed to generate analysis')
        } finally {
            setGenerating(false)
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
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/surveys')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">AI Analysis</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{survey?.title}</p>
                    </div>
                </div>
                <button
                    onClick={generateAnalysis}
                    disabled={generating}
                    className="flex items-center gap-2 bg-[#01696f] hover:bg-[#0c4e54] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                >
                    {generating
                        ? <Loader2 size={16} className="animate-spin" />
                        : <RefreshCw size={16} />
                    }
                    {generating ? 'Generating...' : 'Generate Analysis'}
                </button>
            </div>

            {results.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-gray-100">
                    <BrainCircuit size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium mb-1">No analysis yet</p>
                    <p className="text-gray-400 text-sm mb-6">
                        Click "Generate Analysis" to create an AI summary of all responses.
                    </p>
                    <button
                        onClick={generateAnalysis}
                        disabled={generating}
                        className="bg-[#01696f] hover:bg-[#0c4e54] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 flex items-center gap-2 mx-auto"
                    >
                        {generating
                            ? <Loader2 size={16} className="animate-spin" />
                            : <BrainCircuit size={16} />
                        }
                        {generating ? 'Generating...' : 'Generate Now'}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {results.map((r, idx) => (
                        <div key={r.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#e6f0f0] rounded-lg flex items-center justify-center">
                                        <BrainCircuit size={16} className="text-[#01696f]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Analysis #{results.length - idx}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(r.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${r.sentiment === 'BATCH'
                                        ? 'bg-blue-50 text-blue-600'
                                        : r.sentiment === 'PENDING'
                                            ? 'bg-yellow-50 text-yellow-600'
                                            : 'bg-green-50 text-green-600'
                                    }`}>
                                    {r.sentiment}
                                </span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-700 leading-relaxed">{r.summary}</p>
                            </div>
                            {r.responseId && (
                                <p className="text-xs text-gray-400 mt-3">
                                    Response ID: {r.responseId}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}