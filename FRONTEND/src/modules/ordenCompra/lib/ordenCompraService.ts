import type { OrdenCompraRequest } from './types';

const API_URL = 'http://localhost:5000/api/ordenes-compra';

export const ordenCompraService = {
    getOrdenes: async (filters?: { estado?: string; tipo_origen?: string }) => {
        const params = new URLSearchParams();
        if (filters?.estado) params.append('estado', filters.estado);
        if (filters?.tipo_origen) params.append('tipo_origen', filters.tipo_origen);

        const res = await fetch(`${API_URL}/?${params.toString()}`);
        if (!res.ok) throw new Error('Error al cargar órdenes');
        return res.json();
    },

    getOrden: async (id: number) => {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Error al cargar la orden');
        return res.json();
    },

    createOrden: async (data: OrdenCompraRequest) => {
        const res = await fetch(`${API_URL}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Error al crear la orden');
        }
        return res.json();
    },

    closeOrden: async (id: number) => {
        const res = await fetch(`${API_URL}/${id}/cerrar`, {
            method: 'PUT',
        });
        if (!res.ok) throw new Error('Error al cerrar la orden');
        return res.json();
    }
};
