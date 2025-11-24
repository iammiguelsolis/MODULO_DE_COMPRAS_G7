import React, { useState } from 'react';
import { X, Upload, FileText, Download } from 'lucide-react';

// ============= ATOMS =============
interface InputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required, 
  type = "text",
  disabled = false 
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs text-gray-600 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="px-3 py-2.5 text-sm bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
    />
  </div>
);

interface SelectProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ 
  label, 
  value, 
  onChange, 
  options, 
  required,
  placeholder 
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs text-gray-600 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      className="px-3 py-2.5 text-sm bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  type?: 'button' | 'submit';
  icon?: React.ElementType;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  type = 'button',
  icon: Icon,
  fullWidth = false
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'bg-white text-blue-600 hover:bg-blue-50 shadow-sm',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pendiente' | 'conciliada' | 'observada' | 'aprobada';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'pendiente' }) => {
  const variants = {
    pendiente: 'bg-amber-100 text-amber-700',
    conciliada: 'bg-emerald-100 text-emerald-700',
    observada: 'bg-orange-100 text-orange-700',
    aprobada: 'bg-blue-100 text-blue-700'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

interface TabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-5 py-3 text-sm font-medium transition-all rounded-lg ${
      active 
        ? 'bg-blue-600 text-white shadow-sm' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

// ============= MOLECULES =============
const FileUploadArea: React.FC = () => (
  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-12 text-center hover:from-blue-100 hover:to-indigo-100 transition-all cursor-pointer group">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
        <Upload className="text-blue-600" size={20} />
      </div>
      <p className="text-sm text-gray-600">Arrastra aquí o haz clic para seleccionar</p>
      <p className="text-xs text-gray-500">PDF o XML</p>
    </div>
  </div>
);

interface InvoiceRowProps {
  factura: Factura;
  onClick: () => void;
}

const InvoiceRow: React.FC<InvoiceRowProps> = ({ factura, onClick }) => (
  <tr 
    className="hover:bg-gray-50 cursor-pointer transition-colors group"
    onClick={onClick}
  >
    <td className="px-6 py-4">
      <span className="text-sm font-medium text-gray-900">{factura.numero}</span>
    </td>
    <td className="px-6 py-4 text-sm text-gray-700">{factura.proveedor}</td>
    <td className="px-6 py-4 text-sm text-gray-600">{factura.fecha}</td>
    <td className="px-6 py-4 text-sm text-gray-600">{factura.moneda}</td>
    <td className="px-6 py-4 text-sm font-medium text-gray-900">{factura.monto.toLocaleString('es-PE', {minimumFractionDigits: 2})}</td>
    <td className="px-6 py-4">
      <Badge variant={factura.estado.toLowerCase() as any}>{factura.estado}</Badge>
    </td>
    <td className="px-6 py-4 text-sm text-gray-600">{factura.origen}</td>
    <td className="px-6 py-4">
      <span className="text-sm text-blue-600 group-hover:text-blue-700">Ver · {factura.accion}</span>
    </td>
  </tr>
);

interface DocumentRowProps {
  doc: Documento;
}

const DocumentRow: React.FC<DocumentRowProps> = ({ doc }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
        <FileText className="text-blue-600" size={18} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{doc.archivo}</p>
        <p className="text-xs text-gray-500">{doc.tipo} · {doc.tamano}</p>
      </div>
    </div>
    <Button variant="ghost" icon={Download}>Ver</Button>
  </div>
);

interface ItemRowProps {
  item: Item;
}

const ItemRow: React.FC<ItemRowProps> = ({ item }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.item}</td>
    <td className="px-4 py-4 text-sm text-gray-700">{item.descripcion}</td>
    <td className="px-4 py-4 text-sm text-gray-600 text-center">{item.cantidad}</td>
    <td className="px-4 py-4 text-sm text-gray-600 text-right">{item.precio.toFixed(2)}</td>
    <td className="px-4 py-4 text-sm text-gray-600 text-center">{item.descuento}%</td>
    <td className="px-4 py-4 text-sm text-gray-600 text-center">{item.igv}%</td>
    <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">{item.subtotal.toFixed(2)}</td>
    <td className="px-4 py-4 text-center">
      <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
        <span className="text-xs font-medium text-green-700">✓</span>
      </span>
    </td>
  </tr>
);

// ============= ORGANISMS =============
interface RegistrarFacturaFormProps {
  onClose: () => void;
  onSave: () => void;
}

const RegistrarFacturaForm: React.FC<RegistrarFacturaFormProps> = ({ onClose, onSave }) => {
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
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Registrar Factura</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          {/* Bento Box Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Fila 1 */}
            <div className="col-span-3">
              <Select
                label="Proveedor"
                value={formData.proveedor}
                onChange={(e) => setFormData({...formData, proveedor: e.target.value})}
                options={[
                  { value: 'tecnologias', label: 'Tecnologías Andinas' },
                  { value: 'logico', label: 'Lógico SAC' }
                ]}
                placeholder="Selecciona proveedor"
                required
              />
            </div>
            <div className="col-span-3">
              <Input
                label="RUC"
                value={formData.ruc}
                onChange={(e) => setFormData({...formData, ruc: e.target.value})}
              />
            </div>
            <div className="col-span-3">
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
            </div>
            <div className="col-span-3">
              <Input
                label="OC (opcional)"
                value={formData.oc}
                onChange={(e) => setFormData({...formData, oc: e.target.value})}
                placeholder="Buscar por #"
              />
            </div>

            {/* Fila 2 */}
            <div className="col-span-3">
              <Input
                label="Serie"
                value={formData.serie}
                onChange={(e) => setFormData({...formData, serie: e.target.value})}
                required
              />
            </div>
            <div className="col-span-3">
              <Input
                label="Número"
                value={formData.numero}
                onChange={(e) => setFormData({...formData, numero: e.target.value})}
                required
              />
            </div>
            <div className="col-span-3">
              <Input
                label="Fecha Emisión"
                type="date"
                value={formData.fechaEmision}
                onChange={(e) => setFormData({...formData, fechaEmision: e.target.value})}
                required
              />
            </div>
            <div className="col-span-3">
              <Input
                label="Fecha Vencimiento"
                type="date"
                value={formData.fechaVencimiento}
                onChange={(e) => setFormData({...formData, fechaVencimiento: e.target.value})}
                required
              />
            </div>

            {/* Fila 3 - Montos */}
            <div className="col-span-4">
              <Input
                label="Sub Total"
                value={formData.subTotal}
                onChange={(e) => setFormData({...formData, subTotal: e.target.value})}
              />
            </div>
            <div className="col-span-4">
              <Input
                label="IGV"
                value={formData.igv}
                onChange={(e) => setFormData({...formData, igv: e.target.value})}
              />
            </div>
            <div className="col-span-4">
              <Input
                label="Total"
                value={formData.total}
                onChange={(e) => setFormData({...formData, total: e.target.value})}
              />
            </div>

            {/* Upload Area */}
            <div className="col-span-12">
              <label className="text-xs text-gray-600 font-medium mb-2 block">
                Adjuntar archivos (PDF/XML)
              </label>
              <FileUploadArea />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6">
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button onClick={onSave}>Guardar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ListaFacturasProps {
  facturas: Factura[];
  onFacturaClick: (factura: Factura) => void;
  onNuevaFactura: () => void;
}

const ListaFacturas: React.FC<ListaFacturasProps> = ({ facturas, onFacturaClick, onNuevaFactura }) => {
  const [activeTab, setActiveTab] = useState('pendiente');
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [monedaFilter, setMonedaFilter] = useState('Todas');
  const [rangoFechas, setRangoFechas] = useState('Últimos 30 días');

  const filteredFacturas = facturas.filter(f => {
    const matchesTab = f.estado.toLowerCase() === activeTab;
    const matchesSearch = searchTerm === '' || 
      f.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.proveedor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-8">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Facturas</h1>
            <Button icon={FileText} onClick={onNuevaFactura}>Nueva factura</Button>
          </div>
          
          {/* Filters Grid */}
          <div className="grid grid-cols-12 gap-4 ">
            <div className="col-span-4">
              <Input
                placeholder="Número, proveedor, OC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                options={[{ value: 'Todos', label: 'Todos' }]}
              />
            </div>
            <div className="col-span-2">
              <Select
                value={monedaFilter}
                onChange={(e) => setMonedaFilter(e.target.value)}
                options={[{ value: 'Todas', label: 'Todas' }]}
              />
            </div>
            <div className="col-span-4">
              <Input
                value={rangoFechas}
                onChange={(e) => setRangoFechas(e.target.value)}
                placeholder="Últimos 30 días"
              />
            </div>
          </div>
        </div>

        {/* Tabs Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex gap-2">
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

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-500">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Factura</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Proveedor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Moneda</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Origen</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFacturas.map(factura => (
                  <InvoiceRow 
                    key={factura.numero} 
                    factura={factura} 
                    onClick={() => onFacturaClick(factura)} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DetalleFacturaProps {
  factura: Factura;
  onClose: () => void;
}

const DetalleFactura: React.FC<DetalleFacturaProps> = ({ factura, onClose }) => {
  const documentos: Documento[] = [
    { archivo: 'F0001-123.pdf', tipo: 'PDF', tamano: '210 KB' },
    { archivo: 'F0001-123.xml', tipo: 'XML', tamano: '12 KB' }
  ];

  const items: Item[] = [
    { item: 10, descripcion: 'Mouse óptico', cantidad: 10, precio: 30.00, descuento: 0, igv: 18, subtotal: 354.00, estado: 'OK' },
    { item: 20, descripcion: 'Teclado mecánico', cantidad: 5, precio: 120.00, descuento: 0, igv: 18, subtotal: 708.00, estado: 'OK' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="mx-auto">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content - 8 cols */}
          <div className="col-span-8 space-y-6">
            {/* Detalle Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Detalle de factura</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Proveedor"
                    value={factura.proveedor}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                
                <Input
                  label="Serie-Número"
                  value={factura.numero}
                  onChange={() => {}}
                  disabled
                />
                <Input
                  label="Fecha Emisión"
                  value={factura.fecha}
                  onChange={() => {}}
                  disabled
                />

                <Input
                  label="Moneda"
                  value={factura.moneda}
                  onChange={() => {}}
                  disabled
                />
                <Input
                  label="Monto"
                  value={factura.monto.toFixed(2)}
                  onChange={() => {}}
                  disabled
                />

                <div className="col-span-2">
                  <Input
                    label="OC vinculada"
                    value={factura.origen}
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Documentos Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Documentos</h3>
              <div className="space-y-3">
                {documentos.map((doc, idx) => (
                  <DocumentRow key={idx} doc={doc} />
                ))}
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Descripción</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Cant.</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Precio</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Desc.</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">IGV</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Subtotal</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Estado</th>
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
          </div>

          {/* Sidebar - 4 cols */}
          <div className="col-span-4 space-y-6">
            {/* Estado Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Estado</h3>
                <Badge variant={factura.estado.toLowerCase() as any}>{factura.estado}</Badge>
              </div>
            </div>

            {/* Acciones Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Acciones</h3>
              <div className="space-y-3">
                <Button variant="primary" fullWidth>Conciliar</Button>
                <Button variant="secondary" fullWidth>Rechazar</Button>
                <Button variant="outline" fullWidth>Aprobar</Button>
                <Button variant="primary" fullWidth>Enviar a CxP</Button>
              </div>
            </div>

            {/* Conciliación Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Conciliación</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Resultado</p>
                  <p className="text-sm font-medium text-gray-900">No se detecta discrepancias</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver detalle →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= TYPES =============
interface Factura {
  numero: string;
  proveedor: string;
  fecha: string;
  moneda: string;
  monto: number;
  estado: string;
  origen: string;
  accion: string;
}

interface Documento {
  archivo: string;
  tipo: string;
  tamano: string;
}

interface Item {
  item: number;
  descripcion: string;
  cantidad: number;
  precio: number;
  descuento: number;
  igv: number;
  subtotal: number;
  estado: string;
}

// ============= MAIN APP =============
export default function FacturacionApp() {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [showRegistrar, setShowRegistrar] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);

  const facturas: Factura[] = [
    { numero: 'F0001-123', proveedor: 'Tecnologías Andinas', fecha: '2025-10-02', moneda: 'PEN', monto: 3450.00, estado: 'Pendiente', origen: 'OC-1021', accion: 'Conciliar' },
    { numero: 'F0023-884', proveedor: 'Lógico SAC', fecha: '2025-10-05', moneda: 'USD', monto: 1280.00, estado: 'Conciliada', origen: 'OC-1032', accion: 'Enviar a CxP' },
    { numero: 'B001-777', proveedor: 'ServiHealth', fecha: '2025-10-08', moneda: 'PEN', monto: 980.00, estado: 'Observada', origen: 'OC-1038', accion: 'Corregir' },
    { numero: 'F0005-009', proveedor: 'ElectroPerú', fecha: '2025-10-09', moneda: 'PEN', monto: 12100.00, estado: 'Aprobada', origen: 'OC-1040', accion: 'Enviar a CxP' },
  ];

  const handleFacturaClick = (factura: Factura) => {
    setSelectedFactura(factura);
    setView('detail');
  };

  return (
    <>
      {view === 'list' && (
        <ListaFacturas 
          facturas={facturas}
          onFacturaClick={handleFacturaClick}
          onNuevaFactura={() => setShowRegistrar(true)}
        />
      )}

      {view === 'detail' && selectedFactura && (
        <DetalleFactura 
          factura={selectedFactura}
          onClose={() => setView('list')}
        />
      )}

      {showRegistrar && (
        <RegistrarFacturaForm
          onClose={() => setShowRegistrar(false)}
          onSave={() => {
            setShowRegistrar(false);
            alert('Factura guardada exitosamente');
          }}
        />
      )}
    </>
  );
}