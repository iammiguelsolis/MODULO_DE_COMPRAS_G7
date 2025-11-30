import Button from "../atoms/Button";
import { Star } from "lucide-react";

interface Supplier {
    proveedor: string;
    ruc: string;
    rubro: string;
    pais: string;
    clasificacion: number;
    estado: string;
    homologacion: string;
}

interface SupplierTableProps {
    suppliers: Supplier[];
}

export default function SupplierTable({ suppliers }: SupplierTableProps) {
    const renderStars = (value: number) => {
        const stars = [];
        const rounded = Math.floor(value); // número entero 0–5
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
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Proveedor</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">RUC</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Rubro</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">País</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Clasificación</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Homologación</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((s, i) => (
                        <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-6 py-4text-sm font-medium text-gray-900">{s.proveedor}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{s.ruc}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{s.rubro}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{s.pais}</td>
                            <td className="px-4 py-3">{renderStars(s.clasificacion)}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{s.estado}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{s.homologacion}</td>
                            <td className="px-4 py-3 flex gap-2">
                                <Button variant="primary" onClick={() => alert(`Ver ${s.proveedor}`)}>Ver</Button>
                                <Button variant="secondary" onClick={() => alert(`Editar ${s.proveedor}`)}>Editar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
