export default function Header() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div />
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">{user.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500">{user.role || 'ADMIN'}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#01696f] flex items-center justify-center text-white text-sm font-bold">
                    {(user.name || 'A')[0].toUpperCase()}
                </div>
            </div>
        </header>
    )
}