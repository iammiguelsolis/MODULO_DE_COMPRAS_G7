// ==========================================
// EVALUACIÓN DE PROVEEDORES - TYPES
// ==========================================

export interface ProveedorAnalisisAPI {
    id_proveedor: number;
    razon_social: string;
    ruc: string;
    pais: string;
    email: string;
    telefono: string;
    domicilio_legal: string;
    fecha_registro: string;
    esta_suspendido: boolean;
    confiabilidad_en_entregas: string | null;
    confiabilidad_en_condiciones_pago: string | null;
    // Campos para evaluación laboral
    numero_trabajadores: number | null;
    tiene_sindicato: boolean;
    ha_tomado_represalias_contra_sindicato: string | null;
    denuncias_incumplimiento_contrato: number | null;
    indice_denuncias: number | null;
    tiene_procesos_de_mejora_de_condiciones_laborales: boolean;
}

// Para el frontend (adaptado)
export interface LaborConditionsAnalysis {
    id: number;
    proveedor: string;
    numeroTrabajadores: number;
    indiceDenuncias: number;
    tieneProcesos: boolean;
    haTomaRepresalias: boolean;
}