import { useState } from 'react';
import { useLicitaciones } from '../lib/hooks/useLicitaciones';
import LicitacionesListTemplate from '../components/templates/LicitacionesListTemplate';
import PendingRequestsModal from '../components/organisms/PendingRequestsModal';

const LicitacionesListPage = () => {
    const {
        licitaciones,
        totalItems,
        loading,
        error,
        filtros,
        setFiltros,
    } = useLicitaciones();

    // Estados locales para inputs de filtros (para no disparar request en cada tecla)
    const [searchQuery, setSearchQuery] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Estado para modal de pendientes (aunque el usuario dijo que no nos enfoquemos en esto, el componente lo requiere)
    const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

    const handleApplyFilters = () => {
        setFiltros({
            ...filtros,
            titulo: searchQuery,
            estado: status,
            fechaDesde: startDate,
            fechaHasta: endDate,
            page: 1, // Reset a página 1 al filtrar
        });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setStatus('');
        setStartDate('');
        setEndDate('');
        setFiltros({
            page: 1,
            per_page: 10,
            estado: '',
            titulo: '',
            fechaDesde: '',
            fechaHasta: '',
        });
    };

    const handlePageChange = (newPage: number) => {
        setFiltros({ ...filtros, page: newPage });
    };

    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <>
            <LicitacionesListTemplate
                licitaciones={licitaciones}
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
                currentPage={filtros.page}
                totalItems={totalItems}
                itemsPerPage={filtros.per_page}
                onPageChange={handlePageChange}
                onOpenPendingRequests={() => setIsPendingModalOpen(true)}
            />

            {/* Modal placeholder para mantener estructura */}
            <PendingRequestsModal
                isOpen={isPendingModalOpen}
                onClose={() => setIsPendingModalOpen(false)}
                solicitudes={[]}
                onApprove={() => { }}
                onReject={() => { }}
            />
        </>
    );
};

export default LicitacionesListPage;
