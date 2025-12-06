import { useState, useEffect } from "react";
import LaborConditionsTable from "../components/organisms/LabelConditionsTable";
import ColorLegend from "../components/molecules/ColorLegend";
import IndexInterpretation from "../components/molecules/IndexInterpretation";
import { AnalisisApi } from "../../../services/analisisProveedor/api";
import type { LaborConditionsAnalysis } from "../../../services/analisisProveedor/types";

// Datos de ejemplo (fallback cuando no hay backend o error)
const sampleData: LaborConditionsAnalysis[] = [
    { id: 1, proveedor: "Tecnologías Andinas S.A.C.", numeroTrabajadores: 19, indiceDenuncias: 0.6, tieneProcesos: false, haTomaRepresalias: false },
    { id: 2, proveedor: "Lógico S.A.C.", numeroTrabajadores: 20, indiceDenuncias: 0.4, tieneProcesos: true, haTomaRepresalias: false },
    { id: 3, proveedor: "ElectroPerú SRL", numeroTrabajadores: 100, indiceDenuncias: 1.4, tieneProcesos: true, haTomaRepresalias: true },
    { id: 4, proveedor: "ServiHealth EIRL", numeroTrabajadores: 40, indiceDenuncias: 2, tieneProcesos: false, haTomaRepresalias: false },
    { id: 5, proveedor: "Construcciones del Norte SAC", numeroTrabajadores: 45, indiceDenuncias: 0.3, tieneProcesos: true, haTomaRepresalias: false },
    { id: 6, proveedor: "Distribuidora Central EIRL", numeroTrabajadores: 12, indiceDenuncias: 1.8, tieneProcesos: false, haTomaRepresalias: true },
    { id: 7, proveedor: "Servicios Integrales SAC", numeroTrabajadores: 30, indiceDenuncias: 0.7, tieneProcesos: true, haTomaRepresalias: false },
    { id: 8, proveedor: "Transportes Rápidos SRL", numeroTrabajadores: 55, indiceDenuncias: 1.2, tieneProcesos: true, haTomaRepresalias: false },
    { id: 9, proveedor: "Alimentos del Pacífico SAC", numeroTrabajadores: 80, indiceDenuncias: 0.2, tieneProcesos: true, haTomaRepresalias: false },
    { id: 10, proveedor: "Textiles Andinos EIRL", numeroTrabajadores: 65, indiceDenuncias: 3.5, tieneProcesos: false, haTomaRepresalias: true },
    { id: 11, proveedor: "Minería del Sur SAC", numeroTrabajadores: 150, indiceDenuncias: 2.8, tieneProcesos: false, haTomaRepresalias: true },
    { id: 12, proveedor: "Agroindustrias Peruanas SRL", numeroTrabajadores: 90, indiceDenuncias: 0.5, tieneProcesos: true, haTomaRepresalias: false },
];

const AnalisisProveedoresPage = () => {
    const [data, setData] = useState<LaborConditionsAnalysis[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Cargar datos del backend
    useEffect(() => {
        fetchAnalisisData();
    }, []);

    const fetchAnalisisData = async () => {
        setLoading(true);
        setError(null);

        try {
            const analisisData = await AnalisisApi.listarCondicionesLaborales();

            if (analisisData.length === 0) {
                // Si no hay datos en el backend, usar datos de ejemplo
                setData(sampleData);
                setError("No hay datos de análisis laboral en el backend. Mostrando datos de ejemplo.");
            } else {
                setData(analisisData);
            }
        } catch (err) {
            console.error("Error al cargar análisis de proveedores:", err);
            const errorMessage = err instanceof Error ? err.message : "Error desconocido";
            setError(errorMessage);
            // Fallback: usar datos de ejemplo si falla la API
            setData(sampleData);
        } finally {
            setLoading(false);
        }
    };

    // Calcular paginación
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Evaluación de proveedores</h1>

                {/* Título de la sección */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-blue-600 bg-blue-100 px-6 py-3 rounded-lg inline-block">
                        Evaluación de condiciones laborales
                    </h2>
                </div>

                {/* Mensajes de estado */}
                {loading && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            ⏳ Cargando datos de análisis...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            ⚠️ {error}
                        </p>
                    </div>
                )}

                {/* Tabla de análisis */}
                <LaborConditionsTable
                    suppliers={currentData}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPreviousPage={handlePreviousPage}
                    onNextPage={handleNextPage}
                />

                {/* Leyenda y explicación */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ColorLegend />
                    <IndexInterpretation />
                </div>
            </div>
        </div>
    );
};

export default AnalisisProveedoresPage;