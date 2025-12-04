export interface ItemOfertado {
    itemId: string;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    precioTotal: number;
    moneda: string;
    isBestPrice: boolean; // Indica si es el mejor precio para este item
}

export interface CostoOculto {
    descripcion: string;
    monto: number;
    moneda: string;
}

export interface OfertaProveedor {
    proveedorId: string;
    nombreProveedor: string;
    estado: 'ACTIVO' | 'INACTIVO' | 'PENDIENTE' | 'ADJUDICADO';
    fechaOferta: string;
    totalOferta: number;
    moneda: string;
    puntajeTecnico: number; // 0-100
    items: ItemOfertado[];
    costosOcultos: CostoOculto[];
}

export interface AnalisisGap {
    esOfertaTemeraria: boolean;
    nivelRiesgo: 'BAJO' | 'MEDIO' | 'ALTO';
    detalles: string;
}

export interface CuadroComparativoResponse {
    rfqId: string;
    tituloSolicitud: string;
    fechaCreacion: string;
    codigo: string;
    descripcion: string;
    montoTotalEstimado: number;
    tipoProceso: string;
    detallePorProveedor: OfertaProveedor[];
    analisisGap: AnalisisGap;
}

export interface AdjudicacionPayload {
    rfqId: string;
    proveedorId: string;
    justificacion?: string;
}
