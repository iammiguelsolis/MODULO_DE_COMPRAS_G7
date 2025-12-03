import React, { useState, useEffect } from 'react';
import { X, FileText, Download } from 'lucide-react';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import Spinner from '../atoms/Spinner';
import {
  type FacturaDetalle,
  type FacturaProveedor,
  type Adjunto,
  type ResultadoConciliacion,
  type TrazabilidadLog,
  obtenerFacturaDetalle,
  listarAdjuntos,
  obtenerResultadosConciliacion,
  obtenerTrazabilidad,
  actualizarFactura,
  ejecutarConciliacion,
  enviarACuentasPorPagar,
  listarFacturas
} from '../../services/api';

interface InvoiceDetailModalProps {
  facturaId: string;
  onClose: () => void;
  onRefresh: () => void;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  facturaId,
  onClose,
  onRefresh
}) => {
  const [loading, setLoading] = useState(true);
  const [factura, setFactura] = useState<FacturaDetalle | null>(null);
  const [todasLasVersiones, setTodasLasVersiones] = useState<FacturaProveedor[]>([]);
  const [versionSeleccionada, setVersionSeleccionada] = useState<string>(facturaId);
  const [adjuntos, setAdjuntos] = useState<Adjunto[]>([]);
  const [conciliaciones, setConciliaciones] = useState<ResultadoConciliacion[]>([]);
  const [trazabilidad, setTrazabilidad] = useState<TrazabilidadLog[]>([]);
  
  const [activeTab, setActiveTab] = useState<'general' | 'items' | 'attachments' | 'conciliation'>('general');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    orden_compra_id: ''
  });

  useEffect(() => {
    loadData();
  }, [facturaId]);

  useEffect(() => {
    // Cargar datos cuando cambia la versión seleccionada
    if (versionSeleccionada) {
      loadVersionData(versionSeleccionada);
    }
  }, [versionSeleccionada]);

  const loadData = async () => {
    try {
      setLoading(true);
      const facturaData = await obtenerFacturaDetalle(facturaId);
      
      // Obtener todas las versiones de esta factura
      const todasFacturas = await listarFacturas();
      const versiones = todasFacturas
        .filter(f => f.numero_factura === facturaData.numero_factura)
        .sort((a, b) => b.version - a.version); // Ordenar de mayor a menor

      setTodasLasVersiones(versiones);
      setFactura(facturaData);
      setEditData({ orden_compra_id: facturaData.orden_compra_id || '' });

      // Cargar datos adicionales
      await loadVersionData(facturaId);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los detalles de la factura');
    } finally {
      setLoading(false);
    }
  };

  const loadVersionData = async (id: string) => {
    try {
      const [facturaData, adjuntosData, conciliacionData, trazabilidadData] = await Promise.all([
        obtenerFacturaDetalle(id),
        listarAdjuntos(id),
        obtenerResultadosConciliacion(id).catch(() => []),
        obtenerTrazabilidad(id).catch(() => [])
      ]);

      setFactura(facturaData);
      setAdjuntos(adjuntosData);
      setConciliaciones(conciliacionData);
      setTrazabilidad(trazabilidadData);
      setEditData({ orden_compra_id: facturaData.orden_compra_id || '' });
    } catch (error) {
      console.error('Error cargando versión:', error);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditData({ orden_compra_id: factura?.orden_compra_id || '' });
  };

  const handleSaveEdit = async () => {
    if (!factura) return;
    
    try {
      await actualizarFactura(factura.id, editData);
      alert('Factura actualizada exitosamente');
      setEditMode(false);
      loadData();
      onRefresh();
    } catch (error) {
      console.error('Error actualizando:', error);
      alert('Error al actualizar la factura');
    }
  };

  const handleConciliate = async () => {
    if (!factura) return;

    if (!editData.orden_compra_id) {
      alert('Por favor ingrese el ID de Orden de Compra antes de conciliar');
      setEditMode(true);
      return;
    }

    const confirmacion = window.confirm(
      '¿Está seguro de ejecutar la conciliación?\n\n' +
      'Si la conciliación falla:\n' +
      '- Esta factura pasará a estado EN_CONCILIACION\n' +
      '- Se creará una nueva versión en estado BORRADOR'
    );

    if (!confirmacion) return;

    try {
      setLoading(true);
      const result = await ejecutarConciliacion(factura.id, editData.orden_compra_id);
      
      if (result.estado === 'FALLIDA') {
        alert(
          `❌ Conciliación fallida\n\n` +
          `Motivo: ${result.mensaje}\n\n` +
          `Se ha creado una nueva versión (v${factura.version + 1}) en estado BORRADOR.\n` +
          `La versión actual pasó a EN_CONCILIACION.`
        );
        onRefresh();
        await loadData(); // Recargar para obtener la nueva versión
      } else {
        alert('✅ Conciliación exitosa! La factura ahora está APROBADA.');
        await loadData();
        onRefresh();
      }
    } catch (error) {
      console.error('Error en conciliación:', error);
      alert('Error al ejecutar la conciliación');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToCxP = async () => {
    if (!factura) return;

    if (factura.estado !== 'APROBADA') {
      alert('⚠️ Solo se pueden enviar facturas APROBADAS a Cuentas por Pagar');
      return;
    }

    const confirmacion = window.confirm(
      '¿Confirma el envío de esta factura a Cuentas por Pagar?'
    );

    if (!confirmacion) return;

    try {
      setLoading(true);
      await enviarACuentasPorPagar(factura.id);
      alert('✅ Factura enviada a Cuentas por Pagar exitosamente');
      await loadData();
      onRefresh();
    } catch (error) {
      console.error('Error enviando a CxP:', error);
      alert('Error al enviar a Cuentas por Pagar');
    } finally {
      setLoading(false);
    }
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setVersionSeleccionada(selectedId);
    setEditMode(false); // Salir del modo edición al cambiar versión
  };

  if (loading || !factura) {
    return (
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
        <div className="bg-white rounded-2xl p-12 flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-gray-600">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  // Determinar si es la última versión
  const esUltimaVersion = todasLasVersiones.length > 0 && 
    todasLasVersiones[0].id === factura.id;
  
  // Solo se puede editar si: es última versión Y está en BORRADOR
  const puedeEditar = esUltimaVersion && factura.estado === 'BORRADOR';
  const puedeEnviarCxP = factura.estado === 'APROBADA';

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl my-8">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Factura {factura.numero_factura}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant={factura.estado}>{factura.estado}</Badge>
                <span className="text-sm text-gray-500">
                  {esUltimaVersion ? '(Última versión)' : '(Versión anterior - Solo lectura)'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Selector de Versión */}
          {todasLasVersiones.length > 1 && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                📋 Historial de Versiones
              </label>
              <Select
                value={versionSeleccionada}
                onChange={handleVersionChange}
                options={todasLasVersiones.map(v => ({
                  value: v.id,
                  label: `v${v.version} - ${v.estado} ${v.id === todasLasVersiones[0].id ? '(Actual)' : ''}`
                }))}
              />
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {[
              { key: 'general', label: 'General' },
              { key: 'items', label: 'Items' },
              { key: 'attachments', label: 'Adjuntos' },
              { key: 'conciliation', label: 'Conciliación' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Proveedor"
                      value={factura.proveedor_nombre}
                      onChange={() => {}}
                      disabled
                    />
                    <Input
                      label="RUC"
                      value={factura.proveedor_ruc}
                      onChange={() => {}}
                      disabled
                    />
                    <Input
                      label="Serie-Número"
                      value={factura.numero_factura}
                      onChange={() => {}}
                      disabled
                    />
                    <Input
                      label="Fecha Emisión"
                      value={new Date(factura.fecha_emision).toLocaleDateString('es-PE')}
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
                      label="Total"
                      value={factura.total.toFixed(2)}
                      onChange={() => {}}
                      disabled
                    />
                    <div className="col-span-2">
                      <Input
                        label="OC Vinculada"
                        value={editData.orden_compra_id}
                        onChange={(e) => setEditData({ ...editData, orden_compra_id: e.target.value })}
                        disabled={!editMode}
                        placeholder="Ingrese ID de OC para conciliar"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'items' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Item</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Descripción</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Cant.</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Precio</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {factura.lineas_detalle && factura.lineas_detalle.length > 0 ? (
                        factura.lineas_detalle.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="px-4 py-3 text-sm">{item.item}</td>
                            <td className="px-4 py-3 text-sm">{item.descripcion}</td>
                            <td className="px-4 py-3 text-sm text-center">{item.cantidad}</td>
                            <td className="px-4 py-3 text-sm text-right">{item.precio_unitario.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-right">{item.subtotal.toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                            No hay líneas de detalle disponibles
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'attachments' && (
                <div className="space-y-3">
                  {adjuntos.length > 0 ? (
                    adjuntos.map((adj) => (
                      <div
                        key={adj.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-blue-600" size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{adj.nombre_archivo}</p>
                            <p className="text-xs text-gray-500">
                              {adj.tipo_archivo} · {(adj.tamano_bytes / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          icon={Download}
                          onClick={() => window.open(adj.url_storage, '_blank')}
                        >
                          Ver
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No hay adjuntos disponibles
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'conciliation' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Resultados de Conciliación</h3>
                  {conciliaciones && conciliaciones.length > 0 ? (
                    conciliaciones.map((conc) => (
                      <div
                        key={conc.id}
                        className={`p-4 rounded-lg ${
                          conc.estado === 'EXITOSA' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <p className="text-sm font-medium">
                          Estado: {conc.estado}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{conc.mensaje}</p>
                        {conc.discrepancias && conc.discrepancias.length > 0 && (
                          <ul className="mt-2 text-sm text-red-600">
                            {conc.discrepancias.map((disc, idx) => (
                              <li key={idx}>• {disc}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                      No se ha ejecutado ninguna conciliación aún
                    </div>
                  )}

                  <h3 className="font-bold text-gray-900 mt-6">Trazabilidad</h3>
                  {trazabilidad && trazabilidad.length > 0 ? (
                    trazabilidad.map((log) => (
                      <div key={log.id} className="p-3 bg-gray-50 rounded-lg text-sm border border-gray-200">
                        <p className="font-medium">{log.accion}</p>
                        <p className="text-gray-600">{log.detalles}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(log.timestamp).toLocaleString('es-PE')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                      No hay registros de trazabilidad disponibles
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Actions */}
            <div className="col-span-4 space-y-4">
              {/* Info Card */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-bold text-blue-900 mb-2">ℹ️ Información</h3>
                <p className="text-xs text-blue-700">
                  <strong>Estado actual:</strong> {factura.estado}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  <strong>Versión:</strong> {factura.version}
                </p>
                {!esUltimaVersion && (
                  <p className="text-xs text-orange-600 mt-2">
                    ⚠️ Esta es una versión anterior (solo lectura)
                  </p>
                )}
              </div>

              {/* Edit Actions */}
              {puedeEditar && (
                <div className="space-y-2">
                  {editMode ? (
                    <>
                      <Button variant="primary" fullWidth onClick={handleSaveEdit}>
                        💾 Guardar Cambios
                      </Button>
                      <Button variant="secondary" fullWidth onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button variant="secondary" fullWidth onClick={handleEdit}>
                      ✏️ Editar
                    </Button>
                  )}
                </div>
              )}
              
              {/* Conciliar - Solo en BORRADOR */}
              {factura.estado === 'BORRADOR' && (
                <Button variant="primary" fullWidth onClick={handleConciliate}>
                  🔄 Conciliar
                </Button>
              )}

              {/* Enviar a CxP - Solo en APROBADA */}
              {puedeEnviarCxP && (
                <Button variant="primary" fullWidth onClick={handleSendToCxP}>
                  📤 Enviar a CxP
                </Button>
              )}

              {/* Info sobre estados */}
              <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                <p className="font-semibold mb-2">Estados de factura:</p>
                <ul className="space-y-1">
                  <li>• <strong>BORRADOR:</strong> Editable, puede conciliar</li>
                  <li>• <strong>EN_CONCILIACION:</strong> Conciliación fallida</li>
                  <li>• <strong>APROBADA:</strong> Lista para CxP</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;