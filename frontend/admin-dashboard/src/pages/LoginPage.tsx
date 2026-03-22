import { type FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';

function LoginPage() {
    const [email, setEmail] = useState('admin@test.com'); // use a real user
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);
            const res = await apiClient.post('/auth/login', { email, password });

            // expect { access_token: '...' }
            const token = res.data?.access_token;
            if (!token) {
                setError('Login failed: no token in response');
                return;
            }

            localStorage.setItem('access_token', token);
            navigate('/surveys');
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Login failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-black mb-1">
                    Smart Survey Admin
                </h1>
                <p className="text-sm text-gray-800 mb-6">Sign in to your account</p>

                {error && (
                    <p className="mb-3 text-sm text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-black mb-1 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-black mb-1 font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-black hover:bg-gray-900 text-white font-medium rounded-md border border-black py-2 text-sm disabled:opacity-60"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p className="text-sm text-gray-800 text-center mt-4 pt-2">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="text-black underline font-semibold">
                            Register now
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
