import apiClient from "./axios-config";
import type { ProveedorDTO } from "../types";

// Interfaz que mapea la respuesta del backend
export interface ProveedorBackendDTO {
  id_proveedor: number;
  razon_social: string;
  ruc: string;
  email: string;
  telefono: string;
  esta_suspendido: boolean;
}

// Función para convertir al formato esperado por el frontend
const adaptToProveedorDTO = (prov: ProveedorBackendDTO): ProveedorDTO => ({
  id: prov.id_proveedor,
  razon_social: prov.razon_social,
  ruc: prov.ruc,
  email: prov.email,
});

export const proveedoresService = {
  listar: async (): Promise<ProveedorDTO[]> => {
    const response = await apiClient.get("/api/proveedores");
    return response.data.map(adaptToProveedorDTO);
  },

  obtenerPorId: async (id: number): Promise<ProveedorDTO> => {
    const response = await apiClient.get(`/api/proveedores/${id}`);
    return adaptToProveedorDTO(response.data);
  },
};
