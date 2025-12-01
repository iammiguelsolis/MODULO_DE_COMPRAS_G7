import LicitacionesTable from '../organisms/LicitacionesTable';
import FilterPanel from '../organisms/FilterPanel';
import Pagination from '../molecules/Pagination';
import PageHeader from '../molecules/PageHeader';
import type { Licitacion } from '../../lib/types';

interface LicitacionesListTemplateProps {
    licitaciones: Licitacion[];
    searchQuery: string;
    onSearchQueryChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    startDate: string;
    onStartDateChange: (value: string) => void;
    endDate: string;
    onEndDateChange: (value: string) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onOpenPendingRequests: () => void;
}

const LicitacionesListTemplate = ({
    licitaciones,
    searchQuery,
    onSearchQueryChange,
    status,
    onStatusChange,
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
    onApplyFilters,
    onClearFilters,
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onOpenPendingRequests,
}: LicitacionesListTemplateProps) => {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto">
                <PageHeader
                    title="Gestión de Licitaciones"
                    description="Consulte el estado y avance de todos los procesos de licitación."
                    className="mb-8"
                    action={
                        <div className="flex gap-2">
                            <button
                                className="btn btn-primary btn-sm flex items-center gap-2"
                                onClick={onOpenPendingRequests}
                            >
                                <span>Solicitudes pendientes</span>
                            </button>
                        </div>
                    }
                />
                <div className="flex flex-col gap-6">
                    <FilterPanel
                        searchQuery={searchQuery}
                        onSearchQueryChange={onSearchQueryChange}
                        status={status}
                        onStatusChange={onStatusChange}
                        startDate={startDate}
                        onStartDateChange={onStartDateChange}
                        endDate={endDate}
                        onEndDateChange={onEndDateChange}
                        onApplyFilters={onApplyFilters}
                        onClearFilters={onClearFilters}
                    />
                    <LicitacionesTable licitaciones={licitaciones} />
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default LicitacionesListTemplate;
