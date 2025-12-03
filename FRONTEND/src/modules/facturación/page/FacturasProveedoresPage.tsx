import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import Button from '../components/atoms/Button';
import SearchBar from '../components/molecules/SearchBar';
import TabGroup from '../components/molecules/TabGroup';
import InvoiceTable from '../components/organisms/InvoiceTable';
import InvoiceFormModal from '../components/organisms/InvoiceFormModal';
import InvoiceDetailModal from '../components/organisms/InvoiceDetailModal';
import Spinner from '../components/atoms/Spinner';
import { listarFacturas, type FacturaProveedor } from '../services/api';

const FacturasProveedoresPage: React.FC = () => {
  // Estado principal
  const [facturas, setFacturas] = useState<FacturaProveedor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFacturaId, setSelectedFacturaId] = useState<string | null>(null);
  
  // Filtros
  const [activeTab, setActiveTab] = useState('BORRADOR');
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [monedaFilter, setMonedaFilter] = useState('Todas');
  const [rangoFechas, setRangoFechas] = useState('Últimos 30 días');

  // Cargar facturas al montar el componente
  useEffect(() => {
    loadFacturas();
  }, []);

  const loadFacturas = async () => {
    try {
      setLoading(true);
      const data = await listarFacturas();
      setFacturas(data);
    } catch (error) {
      console.error('Error cargando facturas:', error);
      alert('Error al cargar las facturas');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar facturas según los criterios
  const filteredFacturas = facturas.filter((factura) => {
    // IMPORTANTE: Filtrar EN_CONCILIACION del listado principal
    if (factura.estado === 'EN_CONCILIACION') return false;
    
    // Filtro por tab activo
    const matchesTab = activeTab === 'Todos' || factura.estado === activeTab;
    
    // Filtro por búsqueda
    const matchesSearch =
      searchTerm === '' ||
      factura.numero_factura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.proveedor_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (factura.orden_compra_id && factura.orden_compra_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtro por estado
    const matchesEstado = estadoFilter === 'Todos' || factura.estado === estadoFilter;
    
    // Filtro por moneda
    const matchesMoneda = monedaFilter === 'Todas' || factura.moneda === monedaFilter;

    return matchesTab && matchesSearch && matchesEstado && matchesMoneda;
  });

  // Handlers
  const handleFacturaClick = (factura: FacturaProveedor) => {
    setSelectedFacturaId(factura.id);
    setShowDetailModal(true);
  };

  const handleNewInvoice = () => {
    setShowFormModal(true);
  };

  const handleFormSuccess = (facturaId: string) => {
    setShowFormModal(false);
    loadFacturas();
    // Abrir automáticamente el detalle de la factura recién creada
    setSelectedFacturaId(facturaId);
    setShowDetailModal(true);
  };

  const handleDetailClose = () => {
    setShowDetailModal(false);
    setSelectedFacturaId(null);
  };

  const handleDetailRefresh = () => {
    loadFacturas();
  };

  // Tabs de estado
  const tabs = [
    { key: 'BORRADOR', label: 'Borrador' },
    { key: 'APROBADA', label: 'Aprobada' }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="p-8">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Facturas de Proveedores
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Sistema de registro, conciliación y aprobación de facturas
              </p>
            </div>
            <Button icon={FileText} onClick={handleNewInvoice}>
              Nueva Factura
            </Button>
          </div>

          {/* Search Bar & Filters */}
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

        {/* Tabs Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-300">
          <TabGroup
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Table Card */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center border border-gray-300">
            <Spinner size="lg" />
            <p className="text-sm text-gray-600 mt-4">Cargando facturas...</p>
          </div>
        ) : filteredFacturas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-300">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No se encontraron facturas
              </h3>
              <p className="text-sm text-gray-600">
                {searchTerm || estadoFilter !== 'Todos' || monedaFilter !== 'Todas'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza registrando tu primera factura'}
              </p>
              {!searchTerm && estadoFilter === 'Todos' && monedaFilter === 'Todas' && (
                <Button onClick={handleNewInvoice} icon={FileText}>
                  Registrar Primera Factura
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <InvoiceTable
              facturas={filteredFacturas}
              onFacturaClick={handleFacturaClick}
            />
            
            {/* Results count */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Mostrando {filteredFacturas.length} de {facturas.length} facturas
              </p>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showFormModal && (
        <InvoiceFormModal
          onClose={() => setShowFormModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {showDetailModal && selectedFacturaId && (
        <InvoiceDetailModal
          facturaId={selectedFacturaId}
          onClose={handleDetailClose}
          onRefresh={handleDetailRefresh}
        />
      )}
    </div>
  );
};

export default FacturasProveedoresPage;