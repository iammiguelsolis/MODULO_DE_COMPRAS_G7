import React, { useState } from 'react';
import { ArrowLeftFromLine, Users, FileText, Award, CheckCircle, Mail, Clock } from 'lucide-react';
import PageHeader from '../../../../modules/licitaciones/components/molecules/PageHeader';
import Button from '../../../../modules/licitaciones/components/atoms/Button';
import type { ProcesoDetalle, OfertaInput, Solicitud } from '../../../../services/solicitudYadquisicion/types';
import { useEffect } from 'react';
import { ProveedoresApi } from '../../../../services/solicitudYadquisicion/api'; // Ajusta la ruta a tu api.ts
import type { Proveedor } from '../../../../services/solicitudYadquisicion/types'; // Ajusta

interface CompraDetailTemplateProps {
  compra: ProcesoDetalle;
  solicitud: Solicitud | null;
  onInvitar: (proveedoresIds: number[]) => void;
  onOfertar: (data: OfertaInput) => void;
  onAdjudicar: (idOferta: number) => void;
}

const CompraDetailTemplate: React.FC<CompraDetailTemplateProps> = ({
  compra,
  solicitud,
  onInvitar,
  onOfertar,
  onAdjudicar
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedProviderIds, setSelectedProviderIds] = useState<number[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [isLoadingProveedores, setIsLoadingProveedores] = useState(false);

  useEffect(() => {
    if (showInviteModal) {
      cargarProveedores();
    }
  }, [showInviteModal]);

  // Mock data for available suppliers
  const cargarProveedores = async () => {
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

  // Offer Form State
  const [offerForm, setOfferForm] = useState<OfertaInput>({
    id_proveedor: 0,
    monto_total: 0,
    comentarios: '',
    items: []
  });

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOfertar(offerForm);
    setShowOfferModal(false);
    setOfferForm({ id_proveedor: 0, monto_total: 0, comentarios: '', items: [] });
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
                <span><span className="font-medium">Comprador:</span> {solicitud?.titulo ? 'Usuario Actual' : 'Sistema'}</span>
              </div>
            </div>
            <button
              onClick={() => window.history.back()}
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
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Flujo del proceso de licitación</h3>

              <div className="space-y-6">
                {/* Step 1: Nueva */}
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      1
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">Nueva</h4>
                        {currentStep === 1 && (
                          <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                            Estado actual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Invitando proveedores</p>

                      {compra.estado === 'NUEVO' && (
                        <button
                          onClick={() => setShowInviteModal(true)}
                          className="w-full bg-blue-500 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Mail size={16} />
                          Invitar proveedores
                        </button>
                      )}
                    </div>
                  </div>
                  {currentStep > 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200 -mb-6"></div>
                  )}
                </div>

                {/* Step 2: En invitación */}
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      2
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">En invitación</h4>
                        {currentStep === 2 && (
                          <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                            Estado actual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Registrando propuesta de los proveedores</p>

                      {compra.estado === 'INVITANDO_PROVEEDORES' && (
                        <button
                          onClick={() => setShowOfferModal(true)}
                          className="w-full bg-white border-2 border-blue-500 text-blue-500 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <FileText size={16} />
                          Registrar Oferta
                        </button>
                      )}
                    </div>
                  </div>
                  {currentStep > 2 && (
                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200 -mb-6"></div>
                  )}
                </div>

                {/* Step 3: Con propuestas */}
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      3
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">Con propuestas</h4>
                        {currentStep === 3 && (
                          <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                            Estado actual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Evaluación y adjudicación</p>

                      {compra.estado === 'EVALUANDO_OFERTAS' && (
                        <div className="space-y-2">
                          {compra.ofertas && compra.ofertas.length > 0 ? (
                            compra.ofertas.map(oferta => (
                              <div key={oferta.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium text-gray-900">{oferta.nombre_proveedor}</span>
                                  <span className="font-bold text-gray-900">S/. {oferta.monto_total}</span>
                                </div>
                                <button
                                  onClick={() => onAdjudicar(oferta.id)}
                                  className="text-blue-500 hover:text-blue-600 text-xs font-medium"
                                >
                                  Elegir Ganador
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-400 italic">No hay ofertas registradas</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {currentStep > 3 && (
                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200 -mb-6"></div>
                  )}
                </div>

                {/* Step 4: Finalizada */}
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      currentStep >= 4 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      4
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">Finalizada</h4>
                        {currentStep === 4 && (
                          <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                            Estado actual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">Proceso de Compra finalizado</p>
                      {compra.ganador_id && (
                        <div className="mt-2 flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded text-sm">
                          <Award size={16} />
                          <span className="font-medium">Ganador: {compra.ofertas.find(o => o.proveedor_id === compra.ganador_id)?.nombre_proveedor}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: General Info & Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Información General</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Presupuesto Máximo</span>
                  <span className="font-semibold text-gray-900">S/. {solicitud?.total ? solicitud.total.toLocaleString() : '---'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Solicitud de Origen</span>
                  <span className="font-semibold text-gray-900">Nº {compra.solicitud_id}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Estado</span>
                  <span className={`font-semibold ${compra.estado === 'CERRADO' ? 'text-green-600' : 'text-blue-600'}`}>
                    {compra.estado.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Comprador</span>
                  <span className="font-semibold text-gray-900">Usuario Actual</span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Ítems</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Descripción</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Cantidad / Horas</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Precio Uni. / Tarifa</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Total Item</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {solicitud?.items && solicitud.items.length > 0 ? (
                      solicitud.items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-medium">
                              {item.tipo_item}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {item.nombre_material || item.nombre_servicio || '---'}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700">
                            {item.cantidad || item.horas_estimadas || 0}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-700">
                            S/. {item.precio_unitario || item.tarifa_hora || 0}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">
                            S/. {item.subtotal}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No hay ítems registrados en la solicitud.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Invitar Proveedores</h3>
            <p className="mb-6 text-sm text-gray-500">Seleccione los proveedores que desea invitar a este proceso.</p>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {isLoadingProveedores ? (
                  <div className="text-center py-4 text-gray-500">Cargando proveedores...</div>
                ) : proveedores.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No hay proveedores registrados.</div>
                ) : (
                  proveedores.map(p => (
                    <div
                      key={p.id_proveedor} // Usar el ID real del backend
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedProviderIds.includes(p.id_proveedor) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleProviderSelection(p.id_proveedor)}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        selectedProviderIds.includes(p.id_proveedor) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                      }`}>
                        {selectedProviderIds.includes(p.id_proveedor) && <CheckCircle size={14} className="text-white" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{p.razon_social}</p> {/* Usar campos reales */}
                        <p className="text-xs text-gray-500">{p.ruc} • {p.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowInviteModal(false)}>Cancelar</Button>
              <Button onClick={handleInviteSubmit} disabled={selectedProviderIds.length === 0}>
                Invitar ({selectedProviderIds.length})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Registrar Oferta</h3>
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={offerForm.id_proveedor}
                  onChange={e => setOfferForm({ ...offerForm, id_proveedor: Number(e.target.value) })}
                  required
                >
                  <option value={0}>Seleccione un proveedor...</option>
                  {mockAvailableSuppliers.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto Total (S/.)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={offerForm.monto_total}
                  onChange={e => setOfferForm({ ...offerForm, monto_total: Number(e.target.value) })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  value={offerForm.comentarios}
                  onChange={e => setOfferForm({ ...offerForm, comentarios: e.target.value })}
                  placeholder="Detalles adicionales de la oferta..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowOfferModal(false)}>Cancelar</Button>
                <Button type="submit">Registrar Oferta</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompraDetailTemplate;