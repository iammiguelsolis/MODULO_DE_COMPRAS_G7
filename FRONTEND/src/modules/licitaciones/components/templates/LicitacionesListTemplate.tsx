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
}: LicitacionesListTemplateProps) => {
    return (
        <>
            <PageHeader
                title="Gestión de Licitaciones"
                description="Consulte el estado y avance de todos los procesos de licitación."
            />
            <div className="main-page-content">
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
        </>
    );
};

export default LicitacionesListTemplate;
