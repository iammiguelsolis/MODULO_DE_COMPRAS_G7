import { useEffect, useState } from "react";
import DeliveryStatusBadge from "../atoms/DeliveryStatusBadge";

interface DeliveryDetail {
    idOC: number;
    item: string;
    recibidosAcordadosParcial: string;
    recibidosAcordadosFinal: string;
    entregaParcialEnPlazo: boolean;
    entregaFinalEnPlazo: boolean;
}

interface DeliveryDetailTableProps {
    supplierId: number;
}

// Datos de ejemplo
const sampleDeliveryDetails: { [key: number]: DeliveryDetail[] } = {
    1: [
        { idOC: 20, item: "Switch", recibidosAcordadosParcial: "39/100", recibidosAcordadosFinal: "200/200", entregaParcialEnPlazo: true, entregaFinalEnPlazo: false },
        { idOC: 114, item: "Cisco Router", recibidosAcordadosParcial: "10/10", recibidosAcordadosFinal: "30/30", entregaParcialEnPlazo: true, entregaFinalEnPlazo: true }
    ],
    2: [
        { idOC: 25, item: "Cable UTP", recibidosAcordadosParcial: "50/50", recibidosAcordadosFinal: "100/100", entregaParcialEnPlazo: true, entregaFinalEnPlazo: true },
        { idOC: 30, item: "Patch Panel", recibidosAcordadosParcial: "20/25", recibidosAcordadosFinal: "50/50", entregaParcialEnPlazo: false, entregaFinalEnPlazo: true }
    ],
    3: [
        { idOC: 45, item: "Monitor LED", recibidosAcordadosParcial: "10/20", recibidosAcordadosFinal: "40/40", entregaParcialEnPlazo: false, entregaFinalEnPlazo: false }
    ],
    4: [
        { idOC: 50, item: "Laptop HP", recibidosAcordadosParcial: "15/15", recibidosAcordadosFinal: "30/30", entregaParcialEnPlazo: true, entregaFinalEnPlazo: true }
    ]
};

const DeliveryDetailTable: React.FC<DeliveryDetailTableProps> = ({ supplierId }) => {
    const [details, setDetails] = useState<DeliveryDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeliveryDetails();
    }, [supplierId]);

    const fetchDeliveryDetails = async () => {
        setLoading(true);
        try {
            // TODO: Reemplazar con llamada API real usando axios
            // const response = await axios.get(`/api/analisis-proveedores/${supplierId}/entregas`);
            // setDetails(response.data);

            // Simulación con datos de ejemplo
            setTimeout(() => {
                setDetails(sampleDeliveryDetails[supplierId] || []);
                setLoading(false);
            }, 300);
        } catch (error) {
            console.error("Error al cargar detalles de entregas:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Cargando detalles...</div>;
    }

    return (
        <div className="overflow-x-auto border border-gray-300 rounded-2xl mb-6">
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm">
                        <th className="px-6 py-4 text-left font-semibold">Id OC</th>
                        <th className="px-6 py-4 text-left font-semibold">Item</th>
                        <th className="px-6 py-4 text-left font-semibold"># recibidos/acordados (Entrega parcial)</th>
                        <th className="px-6 py-4 text-left font-semibold"># recibidos/acordados (Entrega Final)</th>
                        <th className="px-6 py-4 text-left font-semibold">Entrega parcial en plazo</th>
                        <th className="px-6 py-4 text-left font-semibold">Entrega final en plazo</th>
                    </tr>
                </thead>
                <tbody>
                    {details.map((detail, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-700">{detail.idOC}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{detail.item}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{detail.recibidosAcordadosParcial}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{detail.recibidosAcordadosFinal}</td>
                            <td className="px-6 py-4">
                                <DeliveryStatusBadge
                                    isOnTime={detail.entregaParcialEnPlazo}
                                    isPartial={true}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <DeliveryStatusBadge
                                    isOnTime={detail.entregaFinalEnPlazo}
                                    isPartial={false}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeliveryDetailTable;