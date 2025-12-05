import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import SearchBar from '../components/molecules/SearchBar';
import TabGroup from '../components/molecules/TabGroup';
import InvoiceTable from '../components/organisms/InvoiceTable';
import InvoiceDetailModal from '../components/organisms/InvoiceDetailModal';
import InvoiceFormModal from '../components/organisms/InvoiceFormModal';
import { type FacturaProveedor, listarFacturas } from '../services/api';

const FacturasProveedoresPage: React.FC = () => {
  const [facturas, setFacturas] = useState<FacturaProveedor[]>([]);
  const [filteredFacturas, setFilteredFacturas] = useState<FacturaProveedor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // SearchBar filters
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [monedaFilter, setMonedaFilter] = useState('Todas');
  const [rangoFechas, setRangoFechas] = useState('');
  
  // Tab state
  const [activeTab, setActiveTab] = useState('todas');
  
  // Modal states
  const [selectedFacturaId, setSelectedFacturaId] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    loadFacturas();
  }, []);

  useEffect(() => {
    filterFacturas();
  }, [facturas, searchTerm, estadoFilter, monedaFilter, activeTab]);

  const loadFacturas = async () => {
    try {
      setLoading(true);
      const data = await listarFacturas();
      setFacturas(data);
    } catch (error) {
      console.error('Error cargando facturas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFacturas = () => {
    let filtered = facturas;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (f) =>
          f.numero_factura.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.proveedor_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.proveedor_ruc.includes(searchTerm)
      );
    }

    // Filtrar por estado (desde SearchBar)
    if (estadoFilter !== 'Todos') {
      filtered = filtered.filter((f) => f.estado === estadoFilter);
    }

    // Filtrar por moneda
    if (monedaFilter !== 'Todas') {
      filtered = filtered.filter((f) => f.moneda === monedaFilter);
    }

    // Filtrar por estado (tab)
    if (activeTab !== 'todas') {
      filtered = filtered.filter((f) => f.estado === activeTab.toUpperCase());
    }

    setFilteredFacturas(filtered);
  };

  const handleFacturaClick = (factura: FacturaProveedor) => {
    setSelectedFacturaId(factura.id);
  };

  const handleCloseDetailModal = () => {
    setSelectedFacturaId(null);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  const handleRefresh = () => {
    loadFacturas();
  };

  const tabs = [
    { key: 'todas', label: 'Todas' },
    { key: 'borrador', label: 'Borradores' },
    { key: 'aprobada', label: 'Aprobadas' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-gray-600">Cargando facturas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Facturas de Proveedores</h1>
              <p className="text-gray-600 mt-1">
                Gestiona y concilia las facturas de tus proveedores
              </p>
            </div>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setIsFormModalOpen(true)}
            >
              Nueva Factura
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              estadoFilter={estadoFilter}
              onEstadoChange={setEstadoFilter}
              monedaFilter={monedaFilter}
              onMonedaChange={setMonedaFilter}
              rangoFechas={rangoFechas}
              onRangoChange={setRangoFechas}
            />
          </div>

          {/* Tabs */}
          <TabGroup
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Table */}
        {filteredFacturas.length > 0 ? (
          <InvoiceTable
            facturas={filteredFacturas}
            onFacturaClick={handleFacturaClick}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">
              {searchTerm || estadoFilter !== 'Todos' || monedaFilter !== 'Todas'
                ? 'No se encontraron facturas que coincidan con los filtros'
                : 'No hay facturas disponibles'}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedFacturaId && (
        <InvoiceDetailModal
          facturaId={selectedFacturaId}
          onClose={handleCloseDetailModal}
          onRefresh={handleRefresh}
        />
      )}

      {/* Form Modal */}
      {isFormModalOpen && (
        <InvoiceFormModal
          onClose={handleCloseFormModal}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
};

export default FacturasProveedoresPage;