export default function StatCard({ title, value, icon: Icon, color = 'teal', sub }) {
    const colors = {
        teal: 'bg-[#e6f0f0] text-[#01696f]',
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        orange: 'bg-orange-50 text-orange-600',
    }

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
                </div>
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    <Icon size={22} />
                </div>
            </div>
        </div>
    )
}