
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto">
        <PageHeader
          title="Gestión de Compras"
          description="Consulte el estado y avance de todos los procesos de compra."
          className="mb-8"
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">ID Proceso</th>
                    <th className="px-6 py-3 font-medium">Solicitud ID</th>
                    <th className="px-6 py-3 font-medium">Tipo</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium">Fecha Creación</th>
                    <th className="px-6 py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {compras.length > 0 ? (
                    compras.map((compra) => (
                      <tr key={compra.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          #{compra.id}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          #{compra.solicitud_id}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${compra.tipo_proceso === 'COMPRA'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                            }`}>
                            {compra.tipo_proceso}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${compra.estado === 'NUEVO' ? 'bg-gray-100 text-gray-800' :
                              compra.estado === 'INVITANDO_PROVEEDORES' ? 'bg-yellow-100 text-yellow-800' :
                                compra.estado === 'EVALUANDO_OFERTAS' ? 'bg-orange-100 text-orange-800' :
                                  compra.estado === 'CERRADO' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                            }`}>
                            {compra.estado.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(compra.fecha_creacion).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/compras/${compra.id}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Ver detalle
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
