import React, { useState, useEffect } from 'react';
import { ArrowLeftFromLine, Award, CheckCircle, Mail, FileText, Calculator, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../facturación/components/atoms';
import { ProveedoresApi } from '../../../../services/solicitudYadquisicion/api';
import type { ProcesoDetalle, OfertaInput, Solicitud, ItemOfertaInput, OfertaOutput } from '../../../../services/solicitudYadquisicion/types';
import type { Proveedor } from '../../../../services/solicitudYadquisicion/types';

interface CompraDetailTemplateProps {
  compra: ProcesoDetalle;
  solicitud: Solicitud | null;
  onInvitar: (proveedoresIds: number[]) => void;
  onOfertar: (data: OfertaInput) => void;
  onAdjudicar: (idOferta: number) => void;
  onCerrarOfertas: () => void;
}

const CompraDetailTemplate: React.FC<CompraDetailTemplateProps> = ({
  compra,
  solicitud,
  onInvitar,
  onOfertar,
  onAdjudicar,
  onCerrarOfertas
}) => {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfertaOutput | null>(null);

  const [selectedProviderIds, setSelectedProviderIds] = useState<number[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [isLoadingProveedores, setIsLoadingProveedores] = useState(false);

  // Estado del Formulario de Oferta
  const [offerForm, setOfferForm] = useState<OfertaInput>({
    id_proveedor: 0,
    monto_total: 0,
    comentarios: '',
    items: []
  });

  // --- EFECTOS ---

  // Cargar proveedores al abrir cualquiera de los dos modales
  useEffect(() => {
    if (showInviteModal || showOfferModal) {
      cargarProveedores();
    }
  }, [showInviteModal, showOfferModal]);

  // Al abrir el modal de oferta, pre-cargar los ítems de la solicitud
  useEffect(() => {
    if (showOfferModal && solicitud?.items) {
      const itemsPreCargados: ItemOfertaInput[] = solicitud.items.map(item => ({
        tipo: item.tipo_item,
        precio: 0, // El usuario debe ingresar el precio ofertado
        descripcion: item.nombre_material || item.nombre_servicio || '',
        marca: '', // Campo para que el proveedor especifique marca
        cantidad: item.cantidad || item.horas_estimadas || 0,
        dias: 0,
        experiencia: ''
      }));

      setOfferForm(prev => ({
        ...prev,
        items: itemsPreCargados,
        monto_total: 0
      }));
    }
  }, [showOfferModal, solicitud]);

  // Recalcular total cuando cambian los precios de los items
  useEffect(() => {
    const nuevoTotal = offerForm.items.reduce((sum, item) => {
      return sum + (item.cantidad! * item.precio);
    }, 0);
    setOfferForm(prev => ({ ...prev, monto_total: nuevoTotal }));
  }, [offerForm.items]);


  // --- FUNCIONES DE LOGICA ---

  const cargarProveedores = async () => {
    // Evitar recargar si ya hay datos
    if (proveedores.length > 0) return;

    setIsLoadingProveedores(true);
    try {
      const data = await ProveedoresApi.listar();
      setProveedores(data);
    } catch (error) {
      console.error("Error al cargar proveedores", error);
    } finally {
      setIsLoadingProveedores(false);
    }
  };

  const handleInviteSubmit = () => {
    onInvitar(selectedProviderIds);
    setShowInviteModal(false);
    setSelectedProviderIds([]);
  };

  const toggleProviderSelection = (id: number) => {
    setSelectedProviderIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Manejo de cambios en el formulario de oferta
  const handleItemChange = (index: number, field: keyof ItemOfertaInput, value: any) => {
    const newItems = [...offerForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setOfferForm({ ...offerForm, items: newItems });
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (offerForm.id_proveedor === 0) {
      return alert("Seleccione un proveedor");
    }

    if (offerForm.monto_total <= 0) {
      return alert("El monto total no puede ser 0");
    }

    // ✅ VALIDACIÓN: PROVEEDOR NO PUEDE TENER MÁS DE UNA OFERTA
    const proveedorYaOferto = compra.ofertas.some(
      oferta => oferta.proveedor_id === offerForm.id_proveedor
    );

    if (proveedorYaOferto) {
      return alert("Este proveedor ya registró una oferta en este proceso.");
    }

    onOfertar(offerForm);
    setShowOfferModal(false);

    setOfferForm({
      id_proveedor: 0,
      monto_total: 0,
      comentarios: '',
      items: []
    });
  };

  const getStatusStep = () => {
    switch (compra.estado) {
      case 'NUEVO': return 1;
      case 'INVITANDO_PROVEEDORES': return 2;
      case 'EVALUANDO_OFERTAS': return 3;
      case 'CERRADO': return 4;
      default: return 1;
    }
  };

  const currentStep = getStatusStep();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {solicitud?.titulo || `Proceso de Compra #${compra.id}`}
              </h1>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span><span className="font-medium">ID:</span> {compra.id}</span>
                <span><span className="font-medium">Fecha creación:</span> {new Date(compra.fecha_creacion).toLocaleDateString()}</span>
                <span><span className="font-medium">Estado:</span> <span className="uppercase font-bold text-blue-600">{compra.estado.replace('_', ' ')}</span></span>
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftFromLine size={16} />
              Volver
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Vertical Timeline */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Flujo del proceso</h3>

              <div className="space-y-0 relative">
                {/* Línea conectora */}
                <div className="absolute left-[19px] top-2 bottom-10 w-0.5 bg-gray-200 -z-10"></div>

                {/* Step 1 */}
                <TimelineStep
                  step={1} currentStep={currentStep} label="Nueva" desc="Invitando proveedores"
                  isActive={currentStep === 1}
                >
                  {compra.estado === 'NUEVO' && (
                    <button onClick={() => setShowInviteModal(true)} className="w-full mt-2 bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 flex justify-center gap-2 items-center">
                      <Mail size={14} /> Invitar proveedores
                    </button>
                  )}
                </TimelineStep>

                {/* Step 2 */}
                <TimelineStep
                  step={2} currentStep={currentStep} label="En invitación" desc="Registrando propuestas"
                  isActive={currentStep === 2}
                >
                  {(compra.estado === 'INVITANDO_PROVEEDORES' || compra.estado === 'EVALUANDO_OFERTAS') && (
                    <div className="space-y-2 mt-2">

                      <button
                        onClick={() => setShowOfferModal(true)}
                        className="w-full bg-white border border-blue-600 text-blue-600 py-2 rounded text-sm font-medium hover:bg-blue-50 flex justify-center gap-2 items-center"
                      >
                        <FileText size={14} /> Añadir Nueva Oferta
                      </button>

                      {compra.estado === 'INVITANDO_PROVEEDORES' && compra.ofertas.length > 0 && (
                        <button
                          onClick={onCerrarOfertas}
                          className="w-full bg-indigo-600 text-white py-2 rounded text-sm font-medium hover:bg-indigo-700 flex justify-center gap-2 items-center"
                        >
                          <CheckCircle size={14} /> Cerrar Recepción de Ofertas
                        </button>
                      )}

                    </div>
                  )}
                </TimelineStep>

                {/* Step 3 */}
                <TimelineStep step={3} currentStep={currentStep} label="Con propuestas" desc="Evaluación y adjudicación" isActive={currentStep === 3} />

                {/* Step 4 */}
                <TimelineStep step={4} currentStep={currentStep} label="Finalizada" desc="Proceso cerrado" isActive={currentStep === 4} />
              </div>
            </div>
          </div>

          {/* Right Column: General Info & Items */}
          <div className="lg:col-span-2 space-y-6">

            {/* Items Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ítems Solicitados</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Descripción</th>
                      <th className="px-4 py-2 text-center font-semibold text-gray-700">Cant.</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Ref. Unitario</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Total Ref.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {solicitud?.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-gray-900">{item.nombre_material || item.nombre_servicio}</td>
                        <td className="px-4 py-2 text-center text-gray-600">{item.cantidad || item.horas_estimadas}</td>
                        <td className="px-4 py-2 text-right text-gray-600">S/. {item.precio_unitario || item.tarifa_hora}</td>
                        <td className="px-4 py-2 text-right font-medium text-gray-900">S/. {item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Propuestas Recibidas */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ofertas Recibidas ({compra.ofertas.length})</h3>
              {compra.ofertas.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded border border-dashed border-gray-300">
                  <p className="text-gray-500">Aún no se han registrado ofertas.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {compra.ofertas.map(oferta => (
                    <div
                      key={oferta.id}
                      className={`p-4 rounded-lg border flex justify-between items-center transition-all cursor-pointer ${compra.ganador_id === oferta.id ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                      onClick={() => setSelectedOffer(oferta)}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">{oferta.nombre_proveedor}</h4>
                          {compra.ganador_id === oferta.id && <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded font-bold">GANADOR</span>}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{oferta.comentarios}</p>
                        <div className="mt-2 text-xs text-gray-400">Items ofertados: {oferta.items.length}</div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">S/. {oferta.monto_total.toFixed(2)}</p>
                        {compra.estado === 'EVALUANDO_OFERTAS' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAdjudicar(oferta.id);
                            }}
                            className="mt-2 text-sm text-blue-600 font-medium hover:underline flex items-center justify-end gap-1"
                          >
                            <Award size={14} /> Adjudicar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ================= MODALES ================= */}

      {/* 1. Modal Invitar */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Mail className="text-blue-600" size={20} /> Invitar Proveedores
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-red-500"><ArrowLeftFromLine size={20} className="rotate-180" /></button>
            </div>

            <div className="p-0 overflow-y-auto flex-1">
              {isLoadingProveedores ? (
                <div className="p-8 text-center text-gray-500">Cargando lista de proveedores...</div>
              ) : proveedores.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No se encontraron proveedores en la base de datos.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {proveedores.map(p => (
                    <div
                      key={p.id_proveedor}
                      onClick={() => toggleProviderSelection(p.id_proveedor)}
                      className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedProviderIds.includes(p.id_proveedor) ? 'bg-blue-50' : ''}`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedProviderIds.includes(p.id_proveedor) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {selectedProviderIds.includes(p.id_proveedor) && <CheckCircle size={14} className="text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{p.razon_social}</p>
                        <p className="text-xs text-gray-500">RUC: {p.ruc} • {p.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowInviteModal(false)}>Cancelar</Button>
              <Button onClick={handleInviteSubmit} disabled={selectedProviderIds.length === 0}>
                Enviar Invitación ({selectedProviderIds.length})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Registrar Oferta (REDDISEÑADO) */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header Modal */}
            <div className="p-6 border-b bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <FileText size={24} /> Registrar Oferta de Proveedor
                </h3>
                <p className="text-blue-100 text-sm mt-1">Ingrese los detalles económicos enviados por el proveedor.</p>
              </div>
              <button onClick={() => setShowOfferModal(false)} className="text-white/70 hover:text-white"><ArrowLeftFromLine size={24} className="rotate-180" /></button>
            </div>

            <form onSubmit={handleOfferSubmit} className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Sección 1: Selección de Proveedor */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Building2 size={16} /> Proveedor
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      value={offerForm.id_proveedor}
                      onChange={e => setOfferForm({ ...offerForm, id_proveedor: Number(e.target.value) })}
                      required
                    >
                      <option value={0}>-- Seleccione quién oferta --</option>
                      {proveedores.map(p => {
                        const yaOferto = compra.ofertas.some(
                          oferta => oferta.proveedor_id === p.id_proveedor
                        );

                        console.log(compra);

                        return (
                          <option
                            key={p.id_proveedor}
                            value={p.id_proveedor}
                            disabled={yaOferto}
                          >
                            {p.razon_social} {yaOferto ? '(YA OFERTÓ)' : `(RUC: ${p.ruc})`}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Comentarios / Condiciones</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                      value={offerForm.comentarios}
                      onChange={e => setOfferForm({ ...offerForm, comentarios: e.target.value })}
                      placeholder="Ej. Entrega inmediata, Incluye instalación..."
                    />
                  </div>
                </div>

                {/* Sección 2: Tabla de Ítems (Autocompletada) */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                    <h4 className="font-bold text-gray-700 text-sm">Detalle de la Oferta</h4>
                    <span className="text-xs text-gray-500">Los ítems se cargaron de la solicitud original</span>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-2 text-left">Ítem Solicitado</th>
                        <th className="px-4 py-2 text-center w-24">Cant.</th>
                        <th className="px-4 py-2 text-left w-40">Marca/Modelo</th>
                        <th className="px-4 py-2 text-right w-32">Precio Unit. (S/.)</th>
                        <th className="px-4 py-2 text-right w-32">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {offerForm.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <p className="font-medium text-gray-900">{item.descripcion}</p>
                            <span className="text-xs bg-gray-100 px-1.5 rounded text-gray-500">{item.tipo}</span>
                          </td>
                          <td className="px-4 py-2 text-center text-gray-600">{item.cantidad}</td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              placeholder="Ej. Dell, HP..."
                              className="w-full border-gray-300 rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                              value={item.marca}
                              onChange={(e) => handleItemChange(index, 'marca', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="w-full border-gray-300 rounded px-2 py-1 text-right text-sm focus:ring-blue-500 focus:border-blue-500"
                              value={item.precio}
                              onChange={(e) => handleItemChange(index, 'precio', parseFloat(e.target.value) || 0)}
                              min="0"
                            />
                          </td>
                          <td className="px-4 py-2 text-right font-medium text-gray-900">
                            S/. {(item.precio * (item.cantidad || 0)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-right text-gray-600">TOTAL OFERTADO:</td>
                        <td className="px-4 py-3 text-right text-blue-600 text-lg">
                          S/. {offerForm.monto_total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

              </div>

              {/* Footer Modal */}
              <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calculator size={14} /> El total se calcula automáticamente.
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setShowOfferModal(false)}>Cancelar</Button>
                  <Button type="submit">Guardar Oferta</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Detalle de Oferta */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl text-gray-900">Detalle de la Oferta</h3>
                <p className="text-sm text-gray-500">{selectedOffer.nombre_proveedor}</p>
              </div>
              <button onClick={() => setSelectedOffer(null)} className="text-gray-400 hover:text-red-500">
                <ArrowLeftFromLine size={24} className="rotate-180" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-bold uppercase">Monto Total</p>
                  <p className="text-2xl font-bold text-blue-900">S/. {selectedOffer.monto_total.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-bold uppercase">Comentarios</p>
                  <p className="text-gray-900">{selectedOffer.comentarios || 'Sin comentarios'}</p>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 mb-3">Ítems Ofertados</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 text-left">Ítem</th>
                      <th className="px-4 py-2 text-center">Cant.</th>
                      <th className="px-4 py-2 text-left">Marca</th>
                      <th className="px-4 py-2 text-right">Precio Unit.</th>
                      <th className="px-4 py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOffer.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 font-medium text-gray-900">{item.descripcion}</td>
                        <td className="px-4 py-2 text-center text-gray-600">{item.cantidad}</td>
                        <td className="px-4 py-2 text-gray-600">{item.marca || '-'}</td>
                        <td className="px-4 py-2 text-right text-gray-600">S/. {item.precio.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right font-bold text-gray-900">
                          S/. {(item.precio * (item.cantidad || 0)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-5 border-t bg-gray-50 flex justify-end">
              <Button onClick={() => setSelectedOffer(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Componente Helper para el Timeline
const TimelineStep = ({ step, currentStep, label, desc, children, isActive }: any) => {
  const isPast = step < currentStep;
  return (
    <div className="flex gap-4 pb-8 last:pb-0 relative">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300
        ${isActive ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' :
          isPast ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-300'}
      `}>
        {isPast ? <CheckCircle size={20} /> : <span className="font-bold">{step}</span>}
      </div>
      <div className="pt-1 flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{label}</span>
          {isActive && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Actual</span>}
        </div>
        <p className="text-sm text-gray-500">{desc}</p>
        {children}
      </div>
    </div>
  );
};

export default CompraDetailTemplate;