import PageHeader from '../../../../modules/licitaciones/components/molecules/PageHeader';
import FilterPanel from '../../../../modules/licitaciones/components/organisms/FilterPanel';
import Pagination from '../../../../modules/licitaciones/components/molecules/Pagination';
import type { ProcesoResumen } from '../../../../services/solicitudYadquisicion/types';
import { useNavigate } from 'react-router-dom';

interface ComprasListTemplateProps {
  compras: ProcesoResumen[];
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

const ComprasListTemplate = ({
  compras,
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
}: ComprasListTemplateProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        <PageHeader
          title="Gestión de Compras"
          description="Consulte el estado y avance de todos los procesos de compra."
          className="mb-6"
        />
        <div className="flex flex-col gap-4">
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

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">ID Proceso</th>
                    <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Solicitud ID</th>
                    <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Fecha Creación</th>
                    <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {compras.length > 0 ? (
                    compras.map((compra) => (
                      <tr key={compra.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {compra.id}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          #{compra.solicitud_id}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${
                            compra.tipo_proceso === 'COMPRA'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {compra.tipo_proceso}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${
                            compra.estado === 'NUEVO' ? 'bg-blue-50 text-blue-600' :
                            compra.estado === 'INVITANDO_PROVEEDORES' ? 'bg-blue-50 text-blue-600' :
                            compra.estado === 'EVALUANDO_OFERTAS' ? 'bg-blue-50 text-blue-600' :
                            compra.estado === 'CERRADO' ? 'bg-green-50 text-green-600' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {compra.estado.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {new Date(compra.fecha_creacion).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => navigate(`/compras/${compra.id}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver detalles
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No se encontraron procesos de compra
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

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

export default ComprasListTemplate;