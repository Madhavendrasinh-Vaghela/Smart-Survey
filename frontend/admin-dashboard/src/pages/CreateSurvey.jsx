import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, Loader2 } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const QUESTION_TYPES = ['text', 'rating', 'multiple-choice']

const emptyQuestion = () => ({
    questionId: `q${Date.now()}`,
    type: 'text',
    label: '',
    options: [],
    required: false,
})

export default function CreateSurvey() {
    const [form, setForm] = useState({ title: '', description: '', questions: [emptyQuestion()] })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const addQuestion = () =>
        setForm((f) => ({ ...f, questions: [...f.questions, emptyQuestion()] }))

    const removeQuestion = (i) =>
        setForm((f) => ({ ...f, questions: f.questions.filter((_, idx) => idx !== i) }))

    const updateQuestion = (i, field, value) =>
        setForm((f) => {
            const questions = [...f.questions]
            questions[i] = { ...questions[i], [field]: value }
            return { ...f, questions }
        })

    const updateOption = (qi, oi, value) =>
        setForm((f) => {
            const questions = [...f.questions]
            const options = [...(questions[qi].options || [])]
            options[oi] = value
            questions[qi] = { ...questions[qi], options }
            return { ...f, questions }
        })

    const addOption = (qi) =>
        setForm((f) => {
            const questions = [...f.questions]
            questions[qi].options = [...(questions[qi].options || []), '']
            return { ...f, questions }
        })

    const removeOption = (qi, oi) =>
        setForm((f) => {
            const questions = [...f.questions]
            questions[qi].options = questions[qi].options.filter((_, i) => i !== oi)
            return { ...f, questions }
        })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.title.trim()) return toast.error('Title is required')
        if (form.questions.some((q) => !q.label.trim())) return toast.error('All questions need a label')

        setLoading(true)
        try {
            await api.post('/surveys', form)
            toast.success('Survey created!')
            navigate('/surveys')
        } catch {
            toast.error('Failed to create survey')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate('/surveys')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Create Survey</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Build your survey with custom questions</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-semibold text-gray-700">Survey Details</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f]"
                            placeholder="e.g. Client Satisfaction Q2 2026"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f] resize-none"
                            placeholder="Brief description..."
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">Questions ({form.questions.length})</h3>
                    {form.questions.map((q, i) => (
                        <div key={q.questionId} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Question {i + 1}
                                </span>
                                {form.questions.length > 1 && (
                                    <button type="button" onClick={() => removeQuestion(i)}
                                        className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                                    <select
                                        value={q.type}
                                        onChange={(e) => updateQuestion(i, 'type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f]"
                                    >
                                        {QUESTION_TYPES.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={q.required}
                                            onChange={(e) => updateQuestion(i, 'required', e.target.checked)}
                                            className="rounded"
                                        />
                                        Required
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Question Label *</label>
                                <input
                                    type="text"
                                    value={q.label}
                                    onChange={(e) => updateQuestion(i, 'label', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f]"
                                    placeholder="Enter your question..."
                                />
                            </div>

                            {q.type === 'multiple-choice' && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">Options</label>
                                    <div className="space-y-2">
                                        {(q.options || []).map((opt, oi) => (
                                            <div key={oi} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => updateOption(i, oi, e.target.value)}
                                                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f]"
                                                    placeholder={`Option ${oi + 1}`}
                                                />
                                                <button type="button" onClick={() => removeOption(i, oi)}
                                                    className="p-1.5 hover:bg-red-50 text-red-400 rounded transition-colors">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addOption(i)}
                                            className="text-xs text-[#01696f] hover:underline font-medium">
                                            + Add option
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full border-2 border-dashed border-gray-200 hover:border-[#01696f] text-gray-400 hover:text-[#01696f] py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={16} />
                    Add Question
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#01696f] hover:bg-[#0c4e54] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? 'Creating...' : 'Create Survey'}
                </button>
            </form>
        </div>
    )
}