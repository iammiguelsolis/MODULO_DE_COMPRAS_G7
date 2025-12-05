import { useState } from "react";
import AnalysisModeSelector from "../components/organisms/AnalysisModeSelector";
import SupplierAnalysisTable from "../components/organisms/SupplierAnalysisTable";
import SupplierDetailPanel from "../components/organisms/SupplierDetailPanel";

// Tipos
export type AnalysisMode = "plazos" | "facturas";

export interface SupplierAnalysis {
    id: number;
    proveedor: string;
    // Modo Plazos
    porcentajeEnPlazo?: number;
    porcentajeRetraso?: number;
    retrasosTotal?: string;
    promedioDiasRetraso?: number;
    // Modo Facturas
    porcentajeFacturasCorrectas?: number;
    porcentajeFacturasObservadas?: number;
    observadasTotal?: string;
    motivoPredominante?: string;
    // Común
    calificacion: number;
}

// Datos de ejemplo
const sampleDataPlazos: SupplierAnalysis[] = [
    { id: 1, proveedor: "Tecnologías Andinas S.A.C.", porcentajeEnPlazo: 73, porcentajeRetraso: 27, retrasosTotal: "60/222", promedioDiasRetraso: 3, calificacion: 3 },
    { id: 2, proveedor: "Lógico S.A.C.", porcentajeEnPlazo: 82, porcentajeRetraso: 18, retrasosTotal: "36/200", promedioDiasRetraso: 5, calificacion: 4 },
    { id: 3, proveedor: "ElectroPerú SRL", porcentajeEnPlazo: 40, porcentajeRetraso: 60, retrasosTotal: "30/50", promedioDiasRetraso: 7, calificacion: 2 },
    { id: 4, proveedor: "ServiHealth EIRL", porcentajeEnPlazo: 93, porcentajeRetraso: 7, retrasosTotal: "35/500", promedioDiasRetraso: 2, calificacion: 5 }
];

const sampleDataFacturas: SupplierAnalysis[] = [
    { id: 1, proveedor: "Tecnologías Andinas S.A.C.", porcentajeFacturasCorrectas: 73, porcentajeFacturasObservadas: 27, observadasTotal: "60/222", motivoPredominante: "Fecha de emisión incorrecta", calificacion: 3 },
    { id: 2, proveedor: "Lógico S.A.C.", porcentajeFacturasCorrectas: 82, porcentajeFacturasObservadas: 18, observadasTotal: "36/200", motivoPredominante: "Monto de pago incorrecto", calificacion: 4 },
    { id: 3, proveedor: "ElectroPerú SRL", porcentajeFacturasCorrectas: 40, porcentajeFacturasObservadas: 60, observadasTotal: "30/50", motivoPredominante: "Factura de recepción incompleta", calificacion: 2 },
    { id: 4, proveedor: "ServiHealth EIRL", porcentajeFacturasCorrectas: 93, porcentajeFacturasObservadas: 7, observadasTotal: "35/500", motivoPredominante: "Cantidad incorrecta", calificacion: 5 }
];

const AnalisisProveedoresPage = () => {
    const [mode, setMode] = useState<AnalysisMode>("plazos");
    const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);

    const currentData = mode === "plazos" ? sampleDataPlazos : sampleDataFacturas;
    const selectedIndex = selectedSupplier ? currentData.findIndex(s => s.id === selectedSupplier) : -1;

    const handlePrevious = () => {
        if (selectedIndex > 0) {
            setSelectedSupplier(currentData[selectedIndex - 1].id);
        }
    };

    const handleNext = () => {
        if (selectedIndex < currentData.length - 1) {
            setSelectedSupplier(currentData[selectedIndex + 1].id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Análisis de Proveedores</h1>

                {/* Selector de modo */}
                <AnalysisModeSelector mode={mode} onModeChange={setMode} />

                {/* Tabla de análisis */}
                <SupplierAnalysisTable
                    mode={mode}
                    suppliers={currentData}
                    selectedId={selectedSupplier}
                    onSelectSupplier={setSelectedSupplier}
                />

                {/* Panel de detalle */}
                {selectedSupplier && (
                    <SupplierDetailPanel
                        mode={mode}
                        supplierId={selectedSupplier}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        hasPrevious={selectedIndex > 0}
                        hasNext={selectedIndex < currentData.length - 1}
                    />
                )}
            </div>
        </div>
    );
};

export default AnalisisProveedoresPage;