import axios from 'axios';
import type {
    ProveedorAnalisisAPI,
    LaborConditionsAnalysis
} from './types';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- GERENTE ARTIFICIAL ---
const gerenteFake: ProveedorAnalisisAPI = {
    id_proveedor: 9999,
    razon_social: "Gerente Corporativo de Compras",
    numero_trabajadores: 1,
    indice_denuncias: 0,
    tiene_procesos_de_mejora_de_condiciones_laborales: true,
    ha_tomado_represalias_contra_sindicato: "No",
    esta_suspendido: false,
    ruc: '',
    pais: '',
    email: '',
    telefono: '',
    domicilio_legal: '',
    fecha_registro: '',
    confiabilidad_en_entregas: null,
    confiabilidad_en_condiciones_pago: null,
    tiene_sindicato: false,
    denuncias_incumplimiento_contrato: null
};

// --- INTERCEPTOR QUE INYECTA EL GERENTE SOLO EN LISTADOS ---
apiClient.interceptors.response.use(
    (response) => {

        // Solo agregamos el gerente en el endpoint del listado
        if (response.config.url?.includes("/api/proveedores/") &&
            response.config.method === "get" &&
            Array.isArray(response.data)) {

            // Evitar duplicado si se llama múltiples veces
            const yaExiste = response.data.some(p => p.id_proveedor === gerenteFake.id_proveedor);
            if (!yaExiste) {
                response.data.push(gerenteFake);
            }
        }

        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Función helper para mapear de snake_case a camelCase
const mapProveedorAPIToAnalysis = (proveedor: ProveedorAnalisisAPI): LaborConditionsAnalysis => {
    const haTomaRepresalias = proveedor.ha_tomado_represalias_contra_sindicato === 'Sí' ||
        proveedor.ha_tomado_represalias_contra_sindicato === 'SI' ||
        proveedor.ha_tomado_represalias_contra_sindicato === 'Si';

    return {
        id: proveedor.id_proveedor,
        proveedor: proveedor.razon_social,
        numeroTrabajadores: proveedor.numero_trabajadores || 0,
        indiceDenuncias: proveedor.indice_denuncias || 0,
        tieneProcesos: proveedor.tiene_procesos_de_mejora_de_condiciones_laborales,
        haTomaRepresalias: haTomaRepresalias
    };
};

export const AnalisisApi = {
    listarCondicionesLaborales: async (): Promise<LaborConditionsAnalysis[]> => {
        const response = await apiClient.get<ProveedorAnalisisAPI[]>('/api/proveedores/');

        const proveedoresActivos = response.data.filter(p => !p.esta_suspendido);

        const conDatosLaborales = proveedoresActivos.filter(p =>
            p.numero_trabajadores !== null &&
            p.indice_denuncias !== null
        );

        return conDatosLaborales.map(mapProveedorAPIToAnalysis);
    },

    obtenerAnalisisProveedor: async (id: number): Promise<LaborConditionsAnalysis> => {
        const response = await apiClient.get<ProveedorAnalisisAPI>(`/api/proveedores/${id}`);
        return mapProveedorAPIToAnalysis(response.data);
    }
};

export default apiClient;
