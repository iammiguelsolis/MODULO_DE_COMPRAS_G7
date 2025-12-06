import { useState, useEffect, useMemo } from 'react';
import ComprasListTemplate from '../components/templates/ComprasListTemplate';
import { AdquisicionesApi } from '../../../services/solicitudYadquisicion/api';
import type { ProcesoResumen } from '../../../services/solicitudYadquisicion/types';

const ComprasListPage = () => {
  const [compras, setCompras] = useState<ProcesoResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        setLoading(true);
        const data = await AdquisicionesApi.listar();
        // Filter only COMPRA type
        setCompras(data.filter(c => c.tipo_proceso === 'COMPRA'));
      } catch (err) {
        console.error('Error fetching compras:', err);
        setError('Error al cargar las compras');
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, []);

  // Filtrado
  const filteredCompras = useMemo(() => {
    let filtered = compras;

    if (searchQuery) {
      filtered = filtered.filter(compra =>
        compra.id.toString().includes(searchQuery) ||
        compra.solicitud_id.toString().includes(searchQuery)
      );
    }
    if (status) {
      filtered = filtered.filter(compra => compra.estado === status);
    }
    if (startDate) {
      filtered = filtered.filter(compra => new Date(compra.fecha_creacion) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(compra => new Date(compra.fecha_creacion) <= new Date(endDate));
    }

    return filtered;
  }, [compras, searchQuery, status, startDate, endDate]);

  // Paginación
  const paginatedCompras = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCompras.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCompras, currentPage]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  if (loading) return <div className="p-8 text-center">Cargando compras...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <ComprasListTemplate
      compras={paginatedCompras}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      status={status}
      onStatusChange={setStatus}
      startDate={startDate}
      onStartDateChange={setStartDate}
      endDate={endDate}
      onEndDateChange={setEndDate}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
      currentPage={currentPage}
      totalItems={filteredCompras.length}
      itemsPerPage={ITEMS_PER_PAGE}
      onPageChange={setCurrentPage}
    />
  );
};

export default ComprasListPage;
