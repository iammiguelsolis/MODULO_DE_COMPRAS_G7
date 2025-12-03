import type { CuadroComparativoResponse, AdjudicacionPayload } from './types';

// const API_BASE_URL = '/api/v1/comparacion';

export const comparacionService = {
    getComparaciones: async (): Promise<CuadroComparativoResponse[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        rfqId: "RFQ-001",
                        tituloSolicitud: "Compra de Laptops Corporativas",
                        fechaCreacion: "2023-10-25",
                        codigo: "REQ-2023-001",
                        descripcion: "Adquisición de 15 equipos de cómputo para el área de desarrollo y diseño.",
                        montoTotalEstimado: 26000.00,
                        tipoProceso: "Comparacion",
                        analisisGap: {
                            esOfertaTemeraria: true,
                            nivelRiesgo: 'ALTO',
                            detalles: "Diferencia significativa de precios."
                        },
                        detallePorProveedor: [] 
                    },
                    {
                        rfqId: "RFQ-002",
                        tituloSolicitud: "Servicios de Mantenimiento AC",
                        fechaCreacion: "2023-11-02",
                        codigo: "REQ-2023-045",
                        descripcion: "Mantenimiento preventivo trimestral de aires acondicionados sede central.",
                        montoTotalEstimado: 4500.00,
                        tipoProceso: "Simple",
                        analisisGap: { esOfertaTemeraria: false, nivelRiesgo: 'BAJO', detalles: "" },
                        detallePorProveedor: []
                    },
                    {
                        rfqId: "RFQ-003",
                        tituloSolicitud: "Suministro de EPPs Industriales",
                        fechaCreacion: "2023-11-15",
                        codigo: "REQ-2023-088",
                        descripcion: "Cascos, botas de seguridad y chalecos reflectantes para planta nueva.",
                        montoTotalEstimado: 12500.00,
                        tipoProceso: "Licitación",
                        analisisGap: { esOfertaTemeraria: false, nivelRiesgo: 'MEDIO', detalles: "Pocos proveedores ofertaron." },
                        detallePorProveedor: []
                    },
                    {
                        rfqId: "RFQ-004",
                        tituloSolicitud: "Licencias Software ERP",
                        fechaCreacion: "2023-12-01",
                        codigo: "REQ-2023-102",
                        descripcion: "Renovación anual de licencias para el sistema de gestión.",
                        montoTotalEstimado: 85000.00,
                        tipoProceso: "Licitación",
                        analisisGap: { esOfertaTemeraria: false, nivelRiesgo: 'BAJO', detalles: "" },
                        detallePorProveedor: []
                    },
                    {
                        rfqId: "RFQ-005",
                        tituloSolicitud: "Servicio de Catering Evento Anual",
                        fechaCreacion: "2023-12-10",
                        codigo: "REQ-2023-115",
                        descripcion: "Almuerzo y coffee break para clausura de año fiscal.",
                        montoTotalEstimado: 3200.00,
                        tipoProceso: "Simple",
                        analisisGap: { esOfertaTemeraria: true, nivelRiesgo: 'ALTO', detalles: "Precios por encima del mercado." },
                        detallePorProveedor: []
                    }
                ]);
            }, 600);
        });
    },

    getCuadroComparativo: async (rfqId: string): Promise<CuadroComparativoResponse> => {
        // Simular retardo de red
        return new Promise((resolve) => {
            setTimeout(() => {
                // Datos base comunes
                const baseData = {
                    rfqId,
                    tituloSolicitud: `Detalle para solicitud ${rfqId}`,
                    fechaCreacion: "01/01/2025",
                    codigo: "REQ-GEN-001",
                    descripcion: "Descripción detallada de la solicitud de compra para evaluación comparativa de proveedores.",
                    montoTotalEstimado: 25000.00,
                    tipoProceso: "Comparacion",
                    analisisGap: {
                        esOfertaTemeraria: false,
                        nivelRiesgo: 'BAJO' as const,
                        detalles: ""
                    },
                    detallePorProveedor: [
                        {
                            proveedorId: "P-001",
                            nombreProveedor: "Tech Solutions SAC",
                            estado: "ACTIVO" as const,
                            fechaOferta: "01/01/2025",
                            totalOferta: 24500.00,
                            moneda: "USD",
                            puntajeTecnico: 95, 
                            costosOcultos: [],
                            items: [
                                { itemId: "ITM-1", descripcion: "Laptop Pro 16GB", cantidad: 10, precioUnitario: 2450, precioTotal: 24500, moneda: "USD", isBestPrice: false }
                            ]
                        },
                        {
                            proveedorId: "P-002",
                            nombreProveedor: "CompuWorld Peru",
                            estado: "PENDIENTE" as const,
                            fechaOferta: "02/01/2025",
                            totalOferta: 23000.00,
                            moneda: "USD",
                            puntajeTecnico: 88, 
                            costosOcultos: [{ descripcion: "Envío", monto: 150, moneda: "USD" }],
                            items: [
                                { itemId: "ITM-1", descripcion: "Laptop Pro 16GB", cantidad: 10, precioUnitario: 2300, precioTotal: 23000, moneda: "USD", isBestPrice: true }
                            ]
                        },
                        {
                            proveedorId: "P-003",
                            nombreProveedor: "Inversiones Tecnológicas",
                            estado: "INACTIVO" as const,
                            fechaOferta: "01/01/2025",
                            totalOferta: 28000.00,
                            moneda: "USD",
                            puntajeTecnico: 65, 
                            costosOcultos: [],
                            items: [
                                { itemId: "ITM-1", descripcion: "Laptop Pro 16GB", cantidad: 10, precioUnitario: 2800, precioTotal: 28000, moneda: "USD", isBestPrice: false }
                            ]
                        }
                    ]
                };

                // Personalizar levemente según el ID para dar sensación de datos reales
                if (rfqId === 'RFQ-002') {
                    baseData.tituloSolicitud = "Servicios de Mantenimiento AC";
                    baseData.montoTotalEstimado = 4500.00;
                    baseData.tipoProceso = "Simple";
                } else if (rfqId === 'RFQ-003') {
                    baseData.tituloSolicitud = "Suministro de EPPs Industriales";
                    baseData.montoTotalEstimado = 12500.00;
                }

                resolve(baseData);
            }, 500);
        });
    },

    adjudicarProveedor: async (payload: AdjudicacionPayload): Promise<void> => {
        console.log("Enviando adjudicación:", payload);
        return new Promise((resolve) => setTimeout(resolve, 1000));
    }
};