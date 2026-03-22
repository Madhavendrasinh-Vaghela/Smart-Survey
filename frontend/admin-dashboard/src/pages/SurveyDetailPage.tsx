import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/client';

type Question = {
    questionId?: string;
    label: string;
    type?: string;
};

type SurveyDetail = {
    id?: string;
    _id?: string;
    title: string;
    description?: string;
    questions?: Question[];
    createdAt?: string;
};

function SurveyDetailPage() {
    const { surveyId } = useParams<{ surveyId: string }>();
    const [survey, setSurvey] = useState<SurveyDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!surveyId) return;

        const fetchSurvey = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await apiClient.get(`/surveys/${surveyId}`);
                setSurvey(res.data);
            } catch (err: any) {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Failed to load survey';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchSurvey();
    }, [surveyId]);

    if (loading) {
        return <p className="text-gray-700 text-sm">Loading survey...</p>;
    }

    if (error) {
        return (
            <div>
                <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded mb-3">
                    Error: {error}
                </p>
                <Link to="/surveys" className="text-sm text-black underline">
                    Back to Surveys
                </Link>
            </div>
        );
    }

    if (!survey) {
        return (
            <div>
                <p className="text-gray-700 text-sm">Survey not found.</p>
                <Link to="/surveys" className="text-sm text-black underline">
                    Back to Surveys
                </Link>
            </div>
        );
    }

    return (
        <div>
            <Link to="/surveys" className="text-sm text-black underline">
                ← Back to Surveys
            </Link>

            <h1 className="text-xl font-semibold text-black mt-3 mb-2">
                {survey.title}
            </h1>
            {survey.description && (
                <p className="text-gray-800 text-sm mb-3">{survey.description}</p>
            )}
            {survey.createdAt && (
                <p className="text-gray-500 text-xs mb-4">
                    Created: {new Date(survey.createdAt).toLocaleString()}
                </p>
            )}

            <h2 className="text-lg font-medium text-black mb-2">Questions</h2>
            {survey.questions && survey.questions.length > 0 ? (
                <ol className="list-decimal list-inside space-y-1">
                    {survey.questions.map((q, index) => (
                        <li key={q.questionId || index} className="text-sm text-gray-800">
                            {q.label}
                            {q.type && (
                                <span className="text-xs text-gray-600"> ({q.type})</span>
                            )}
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="text-gray-700 text-sm">No questions defined.</p>
            )}
        </div>
    );
}

export default SurveyDetailPage;
