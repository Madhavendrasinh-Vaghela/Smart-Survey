import { useNavigate } from 'react-router-dom'
import { BrainCircuit, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ThankYou() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
                {/* Icon */}
                <div className="w-20 h-20 bg-[#e6f0f0] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-[#01696f]" />
                </div>

                {/* Text */}
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    Your response has been submitted successfully. We appreciate your valuable feedback
                    and will use it to improve our services.
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="flex-1 h-px bg-gray-100" />
                    <BrainCircuit size={16} className="text-gray-300" />
                    <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-[#01696f] hover:bg-[#0c4e54] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Back to Surveys
                    </button>
                    <p className="text-xs text-gray-400">
                        Powered by SmartSurvey AI
                    </p>
                </div>
            </div>
        </div>
    )
}