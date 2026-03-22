import { Link, NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
    { to: '/surveys', label: 'Surveys' },
    { to: '/surveys/new', label: 'Create Survey' },
    { to: '/analysis', label: 'AI Analysis' },
];

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const isAuthenticated = !!localStorage.getItem('access_token');
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white text-black flex">
            {/* Sidebar */}
            <aside
                className={`bg-white w-64 flex-shrink-0 border-r border-gray-200 ${sidebarOpen ? 'block' : 'hidden'
                    } md:block`}
            >
                <div className="h-16 flex items-center px-4 border-b border-gray-200">
                    <span className="text-lg font-semibold text-black">Smart Survey</span>
                </div>
                <nav className="mt-4 px-2 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-sm font-medium ${isActive
                                    ? 'bg-black text-white'
                                    : 'text-black hover:bg-gray-100'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col">
                {/* Top bar */}
                <header className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
                    <button
                        className="md:hidden text-black border border-gray-300 rounded px-2 py-1"
                        onClick={() => setSidebarOpen((v) => !v)}
                    >
                        ☰
                    </button>
                    <div className="flex items-center gap-2">
                        <Link to="/" className="text-sm text-black underline">
                            Dashboard
                        </Link>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm px-3 py-1 rounded-md border border-gray-300 text-black hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-6 bg-white">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
