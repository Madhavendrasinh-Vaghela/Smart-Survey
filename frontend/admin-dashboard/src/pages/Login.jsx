import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { BrainCircuit, Loader2 } from 'lucide-react'

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await api.post('/auth/login', form)
            localStorage.setItem('token', res.data.access_token)

            const payload = JSON.parse(atob(res.data.access_token.split('.')[1]))
            localStorage.setItem('user', JSON.stringify({
                name: payload.email?.split('@')[0] || 'Admin',
                role: payload.role || 'ADMIN',
                email: payload.email,
            }))

            toast.success('Welcome back!')
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0c4e54] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#01696f] rounded-xl flex items-center justify-center">
                        <BrainCircuit size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">SmartSurvey</h1>
                        <p className="text-xs text-gray-500">Admin Dashboard</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in</h2>
                <p className="text-gray-500 text-sm mb-6">Enter your credentials to continue</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f]"
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f]"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#01696f] hover:bg-[#0c4e54] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#01696f] font-semibold hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    )
}