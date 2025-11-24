import { useState } from 'react';
import { Search, FileText, Eye, X, Check, Send, Download } from 'lucide-react';

// ============= ATOMS =============
const Input = ({ label, value, onChange, placeholder, required, type = "text" }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Select = ({ label, value, onChange, options, required }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const Button = ({ children, onClick, variant = "primary", icon: Icon, disabled }) => {
  const baseClass = "px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 justify-center";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "text-blue-600 hover:bg-blue-50"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    pendiente: "bg-yellow-100 text-yellow-800",
    conciliada: "bg-green-100 text-green-800",
    observada: "bg-orange-100 text-orange-800",
    aprobada: "bg-blue-100 text-blue-800"
  };
  
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const Tab = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium transition-colors ${
      active ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'
    }`}
  >
    {children}
  </button>
);

// ============= MOLECULES =============
const FileUploadArea = () => (
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
    <p className="text-gray-500">Arrastra aquí o haz clic para seleccionar</p>
  </div>
);

const SearchBar = ({ placeholder, value, onChange }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const InvoiceRow = ({ factura, onClick }) => (
  <tr className="border-b hover:bg-gray-50 cursor-pointer" onClick={onClick}>
    <td className="px-4 py-3 text-sm">{factura.numero}</td>
    <td className="px-4 py-3 text-sm">{factura.proveedor}</td>
    <td className="px-4 py-3 text-sm">{factura.fecha}</td>
    <td className="px-4 py-3 text-sm">{factura.moneda}</td>
    <td className="px-4 py-3 text-sm">{factura.monto.toFixed(2)}</td>
    <td className="px-4 py-3 text-sm">
      <Badge variant={factura.estado.toLowerCase()}>{factura.estado}</Badge>
    </td>
    <td className="px-4 py-3 text-sm">{factura.origen}</td>
    <td className="px-4 py-3 text-sm">
      <div className="flex gap-2">
        <Button variant="ghost" onClick={(e) => { e.stopPropagation(); }}>
          Ver
        </Button>
        <span className="text-gray-400">·</span>
        <Button variant="ghost" onClick={(e) => { e.stopPropagation(); }}>
          {factura.accion}
        </Button>
      </div>
    </td>
  </tr>
);

const DocumentRow = ({ doc }) => (
  <tr className="border-b">
    <td className="px-4 py-3 text-sm">{doc.archivo}</td>
    <td className="px-4 py-3 text-sm">{doc.tipo}</td>
    <td className="px-4 py-3 text-sm">{doc.tamano}</td>
    <td className="px-4 py-3 text-sm">
      <Button variant="ghost" icon={Eye}>Ver</Button>
    </td>
  </tr>
);

const ItemRow = ({ item }) => (
  <tr className="border-b">
    <td className="px-4 py-3 text-sm">{item.item}</td>
    <td className="px-4 py-3 text-sm">{item.descripcion}</td>
    <td className="px-4 py-3 text-sm">{item.cantidad}</td>
    <td className="px-4 py-3 text-sm">{item.precio.toFixed(2)}</td>
    <td className="px-4 py-3 text-sm">{item.descuento}%</td>
    <td className="px-4 py-3 text-sm">{item.igv}%</td>
    <td className="px-4 py-3 text-sm">{item.subtotal.toFixed(2)}</td>
    <td className="px-4 py-3 text-sm">
      <Badge variant="default">{item.estado}</Badge>
    </td>
  </tr>
);

// ============= ORGANISMS =============
const RegistrarFacturaForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    proveedor: '',
    ruc: '',
    moneda: 'PEN',
    oc: '',
    serie: 'F001',
    numero: '000123',
    fechaEmision: '2025-10-10',
    fechaVencimiento: '2025-11-09',
    subTotal: '',
    igv: '',
    total: ''
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Registrar Factura</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Select
              label="Proveedor"
              value={formData.proveedor}
              onChange={(e) => setFormData({...formData, proveedor: e.target.value})}
              options={[
                { value: '', label: 'Selecciona proveedor' },
                { value: 'tecnologias', label: 'Tecnologías Andinas' },
                { value: 'logico', label: 'Lógico SAC' }
              ]}
              required
            />
            <Input
              label="RUC"
              value={formData.ruc}
              onChange={(e) => setFormData({...formData, ruc: e.target.value})}
              placeholder="RUC"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Select
              label="Moneda"
              value={formData.moneda}
              onChange={(e) => setFormData({...formData, moneda: e.target.value})}
              options={[
                { value: 'PEN', label: 'PEN' },
                { value: 'USD', label: 'USD' }
              ]}
              required
            />
            <Input
              label="OC (opcional)"
              value={formData.oc}
              onChange={(e) => setFormData({...formData, oc: e.target.value})}
              placeholder="Buscar por #"
            />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <Input
              label="Serie"
              value={formData.serie}
              onChange={(e) => setFormData({...formData, serie: e.target.value})}
              required
            />
            <Input
              label="Número"
              value={formData.numero}
              onChange={(e) => setFormData({...formData, numero: e.target.value})}
              required
            />
            <Input
              label="Fecha Emisión"
              type="date"
              value={formData.fechaEmision}
              onChange={(e) => setFormData({...formData, fechaEmision: e.target.value})}
              required
            />
            <Input
              label="Fecha Vencimiento"
              type="date"
              value={formData.fechaVencimiento}
              onChange={(e) => setFormData({...formData, fechaVencimiento: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Input
              label="Sub Total"
              value={formData.subTotal}
              onChange={(e) => setFormData({...formData, subTotal: e.target.value})}
            />
            <Input
              label="IGV"
              value={formData.igv}
              onChange={(e) => setFormData({...formData, igv: e.target.value})}
            />
            <Input
              label="Total"
              value={formData.total}
              onChange={(e) => setFormData({...formData, total: e.target.value})}
            />
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-2">Adjuntar archivos (PDF/XML)</p>
            <FileUploadArea />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button onClick={onSave}>Guardar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListaFacturas = ({ facturas, onFacturaClick }) => {
  const [activeTab, setActiveTab] = useState('pendiente');
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [monedaFilter, setMonedaFilter] = useState('Todas');

  const filteredFacturas = facturas.filter(f => {
    const matchesTab = activeTab === 'todas' || f.estado.toLowerCase() === activeTab;
    const matchesSearch = f.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.proveedor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4 flex-1">
          <div className="w-64">
            <SearchBar
              placeholder="Número, proveedor, OC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            options={[
              { value: 'Todos', label: 'Todos' },
              { value: 'Pendiente', label: 'Pendiente' },
              { value: 'Conciliada', label: 'Conciliada' }
            ]}
          />
          <Select
            value={monedaFilter}
            onChange={(e) => setMonedaFilter(e.target.value)}
            options={[
              { value: 'Todas', label: 'Todas' },
              { value: 'PEN', label: 'PEN' },
              { value: 'USD', label: 'USD' }
            ]}
          />
          <Input type="text" placeholder="Últimos 30 días" />
        </div>
        <Button icon={FileText}>Nueva factura</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex gap-0 px-4">
            <Tab active={activeTab === 'pendiente'} onClick={() => setActiveTab('pendiente')}>
              Pendiente
            </Tab>
            <Tab active={activeTab === 'conciliada'} onClick={() => setActiveTab('conciliada')}>
              Conciliada
            </Tab>
            <Tab active={activeTab === 'observada'} onClick={() => setActiveTab('observada')}>
              Observada
            </Tab>
            <Tab active={activeTab === 'aprobada'} onClick={() => setActiveTab('aprobada')}>
              Aprobada
            </Tab>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Factura</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Proveedor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Moneda</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Monto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Origen</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacturas.map(factura => (
                <InvoiceRow key={factura.numero} factura={factura} onClick={() => onFacturaClick(factura)} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DetalleFactura = ({ factura, onClose }) => {
  if (!factura) return null;

  const documentos = [
    { archivo: 'F0001-123.pdf', tipo: 'PDF', tamano: '210 KB' },
    { archivo: 'F0001-123.xml', tipo: 'XML', tamano: '12 KB' }
  ];

  const items = [
    { item: 10, descripcion: 'Mouse óptico', cantidad: 10, precio: 30.00, descuento: 0, igv: 18, subtotal: 354.00, estado: 'OK' },
    { item: 20, descripcion: 'Teclado mecánico', cantidad: 5, precio: 120.00, descuento: 0, igv: 18, subtotal: 708.00, estado: 'OK' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">Detalle de factura</h2>
            <Button variant="ghost" onClick={onClose} icon={X}>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Proveedor</h3>
                <div className="space-y-3">
                  <Input value={factura.proveedor} onChange={() => {}} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Serie-Número" value={factura.numero} onChange={() => {}} />
                    <Input label="Fecha Emisión" value={factura.fecha} onChange={() => {}} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Moneda" value={factura.moneda} onChange={() => {}} />
                    <Input label="Monto" value={factura.monto.toFixed(2)} onChange={() => {}} />
                  </div>
                  <Input label="OC vinculada" value={factura.origen} onChange={() => {}} />
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Documentos</h3>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Archivo</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Tipo</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Tamaño</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentos.map((doc, idx) => (
                      <DocumentRow key={idx} doc={doc} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Items</h3>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Item</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Descripción</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Cant.</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Precio</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Desc.</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">IGV</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Subtotal</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <ItemRow key={idx} item={item} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Estado</h3>
                <Badge variant={factura.estado.toLowerCase()}>{factura.estado}</Badge>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Acciones</h3>
                <div className="space-y-2">
                  <Button variant="outline" icon={X}>Conciliar</Button>
                  <Button variant="secondary">Rechazar</Button>
                  <Button variant="outline" icon={Check}>Aprobar</Button>
                  <Button variant="primary" icon={Send}>Enviar a CxP</Button>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Conciliación</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Resultado</p>
                  <p className="text-sm">No se detecta discrepancias</p>
                  <Button variant="ghost">Ver detalle</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN APP =============
export default function FacturacionApp() {
  const [showRegistrar, setShowRegistrar] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);

  const facturas = [
    { numero: 'F0001-123', proveedor: 'Tecnologías Andinas', fecha: '2025-10-02', moneda: 'PEN', monto: 3450.00, estado: 'Pendiente', origen: 'OC-1021', accion: 'Conciliar' },
    { numero: 'F0023-884', proveedor: 'Lógico SAC', fecha: '2025-10-05', moneda: 'USD', monto: 1280.00, estado: 'Conciliada', origen: 'OC-1032', accion: 'Enviar a CxP' },
    { numero: 'B001-777', proveedor: 'ServiHealth', fecha: '2025-10-08', moneda: 'PEN', monto: 980.00, estado: 'Observada', origen: 'OC-1038', accion: 'Corregir' },
    { numero: 'F0005-009', proveedor: 'ElectroPerú', fecha: '2025-10-09', moneda: 'PEN', monto: 12100.00, estado: 'Aprobada', origen: 'OC-1040', accion: 'Enviar a CxP' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Facturas</h1>
        </div>

        <ListaFacturas 
          facturas={facturas} 
          onFacturaClick={setSelectedFactura}
        />

        {showRegistrar && (
          <RegistrarFacturaForm
            onClose={() => setShowRegistrar(false)}
            onSave={() => {
              setShowRegistrar(false);
              alert('Factura guardada');
            }}
          />
        )}

        {selectedFactura && (
          <DetalleFactura
            factura={selectedFactura}
            onClose={() => setSelectedFactura(null)}
          />
        )}
      </div>
    </div>
  );
}