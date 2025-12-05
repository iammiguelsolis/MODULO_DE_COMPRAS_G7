import axios from 'axios';
import type {
    ProveedorAPI,
    Proveedor,
    ProveedorDetalle,
    ProveedorInput,
    ContactoProveedor,
    ProveedorDetalleAPI,
    CuentaBancaria,
    EstadoProveedor
} from './types';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Función helper para mapear de snake_case a camelCase
const mapProveedorAPIToProveedor = (proveedor: ProveedorAPI): Proveedor => ({
    id: proveedor.id_proveedor,
    razonSocial: proveedor.razon_social,
    ruc: proveedor.ruc,
    pais: proveedor.pais,
    clasificacion: 0, // TODO: Agregar cuando esté disponible en backend
    estado: proveedor.esta_suspendido ? 'INACTIVO' : 'ACTIVO',
    email: proveedor.email,
    telefono: proveedor.telefono,
    direccion: proveedor.domicilio_legal
});

export const ProveedoresApi = {
    // Listar todos los proveedores
    listar: async () => {
        const response = await apiClient.get<ProveedorAPI[]>('/api/proveedores/');
        return response.data.map(mapProveedorAPIToProveedor);
    },

    // Obtener proveedor por ID
    obtener: async (id: number) => {
        const response = await apiClient.get<ProveedorAPI>(`/api/proveedores/${id}`);
        return mapProveedorAPIToProveedor(response.data);
    },

    // Obtener detalle del proveedor
    obtenerDetalle: async (id: number): Promise<ProveedorDetalle> => {
        const [detalleResp, contactosResp] = await Promise.all([
            apiClient.get<ProveedorDetalleAPI>(`/api/proveedores/${id}`),
            apiClient.get<ContactoProveedor[]>(`/api/proveedores/${id}/contactos`)
        ]);
        const data = detalleResp.data;
        const contactos = contactosResp.data;

        return {
            id: data.id_proveedor,
            razonSocial: data.razon_social,
            ruc: data.ruc,
            pais: data.pais,
            direccion: data.domicilio_legal,
            telefono: data.telefono,
            email: data.email,
            moneda: 'PEN',  // TODO: Backend no lo tiene aún
            estado: data.esta_suspendido ? 'INACTIVO' : 'ACTIVO',
            clasificacion: 0, // TODO: Backend no lo tiene aún

            contactos: contactos,
            cuentasBancarias: []  // TODO: Agregar cuando backend lo tenga
        };
    },

    // Crear proveedor
    crear: async (data: ProveedorInput) => {
        const payload = {
            razon_social: data.razonSocial,
            ruc: data.ruc,
            pais: data.pais,
            email: data.email,
            telefono: data.telefono,
            domicilio_legal: data.direccion,
            fecha_registro: new Date().toISOString().split('T')[0],
            esta_suspendido: false,
            confiabilidad_en_entregas: 'MEDIO',
            confiabilidad_en_condiciones_pago: 'MEDIO'
        };

        const response = await apiClient.post<{ id: number; message: string }>('/api/proveedores/crear', payload);
        return response.data;
    },

    // Actualizar proveedor
    actualizar: async (id: number, data: Partial<ProveedorInput>) => {
        const payload: any = {};
        if (data.razonSocial) payload.razon_social = data.razonSocial;
        if (data.ruc) payload.ruc = data.ruc;
        if (data.pais) payload.pais = data.pais;
        if (data.email) payload.email = data.email;
        if (data.telefono) payload.telefono = data.telefono;
        if (data.direccion) payload.domicilio_legal = data.direccion;

        const response = await apiClient.put(`/api/proveedores/${id}`, payload);
        return response.data;
    },

    // Cambiar estado (desactivar)
    cambiarEstado: async (id: number, estado: EstadoProveedor) => {
        // Como el backend usa esta_suspendido, invertimos la lógica
        const payload = {
            esta_suspendido: estado === 'INACTIVO'
        };

        const response = await apiClient.put(`/api/proveedores/${id}`, payload);
        return response.data;
    },

    // ==================== CONTACTOS ====================

    listarContactos: async (idProveedor: number) => {
        const response = await apiClient.get<ContactoProveedor[]>(`/api/proveedores/${idProveedor}/contactos`);
        return response.data;
    },

    crearContacto: async (idProveedor: number, data: Omit<ContactoProveedor, 'id'>) => {
        const response = await apiClient.post(`/api/proveedores/${idProveedor}/contacto`, data);
        return response.data;
    },


    // ==================== CUENTAS BANCARIAS (cuando estén) ====================
    // TODO: Agregar cuando el backend tenga estos endpoints

    // listarCuentas: async (idProveedor: number) => {
    //     const response = await apiClient.get<CuentaBancaria[]>(`/api/proveedores/${idProveedor}/cuentas`);
    //     return response.data;
    // },

    // crearCuenta: async (idProveedor: number, data: Omit<CuentaBancaria, 'id'>) => {
    //     const response = await apiClient.post(`/api/proveedores/${idProveedor}/cuentas`, data);
    //     return response.data;
    // },


};



export default apiClient;