import { useState, useEffect } from "react";
import { licitacionesService } from "../api/licitaciones.service";
import type { Licitacion, LicitacionListItemDTO } from "../types";

const adaptLicitacionFromListDTO = (
  dto: LicitacionListItemDTO
): Licitacion => ({
  id: String(dto.id_licitacion),
  nombre: dto.titulo,
  fechaCreacion: dto.fecha_creacion || "",
  presupuestoMaximo: dto.presupuesto_max,
  estado: dto.estado,
});

interface PaginatedResponse {
  items: LicitacionListItemDTO[];
  total: number;
  page: number;
  per_page: number;
}

export const useLicitaciones = (initialFilters = {}) => {
  const [licitaciones, setLicitaciones] = useState<Licitacion[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({
    page: 1,
    per_page: 10,
    estado: "",
    titulo: "",
    fechaDesde: "",
    fechaHasta: "",
    ...initialFilters,
  });

  const fetchLicitaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v !== "")
      );

      const response: PaginatedResponse = await licitacionesService.listar(
        params
      );

      const adaptedData = response.items.map(adaptLicitacionFromListDTO);
      setLicitaciones(adaptedData);
      setTotalItems(response.total);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al cargar licitaciones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicitaciones();
  }, [
    filtros.page,
    filtros.per_page,
    filtros.estado,
    filtros.titulo,
    filtros.fechaDesde,
    filtros.fechaHasta,
  ]);

  return {
    licitaciones,
    totalItems,
    loading,
    error,
    filtros,
    setFiltros,
    refetch: fetchLicitaciones,
  };
};
