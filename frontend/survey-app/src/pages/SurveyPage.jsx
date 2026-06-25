import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { BrainCircuit, ArrowLeft, ArrowRight, Loader2, Send } from 'lucide-react'

export default function SurveyPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [survey, setSurvey] = useState(null)
    const [answers, setAnswers] = useState({})
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [userId] = useState(`user_${Date.now()}`)

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const res = await api.get(`/surveys/${id}`)
                setSurvey(res.data)
                const initial = {}
                res.data.questions?.forEach((q) => { initial[q.questionId] = '' })
                setAnswers(initial)
            } catch {
                toast.error('Failed to load survey')
                navigate('/')
            } finally {
                setLoading(false)
            }
        }
        fetchSurvey()
    }, [id])

    const handleAnswer = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const unanswered = survey.questions.filter(
            (q) => q.required && !answers[q.questionId]?.trim()
        )
        if (unanswered.length > 0) {
            toast.error(`Please answer all required questions (${unanswered.length} remaining)`)
            return
        }

        setSubmitting(true)
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
                questionId,
                answer,
            }))

            await api.post('/responses', {
                surveyId: id,
                userId,
                answers: formattedAnswers,
            })

            navigate('/thankyou')
        } catch {
            toast.error('Failed to submit. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center">
                <Loader2 size={36} className="animate-spin text-[#01696f]" />
            </div>
        )
    }

    const answeredCount = Object.values(answers).filter((a) => a?.trim()).length
    const totalCount = survey?.questions?.length || 0
    const progress = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0

    return (
        <div className="min-h-screen bg-[#f7f6f2]">
            {/* Header */}
            <header className="bg-[#0c4e54] text-white py-5 px-4 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-3">
                        <button
                            onClick={() => navigate('/')}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <BrainCircuit size={18} className="text-white/70" />
                            <span className="text-sm text-white/70">SmartSurvey</span>
                        </div>
                    </div>
                    <h1 className="text-lg font-bold">{survey?.title}</h1>
                    {survey?.description && (
                        <p className="text-white/60 text-xs mt-0.5">{survey.description}</p>
                    )}
                    {/* Progress Bar */}
                    <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                            <span>{answeredCount} of {totalCount} answered</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-1.5">
                            <div
                                className="bg-white rounded-full h-1.5 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {survey?.questions?.map((q, idx) => (
                        <div key={q.questionId} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-start gap-3 mb-4">
                                <span className="w-7 h-7 rounded-full bg-[#e6f0f0] text-[#01696f] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {idx + 1}
                                </span>
                                <div>
                                    <p className="text-gray-800 font-medium leading-snug">
                                        {q.label}
                                        {q.required && <span className="text-red-400 ml-1">*</span>}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{q.type}</p>
                                </div>
                            </div>

                            {/* Text Input */}
                            {q.type === 'text' && (
                                <textarea
                                    rows={3}
                                    value={answers[q.questionId] || ''}
                                    onChange={(e) => handleAnswer(q.questionId, e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f] resize-none"
                                    placeholder="Type your answer here..."
                                />
                            )}

                            {/* Rating Input */}
                            {q.type === 'rating' && (
                                <div className="flex gap-3 flex-wrap">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => handleAnswer(q.questionId, String(val))}
                                            className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${answers[q.questionId] === String(val)
                                                    ? 'bg-[#01696f] text-white shadow-md scale-110'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-[#e6f0f0] hover:text-[#01696f]'
                                                }`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Multiple Choice */}
                            {q.type === 'multiple-choice' && (
                                <div className="space-y-2">
                                    {(q.options || []).map((opt) => (
                                        <label
                                            key={opt}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${answers[q.questionId] === opt
                                                    ? 'border-[#01696f] bg-[#e6f0f0]'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${answers[q.questionId] === opt
                                                    ? 'border-[#01696f]'
                                                    : 'border-gray-300'
                                                }`}>
                                                {answers[q.questionId] === opt && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#01696f]" />
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#01696f] hover:bg-[#0c4e54] text-white font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-base shadow-lg"
                    >
                        {submitting
                            ? <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                            : <><Send size={18} /> Submit Survey</>
                        }
                    </button>
                </form>
            </main>
        </div>
    )
}