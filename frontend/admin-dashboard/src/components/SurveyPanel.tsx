import { useState } from 'react';
import axios from 'axios';
import SentimentChart from './SentimentChart';

export default function SurveyPanel() {
    const [sentimentCounts, setSentimentCounts] = useState({
        POSITIVE: 0,
        NEGATIVE: 0,
        PENDING: 0,
    });

    const [surveyId, setSurveyId] = useState('');
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const fetchSummary = async () => {
        try {
            const res = await axios.get('http://localhost:3000/analysis', { params: { surveyId } });
            if (res.data.length > 0) {
                setSummary(res.data[0].summary);
                const counts = { POSITIVE: 0, NEGATIVE: 0, PENDING: 0 };
                res.data.forEach((r: any) => {
                    counts[r.sentiment as 'POSITIVE' | 'NEGATIVE' | 'PENDING']++;
                });
                setSentimentCounts(counts);
            } else {
                setSummary(null);
                setMessage('No summary found');
            }
        } catch {
            setMessage('Failed to fetch data');
        }
    };

    const generateSummary = async () => {
        try {
            setLoading(true);
            setMessage(null);
            await axios.post('http://localhost:3000/analysis/generate', { surveyId });
            await fetchSummary();
        } catch {
            setMessage('Failed to generate summary');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-xl">
            <label className="block mb-2 font-medium text-black">
                Survey ID
            </label>
            <input
                className="border border-gray-300 p-2 w-full rounded-md mb-4 text-sm text-black placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="e.g. survey-501"
                value={surveyId}
                onChange={(e) => setSurveyId(e.target.value)}
            />
            <div className="flex gap-3">
                <button
                    onClick={fetchSummary}
                    className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-md border border-brand text-sm font-medium transition-colors"
                >
                    View Summary
                </button>
                <button
                    onClick={generateSummary}
                    disabled={loading}
                    className="bg-white border border-brand text-brand hover:bg-brand hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? 'Generating…' : 'Generate AI Summary'}
                </button>
            </div>

            {message && (
                <p className="mt-4 text-sm text-black">{message}</p>
            )}

            {summary && (
                <>
                    <div className="mt-6 bg-white border border-gray-200 p-4 rounded-lg">
                        <h2 className="font-semibold mb-2 text-brand">AI Summary</h2>
                        <p className="text-black text-sm">{summary}</p>
                    </div>
                    <SentimentChart sentimentCounts={sentimentCounts} />
                </>
            )}
        </div>
    );
}
