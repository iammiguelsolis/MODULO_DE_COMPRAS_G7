import type { LaborConditionsAnalysis } from "../../../../services/analisisProveedor/types";
import TablePagination from "../molecules/TablePagination";

interface LaborConditionsTableProps {
    suppliers: LaborConditionsAnalysis[];
    currentPage: number;
    totalPages: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
}

const LaborConditionsTable: React.FC<LaborConditionsTableProps> = ({
    suppliers,
    currentPage,
    totalPages,
    onPreviousPage,
    onNextPage
}) => {
    // Determinar color de fila según el índice de denuncias
    const getRowColor = (indiceDenuncias: number): string => {
        if (indiceDenuncias < 0.5) return "bg-blue-200"; // Azul claro
        if (indiceDenuncias >= 0.5 && indiceDenuncias < 1.5) return "bg-red-200"; // Rojo claro
        if (indiceDenuncias >= 1.5 && indiceDenuncias < 3) return "bg-green-300"; // Verde
        return "bg-white"; // Por defecto (>= 3)
    };

    return (
        <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden mb-6">
            {/* Contenedor con scroll */}
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="min-w-full table-auto">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-100 text-gray-700 text-sm">
                            <th className="px-6 py-4 text-left font-semibold">Proveedor</th>
                            <th className="px-6 py-4 text-left font-semibold">Número de trabajadores</th>
                            <th className="px-6 py-4 text-left font-semibold">Índice de denuncias</th>
                            <th className="px-6 py-4 text-left font-semibold">
                                Tiene procesos de mejora<br />de condiciones laborales
                            </th>
                            <th className="px-6 py-4 text-left font-semibold">
                                Ha tomado represalias<br />contra sindicato
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier) => (
                            <tr
                                key={supplier.id}
                                className={`border-b border-gray-200 ${getRowColor(supplier.indiceDenuncias)}`}
                            >
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                    {supplier.proveedor}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                                    {supplier.numeroTrabajadores}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                                    {supplier.indiceDenuncias}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                                    {supplier.tieneProcesos ? "Sí" : "No"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                                    {supplier.haTomaRepresalias ? "No tiene" : "Sí"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousPage={onPreviousPage}
                onNextPage={onNextPage}
            />
        </div>
    );
};

export default LaborConditionsTable;