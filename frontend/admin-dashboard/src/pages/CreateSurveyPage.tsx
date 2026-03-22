import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

function CreateSurveyPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!title.trim() || !question.trim()) {
            setError('Title and at least one question are required.');
            return;
        }

        try {
            setLoading(true);

            // Adjust body shape to match your Survey Service DTO
            const body = {
                title,
                description,
                questions: [
                    {
                        questionId: 'q1',
                        label: question,
                        type: 'text',
                    },
                ],
            };

            await apiClient.post('/surveys', body);
            setSuccess('Survey created successfully.');
            // Small delay then go back to list
            setTimeout(() => navigate('/surveys'), 800);
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Failed to create survey';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl">
            <h1 className="text-xl font-semibold text-black mb-4">Create Survey</h1>

            {error && (
                <p className="mb-3 text-sm text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded">
                    {error}
                </p>
            )}
            {success && (
                <p className="mb-3 text-sm text-green-700 border border-green-200 bg-green-50 px-3 py-2 rounded">
                    {success}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-black mb-1 font-medium">
                        Title
                    </label>
                    <input
                        type="text"
                        className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Client Feedback Survey"
                    />
                </div>

                <div>
                    <label className="block text-sm text-black mb-1 font-medium">
                        Description (optional)
                    </label>
                    <textarea
                        className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Quarterly project feedback form"
                    />
                </div>

                <div>
                    <label className="block text-sm text-black mb-1 font-medium">
                        Question
                    </label>
                    <input
                        type="text"
                        className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Describe your experience with the project"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                        For now we send a single text question; more questions can be added
                        later.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 rounded-md bg-black text-white text-sm font-medium border border-black disabled:opacity-60"
                >
                    {loading ? 'Creating...' : 'Create Survey'}
                </button>
            </form>
        </div>
    );
}

export default CreateSurveyPage;
