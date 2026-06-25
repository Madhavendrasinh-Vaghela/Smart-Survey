import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Responses() {
    const { surveyId } = useParams()
    const navigate = useNavigate()
    const [responses, setResponses] = useState([])
    const [survey, setSurvey] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sRes, rRes] = await Promise.all([
                    api.get(`/surveys/${surveyId}`),
                    api.get(`/responses?surveyId=${surveyId}`),
                ])
                setSurvey(sRes.data)
                setResponses(rRes.data || [])
            } catch {
                toast.error('Failed to load responses')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [surveyId])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#01696f]" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/surveys')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Responses</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {survey?.title} — {responses.length} responses
                    </p>
                </div>
            </div>

            {responses.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-gray-100">
                    <MessageSquare size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No responses submitted yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {responses.map((r, idx) => (
                        <div key={r._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Response #{idx + 1}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(r.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {r.answers?.map((a) => {
                                    const question = survey?.questions?.find((q) => q.questionId === a.questionId)
                                    return (
                                        <div key={a.questionId} className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs font-medium text-gray-500 mb-1">
                                                {question?.label || a.questionId}
                                            </p>
                                            <p className="text-sm text-gray-800">{a.answer || '—'}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}