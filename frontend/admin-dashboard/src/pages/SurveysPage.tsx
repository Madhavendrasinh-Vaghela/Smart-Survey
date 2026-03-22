import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiClient from '../api/client';

type Survey = {
    id?: string;
    _id?: string;
    title: string;
    description?: string;
    createdAt?: string;
};

function SurveysPage() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await apiClient.get('/surveys');
                setSurveys(res.data);
            } catch (err: any) {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Failed to load surveys';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchSurveys();
    }, []);

    return (
        <div>
            <h1 className="text-xl font-semibold text-black mb-4">Surveys</h1>

            {loading && <p className="text-gray-700 text-sm">Loading surveys...</p>}

            {error && !loading && (
                <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded mb-3">
                    Error: {error}
                </p>
            )}

            {!loading && !error && surveys.length === 0 && (
                <p className="text-gray-700 text-sm">
                    No surveys found. Create one from the left menu.
                </p>
            )}

            {!loading && !error && surveys.length > 0 && (
                <div className="space-y-3">
                    {surveys.map((s) => {
                        const id = s.id || s._id;
                        return (
                            <div
                                key={id}
                                className="border border-gray-200 rounded-lg p-3 bg-white flex items-start justify-between hover:bg-gray-50 transition"
                            >
                                <div>
                                    <h2 className="text-lg font-medium text-black">{s.title}</h2>
                                    {s.description && (
                                        <p className="text-gray-800 text-sm mt-1">
                                            {s.description}
                                        </p>
                                    )}
                                    {s.createdAt && (
                                        <p className="text-gray-500 text-xs mt-1">
                                            Created: {new Date(s.createdAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                {id && (
                                    <Link
                                        to={`/surveys/${id}`}
                                        className="text-sm text-black underline ml-4 whitespace-nowrap"
                                    >
                                        View
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default SurveysPage;
