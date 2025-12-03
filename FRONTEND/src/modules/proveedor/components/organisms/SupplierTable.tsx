import Button from "../atoms/Button";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SupplierDetailModal from "../organisms/SupplierDetailModal";

interface Supplier {
    id: number;
    razonSocial: string;
    ruc: string;
    rubro: string;
    pais: string;
    clasificacion: number;
    estado: string;
}

interface SupplierTableProps {
    suppliers: Supplier[];
}

export default function SupplierTable({ suppliers }: SupplierTableProps) {
    const navigate = useNavigate();
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);

    const renderStars = (value: number) => {
        const stars = [];
        const rounded = Math.floor(value);
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={16}
                    className={i < rounded ? "text-blue-500 inline" : "text-gray-300 inline"}
                />
            );
        }
        return <div className="flex gap-1">{stars}</div>;
    };

    return (
        <div className="overflow-x-auto border border-gray-300 rounded-2xl">
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-blue-500 text-white uppercase text-sm">
                        <th className="px-6 py-4">Proveedor</th>
                        <th className="px-6 py-4">RUC</th>
                        <th className="px-6 py-4">Rubro</th>
                        <th className="px-6 py-4">País</th>
                        <th className="px-6 py-4">Clasificación</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {suppliers.map((s) => (
                        <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.razonSocial}</td>
                            <td className="px-6 py-4 text-sm">{s.ruc}</td>
                            <td className="px-6 py-4 text-sm">{s.rubro}</td>
                            <td className="px-6 py-4 text-sm">{s.pais}</td>
                            <td className="px-6 py-4">{renderStars(s.clasificacion)}</td>
                            <td className="px-6 py-4 text-sm">{s.estado}</td>

                            <td className="px-6 py-4 flex gap-1">
                                <Button
                                    variant="primary"
                                    onClick={() => setSelectedSupplierId(s.id)}
                                >
                                    Ver
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedSupplierId && (
                <SupplierDetailModal
                    supplierId={selectedSupplierId}
                    onClose={() => setSelectedSupplierId(null)}
                    onDeactivate={(id) => {
                        console.log("Proveedor desactivado:", id);
                        // Aquí recargas la lista de proveedores
                    }}
                />
            )}
        </div>
    );
}
