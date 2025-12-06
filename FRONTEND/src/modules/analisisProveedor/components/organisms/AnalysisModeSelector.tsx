import type { AnalysisMode } from "../../page/AnalisisProveedoresPage";

interface AnalysisModeSelectorProps {
    mode: AnalysisMode;
    onModeChange: (mode: AnalysisMode) => void;
}

const AnalysisModeSelector: React.FC<AnalysisModeSelectorProps> = ({ mode, onModeChange }) => {
    return (
        <div className="flex gap-4 mb-6">
            <button
                onClick={() => onModeChange("plazos")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${mode === "plazos"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
            >
                Evaluación de plazos de entrega
            </button>
            <button
                onClick={() => onModeChange("facturas")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${mode === "facturas"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
            >
                Evaluación de cumplimiento condiciones de pago
            </button>
        </div>
    );
};

export default AnalysisModeSelector;