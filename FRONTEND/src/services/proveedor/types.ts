// ==========================================
// PROVEEDORES - TYPES
// ==========================================

export type EstadoProveedor = 'ACTIVO' | 'INACTIVO' | 'PENDIENTE';

export interface ProveedorAPI {
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
    numero_trabajadores: number | null;
    tiene_sindicato: boolean;
    ha_tomado_represalias_contra_sindicato: string | null;
    denuncias_incumplimiento_contrato: number | null;
    indice_denuncias: number | null;
    tiene_procesos_de_mejora_de_condiciones_laborales: boolean;
}

export interface Proveedor {
    id: number;
    razonSocial: string;
    ruc: string;
    pais: string;
    clasificacion: number;
    estado: EstadoProveedor;
    email: string;
    telefono: string;
    direccion: string;
}

export interface ContactoProveedor {
    id: number;
    nombre: string;
    cargo: string;
    email: string;
    telefono: string;
}

export interface CuentaBancaria {
    id: number;
    banco: string;
    moneda: string;
    numeroCuenta: string;
    cci: string;
    titular: string;
}

export interface ProveedorDetalle extends Proveedor {
    contactos: ContactoProveedor[];
    cuentasBancarias: CuentaBancaria[];
}

export interface ProveedorInput {
    razonSocial: string;
    ruc: string;
    pais: string;
    email: string;
    telefono: string;
    direccion: string;
    moneda?: string;
}

export interface ProveedorDetalleAPI {
    id_proveedor: number;
    razon_social: string;
    ruc: string;
    pais: string;
    email: string;
    telefono: string;
    domicilio_legal: string;
    fecha_registro: string;
    esta_suspendido: boolean;
    // ...?
}

export interface ContactoProveedorAPI {
    id_contacto_proveedor?: number;
    nombre: string;
    cargo: string;
    email: string;
    telefono: string;
}

export interface ProveedorDetalle {
    id: number;
    razonSocial: string;
    ruc: string;
    pais: string;
    direccion: string;
    telefono: string;
    email: string;
    moneda: string;  // TODO: ?
    estado: EstadoProveedor;
}

export interface ContactoInput {
    nombre: string;
    cargo: string;
    email: string;
    telefono: string;
}

export interface CuentaBancariaInput {
    banco: string;
    moneda: string;
    numeroCuenta: string;
    cci: string;
    titular: string;
}