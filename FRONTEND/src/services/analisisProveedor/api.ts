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

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Función helper para mapear de snake_case a camelCase
const mapProveedorAPIToAnalysis = (proveedor: ProveedorAnalisisAPI): LaborConditionsAnalysis => {
    // Determinar si ha tomado represalias (convertir string a boolean)
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
    // Listar todos los proveedores para análisis laboral
    listarCondicionesLaborales: async (): Promise<LaborConditionsAnalysis[]> => {
        const response = await apiClient.get<ProveedorAnalisisAPI[]>('/api/proveedores/');

        // Filtrar solo proveedores activos (no suspendidos)
        const proveedoresActivos = response.data.filter(p => !p.esta_suspendido);

        // Filtrar solo los que tienen datos de análisis laboral
        const conDatosLaborales = proveedoresActivos.filter(p =>
            p.numero_trabajadores !== null &&
            p.indice_denuncias !== null
        );

        return conDatosLaborales.map(mapProveedorAPIToAnalysis);
    },

    // Obtener análisis de un proveedor específico
    obtenerAnalisisProveedor: async (id: number): Promise<LaborConditionsAnalysis> => {
        const response = await apiClient.get<ProveedorAnalisisAPI>(`/api/proveedores/${id}`);
        return mapProveedorAPIToAnalysis(response.data);
    }
};

export default apiClient;