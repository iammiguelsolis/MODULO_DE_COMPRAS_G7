import { Star } from "lucide-react";
import type { AnalysisMode, SupplierAnalysis } from "../../page/AnalisisProveedoresPage";

interface SupplierAnalysisTableProps {
    mode: AnalysisMode;
    suppliers: SupplierAnalysis[];
    selectedId: number | null;
    onSelectSupplier: (id: number) => void;
}

const SupplierAnalysisTable: React.FC<SupplierAnalysisTableProps> = ({
    mode,
    suppliers,
    selectedId,
    onSelectSupplier
}) => {
    const renderStars = (value: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={16}
                    className={i < value ? "text-yellow-500 inline fill-yellow-500" : "text-gray-300 inline"}
                />
            );
        }
        return <div className="flex gap-1">{stars}</div>;
    };

    return (
        <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden mb-6">
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm">
                        <th className="px-6 py-4 text-left font-semibold">Proveedor</th>
                        {mode === "plazos" ? (
                            <>
                                <th className="px-6 py-4 text-left font-semibold">% Entregas dentro del plazo</th>
                                <th className="px-6 py-4 text-left font-semibold">% Entregas con retraso</th>
                                <th className="px-6 py-4 text-left font-semibold">E. retraso / E. Totales</th>
                                <th className="px-6 py-4 text-left font-semibold">Promedio días de retraso</th>
                            </>
                        ) : (
                            <>
                                <th className="px-6 py-4 text-left font-semibold">% Facturas correctas</th>
                                <th className="px-6 py-4 text-left font-semibold">% Facturas observadas</th>
                                <th className="px-6 py-4 text-left font-semibold">F.Observadas / F. Totales</th>
                                <th className="px-6 py-4 text-left font-semibold">Motivo predominante</th>
                            </>
                        )}
                        <th className="px-6 py-4 text-left font-semibold">Calificación</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier) => (
                        <tr
                            key={supplier.id}
                            onClick={() => onSelectSupplier(supplier.id)}
                            className={`border-b border-gray-200 cursor-pointer transition-colors ${selectedId === supplier.id
                                ? "bg-green-400 hover:bg-green-500"
                                : "hover:bg-gray-50"
                                }`}
                        >
                            <td className="px-6 py-4 text-sm text-gray-700">{supplier.proveedor}</td>
                            {mode === "plazos" ? (
                                <>
                                    <td className="px-6 py-4 text-sm text-gray-700">{supplier.porcentajeEnPlazo}%</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{supplier.porcentajeRetraso}%</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{supplier.retrasosTotal}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{supplier.promedioDiasRetraso}</td>
                                </>
                            ) : (
                                <>
                                    <td className="px-6 py-4 text-sm text-gray-700">{supplier.porcentajeFacturasCorrectas}%</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{supplier.porcentajeFacturasObservadas}%</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{supplier.observadasTotal}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{supplier.motivoPredominante}</td>
                                </>
                            )}
                            <td className="px-6 py-4">{renderStars(supplier.calificacion)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SupplierAnalysisTable;