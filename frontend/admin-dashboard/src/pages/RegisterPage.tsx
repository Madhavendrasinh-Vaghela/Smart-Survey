import { type FormEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('access_token');
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        // TODO: call real API later
        localStorage.setItem('access_token', 'demo-token');
        navigate('/surveys');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-black mb-1">Register</h1>
                <p className="text-sm text-gray-800 mb-6">
                    Create your Smart Survey Admin account
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-black mb-1 font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-black mb-1 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                            placeholder="admin@example.com"
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
                            required
                            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-black mb-1 font-medium">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-black mb-1 font-medium">
                            Role
                        </label>
                        <select
                            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-2 bg-black hover:bg-gray-900 text-white font-medium rounded-md border border-black py-2 text-sm transition-colors"
                    >
                        Register
                    </button>
                    <p className="text-sm text-gray-800 text-center mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-black underline font-semibold">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
