import { useEffect, useState } from "react";

interface InvoiceDetail {
    idOC: number;
    numeroFactura: string;
    motivoObservacion: string;
    fechaObservacion: string;
    tiempoRectificar: number;
}

interface InvoiceDetailTableProps {
    supplierId: number;
}

// Datos de ejemplo
const sampleInvoiceDetails: { [key: number]: InvoiceDetail[] } = {
    1: [
        { idOC: 102, numeroFactura: "B104-1234", motivoObservacion: "Fecha de emisión incorrecta", fechaObservacion: "10/10/2025", tiempoRectificar: 15 }
    ],
    2: [
        { idOC: 105, numeroFactura: "F200-5678", motivoObservacion: "Monto de pago incorrecto", fechaObservacion: "12/10/2025", tiempoRectificar: 10 }
    ],
    3: [
        { idOC: 110, numeroFactura: "B300-9012", motivoObservacion: "Factura de recepción incompleta", fechaObservacion: "15/10/2025", tiempoRectificar: 20 },
        { idOC: 115, numeroFactura: "F400-3456", motivoObservacion: "Cantidad incorrecta", fechaObservacion: "18/10/2025", tiempoRectificar: 8 }
    ],
    4: [
        { idOC: 120, numeroFactura: "B500-7890", motivoObservacion: "Fecha de emisión incorrecta", fechaObservacion: "20/10/2025", tiempoRectificar: 5 }
    ]
};

const InvoiceDetailTable: React.FC<InvoiceDetailTableProps> = ({ supplierId }) => {
    const [details, setDetails] = useState<InvoiceDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoiceDetails();
    }, [supplierId]);

    const fetchInvoiceDetails = async () => {
        setLoading(true);
        try {
            // TODO: Reemplazar con llamada API real usando axios
            // const response = await axios.get(`/api/analisis-proveedores/${supplierId}/facturas`);
            // setDetails(response.data);

            // Simulación con datos de ejemplo
            setTimeout(() => {
                setDetails(sampleInvoiceDetails[supplierId] || []);
                setLoading(false);
            }, 300);
        } catch (error) {
            console.error("Error al cargar detalles de facturas:", error);
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
                        <th className="px-6 py-4 text-left font-semibold"># Factura</th>
                        <th className="px-6 py-4 text-left font-semibold">Motivo de observación</th>
                        <th className="px-6 py-4 text-left font-semibold">Fecha de observación</th>
                        <th className="px-6 py-4 text-left font-semibold">Tiempo en días en rectificar</th>
                    </tr>
                </thead>
                <tbody>
                    {details.map((detail, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-700">{detail.idOC}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{detail.numeroFactura}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{detail.motivoObservacion}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{detail.fechaObservacion}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{detail.tiempoRectificar} días</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceDetailTable;