import { useState, useEffect } from "react";
import { licitacionesService } from "../api/licitaciones.service";
import type { Licitacion, LicitacionResponseDTO } from "../types";

// Función para convertir el DTO del backend al formato del frontend
const adaptLicitacionFromDTO = (dto: LicitacionResponseDTO): Licitacion => ({
  id: String(dto.id_licitacion),
  nombre: dto.titulo,
  fechaCreacion: new Date().toISOString().split("T")[0], // Fecha de hoy mockeada
  presupuestoMaximo: dto.presupuesto_max,
  estado: dto.estado,
});

export const useLicitaciones = (initialFilters = {}) => {
  const [licitaciones, setLicitaciones] = useState<Licitacion[]>([]);
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
      // Limpiar filtros vacíos
      const params = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v !== "")
      );

      const data: LicitacionResponseDTO[] = await licitacionesService.listar(
        params
      );
      // Adaptar los datos del backend al formato del frontend
      const adaptedData = data.map(adaptLicitacionFromDTO);
      setLicitaciones(adaptedData);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al cargar licitaciones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicitaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    loading,
    error,
    filtros,
    setFiltros,
    refetch: fetchLicitaciones,
  };
};
