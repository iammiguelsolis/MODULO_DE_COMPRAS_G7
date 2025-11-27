import { useState, useMemo } from 'react';

import LicitacionesListTemplate from '../components/templates/LicitacionesListTemplate';
import { allLicitaciones } from '../lib/mock-data';
import type { Licitacion } from '../lib/types';

const LicitacionesListPage = () => {
    // TODO: Cuando integres con el backend, reemplaza 'allLicitaciones' con una llamada a tu servicio/API
    // Ejemplo: const { data: licitaciones, loading, error } = useFetchLicitaciones();
    const [licitaciones] = useState<Licitacion[]>(allLicitaciones);

    const [searchQuery, setSearchQuery] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Filtrado de licitaciones
    // TODO: Cuando integres con el backend, estos filtros pueden enviarse como query params a la API
    const filteredLicitaciones = useMemo(() => {
        let filtered: Licitacion[] = [...licitaciones];

        if (searchQuery) {
            filtered = filtered.filter(lic =>
                lic.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lic.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (status) {
            filtered = filtered.filter(lic => lic.estado === status);
        }
        if (startDate) {
            filtered = filtered.filter(lic => new Date(lic.fechaCreacion) >= new Date(startDate));
        }
        if (endDate) {
            filtered = filtered.filter(lic => new Date(lic.fechaCreacion) <= new Date(endDate));
        }

        return filtered;
    }, [licitaciones, searchQuery, status, startDate, endDate]);

    // Paginación
    // TODO: Cuando integres con el backend, la paginación puede hacerse en el servidor
    const paginatedLicitaciones = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredLicitaciones.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredLicitaciones, currentPage]);

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

    return (
        <LicitacionesListTemplate
            licitaciones={paginatedLicitaciones}
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
            totalItems={filteredLicitaciones.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
        />
    );
};

export default LicitacionesListPage;
