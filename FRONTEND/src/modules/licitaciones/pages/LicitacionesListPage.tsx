import { useState, useMemo } from 'react';

import LicitacionesListTemplate from '../components/templates/LicitacionesListTemplate';
import PendingRequestsModal from '../components/organisms/PendingRequestsModal';
import { allLicitaciones, mockSolicitudesPendientes } from '../lib/mock-data';
import type { Licitacion, SolicitudPendiente } from '../lib/types';

const LicitacionesListPage = () => {
    // TODO: Cuando integres con el backend, reemplaza 'allLicitaciones' con una llamada a tu servicio/API
    // Ejemplo: const { data: licitaciones, loading, error } = useFetchLicitaciones();
    const [licitaciones] = useState<Licitacion[]>(allLicitaciones);

    // Estado para solicitudes pendientes (mock)
    const [solicitudesPendientes, setSolicitudesPendientes] = useState<SolicitudPendiente[]>(mockSolicitudesPendientes);
    const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Filtrado de licitaciones
    const filteredLicitaciones = useMemo(() => {

        let filtered: Licitacion[] = licitaciones.filter(lic => lic.estado);

        if (searchQuery) {
            filtered = filtered.filter(lic =>
                lic.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

    const handleOpenPendingRequests = () => {
        setIsPendingModalOpen(true);
    };

    //simulacion pa remover de la lista de pendientes
    const handleApprovePending = (id: string) => {
        setSolicitudesPendientes(prev => prev.filter(s => s.id !== id));
    };

    const handleRejectPending = (id: string) => {
        setSolicitudesPendientes(prev => prev.filter(s => s.id !== id));
    };

    return (
        <>
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
                onOpenPendingRequests={handleOpenPendingRequests}
            />

            <PendingRequestsModal
                isOpen={isPendingModalOpen}
                onClose={() => setIsPendingModalOpen(false)}
                solicitudes={solicitudesPendientes}
                onApprove={handleApprovePending}
                onReject={handleRejectPending}
            />
        </>
    );
};

export default LicitacionesListPage;
