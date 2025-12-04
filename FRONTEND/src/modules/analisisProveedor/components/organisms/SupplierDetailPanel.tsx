import type { AnalysisMode } from "../../page/AnalisisProveedoresPage";
import DeliveryDetailTable from "../molecules/DeliveryDetailTable";
import InvoiceDetailTable from "../molecules/InvoiceDetailTable";
import NavigationButtons from "../molecules/NavigationButtons";
import DeliveryLegend from "../molecules/DeliveryLegend";

interface SupplierDetailPanelProps {
    mode: AnalysisMode;
    supplierId: number;
    onPrevious: () => void;
    onNext: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
}

const SupplierDetailPanel: React.FC<SupplierDetailPanelProps> = ({
    mode,
    supplierId,
    onPrevious,
    onNext,
    hasPrevious,
    hasNext
}) => {
    return (
        <div className="bg-white border border-gray-300 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detalles del proveedor</h2>

            {/* Tabla de detalle según el modo */}
            {mode === "plazos" ? (
                <DeliveryDetailTable supplierId={supplierId} />
            ) : (
                <InvoiceDetailTable supplierId={supplierId} />
            )}

            {/* Botones de navegación */}
            <NavigationButtons
                onPrevious={onPrevious}
                onNext={onNext}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
            />

            {/* Leyenda solo para modo plazos */}
            {mode === "plazos" && <DeliveryLegend />}
        </div>
    );
};

export default SupplierDetailPanel;