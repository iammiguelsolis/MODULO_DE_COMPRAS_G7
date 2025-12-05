import React, { useState, useEffect } from 'react';
import { X, FileText, Download, Upload, Trash2 } from 'lucide-react';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import Spinner from '../atoms/Spinner';
import NotificationModal from '../molecules/NotificationModal';
import {
  type FacturaDetalle,
  type FacturaProveedor,
  type LineaDetalle,
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
  listarFacturas,
  subirAdjunto,
  eliminarAdjunto,
  obtenerProveedores
} from '../../services/api';
import type { Proveedor } from '../../../../services/proveedor/types';


// Helper function para convertir fecha a formato yyyy-MM-dd
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [activeTab, setActiveTab] = useState<'general' | 'items' | 'attachments' | 'conciliation'>('general');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    numeroFactura: '',
    proveedorId: 0,
    fechaEmision: '',
    fechaVencimiento: '',
    moneda: 'PEN',
    ordenCompraId: '',
    lineas: [] as LineaDetalle[],
    proveedorNombre: '',
    proveedorRuc: '',
  });

  // Notification state
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    onCloseAction?: () => void;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
    if (notification.onCloseAction) {
      notification.onCloseAction();
    }
  };

  useEffect(() => {
    loadData();
  }, [facturaId]);

  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        const data = await obtenerProveedores();
        setProveedores(data);
      } catch (error) {
        console.error('Error cargando proveedores:', error);
        setNotification({
          isOpen: true,
          type: 'error',
          title: 'Error',
          message: 'No se pudieron cargar los proveedores.'
        });
      }
    };
    cargarProveedores();
  }, []);

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

      const proveedor = proveedores.find(p => p.id === facturaData.proveedor_id);

      console.log(proveedor?.razonSocial)
      console.log(proveedor?.ruc)

      // Obtener todas las versiones de esta factura
      const todasFacturas = await listarFacturas();
      const versiones = todasFacturas
        .filter(f => f.numero_factura === facturaData.numero_factura)
        .sort((a, b) => b.version - a.version); // Ordenar de mayor a menor

      setTodasLasVersiones(versiones);
      setFactura({...facturaData,
        proveedor_nombre: proveedor?.razonSocial || '',
        proveedor_ruc: proveedor?.ruc || '',
      });
      setEditData({
        numeroFactura: facturaData.numero_factura,
        proveedorId: facturaData.proveedor_id || 0,
        fechaEmision: formatDateForInput(facturaData.fecha_emision),
        fechaVencimiento: formatDateForInput(facturaData.fecha_vencimiento || ''),
        moneda: facturaData.moneda,
        ordenCompraId: facturaData.orden_compra_id || '',
        lineas: facturaData.lineas || [],
        proveedorNombre: facturaData.proveedor_nombre || proveedor?.razonSocial || '',
        proveedorRuc: facturaData.proveedor_ruc || proveedor?.ruc || '',
      });

      // Cargar datos adicionales
      await loadVersionData(facturaId);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setNotification({
        isOpen: true,
        type: 'error',
        title: '❌ Error',
        message: 'No se pudieron cargar los detalles de la factura.'
      });
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
      setEditData({
        numeroFactura: facturaData.numero_factura,
        proveedorId: facturaData.proveedor_id || 0,
        fechaEmision: formatDateForInput(facturaData.fecha_emision),
        fechaVencimiento: formatDateForInput(facturaData.fecha_vencimiento || ''),
        moneda: facturaData.moneda,
        ordenCompraId: facturaData.orden_compra_id || '',
        lineas: facturaData.lineas || [],
        proveedorNombre: facturaData.proveedor_nombre || '',
        proveedorRuc: facturaData.proveedor_ruc || '',
      });
    } catch (error) {
      console.error('Error cargando versión:', error);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    if (factura) {
      setEditData({
        numeroFactura: factura.numero_factura,
        proveedorId: factura.proveedor_id || 0,
        fechaEmision: factura.fecha_emision,
        fechaVencimiento: factura.fecha_vencimiento || '',
        moneda: factura.moneda,
        ordenCompraId: factura.orden_compra_id || '',
        lineas: factura.lineas || [],
        proveedorNombre: factura.proveedor_nombre || '',
        proveedorRuc: factura.proveedor_ruc || '',
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!factura) return;
    
    try {
      // Preparar datos para enviar
      const dataToSend = {
        numeroFactura: editData.numeroFactura,
        proveedorId: editData.proveedorId,
        fechaEmision: editData.fechaEmision,
        fechaVencimiento: editData.fechaVencimiento,
        moneda: editData.moneda,
        ordenCompraId: editData.ordenCompraId,
        lineas: editData.lineas.map(linea => ({
          descripcion: linea.descripcion,
          cantidad: linea.cantidad,
          precioUnitario: linea.precio_unitario,
          impuestosLinea: linea.impuestos_linea,
          totalLinea: linea.total_linea
        }))
      };

      await actualizarFactura(factura.id, dataToSend);
      setNotification({
        isOpen: true,
        type: 'success',
        title: '✅ Actualización Exitosa',
        message: 'Los datos de la factura han sido actualizados correctamente.'
      });
      setEditMode(false);
      loadData();
      onRefresh();
    } catch (error) {
      console.error('Error actualizando:', error);
      setNotification({
        isOpen: true,
        type: 'error',
        title: '❌ Error',
        message: 'No se pudo actualizar la factura. Intente nuevamente.'
      });
    }
  };

  const handleConciliate = async () => {
    if (!factura) return;

    if (!editData.ordenCompraId) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: '⚠️ OC Requerida',
        message: 'Por favor ingrese el ID de Orden de Compra antes de conciliar. Use el botón Editar para agregar esta información.'
      });
      setEditMode(true);
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: '🔄 Confirmar Conciliación',
      message: '¿Está seguro de ejecutar la conciliación?\n\nSi la conciliación falla:\n• Esta factura pasará a estado EN_CONCILIACION\n• Se creará una nueva versión en estado BORRADOR',
      onConfirm: async () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        
        try {
          setLoading(true);
          const result = await ejecutarConciliacion(factura.id, editData.ordenCompraId);
          
          if (result.resultado === 'CON_DISCREPANCIA' || result.resultado === 'ERROR_ESTADO') {
            setNotification({
              isOpen: true,
              type: 'error',
              title: '❌ Conciliación Fallida',
              message: `Motivo: ${result.mensaje}\n\nSe ha creado una nueva versión (v${factura.version + 1}) en estado BORRADOR. La versión actual pasó a EN_CONCILIACION.`,
              onCloseAction: () => {
                onRefresh();
                loadData();
              }
            });
          } else {
            setNotification({
              isOpen: true,
              type: 'success',
              title: '✅ Conciliación Exitosa',
              message: 'La factura ha sido conciliada correctamente y ahora está APROBADA.',
              onCloseAction: () => {
                loadData();
                onRefresh();
              }
            });
          }
        } catch (error) {
          console.error('Error en conciliación:', error);
          setNotification({
            isOpen: true,
            type: 'error',
            title: '❌ Error',
            message: 'Ocurrió un error al ejecutar la conciliación.'
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleSendToCxP = async () => {
    if (!factura) return;

    if (factura.estado !== 'APROBADA') {
      setNotification({
        isOpen: true,
        type: 'error',
        title: '⚠️ Estado Inválido',
        message: 'Solo se pueden enviar facturas APROBADAS a Cuentas por Pagar.'
      });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: '📤 Enviar a CxP',
      message: '¿Confirma el envío de esta factura a Cuentas por Pagar?',
      onConfirm: async () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        
        try {
          setLoading(true);
          await enviarACuentasPorPagar(factura.id);
          setNotification({
            isOpen: true,
            type: 'success',
            title: '✅ Enviado a CxP',
            message: 'La factura ha sido enviada exitosamente a Cuentas por Pagar.',
            onCloseAction: () => {
              loadData();
              onRefresh();
            }
          });
        } catch (error) {
          console.error('Error enviando a CxP:', error);
          setNotification({
            isOpen: true,
            type: 'error',
            title: '❌ Error',
            message: 'Ocurrió un error al enviar la factura a Cuentas por Pagar.'
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!factura || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    try {
      setLoading(true);
      await subirAdjunto(factura.id, file);
      setNotification({
        isOpen: true,
        type: 'success',
        title: '✅ Adjunto Subido',
        message: 'El archivo se ha subido correctamente.'
      });
      // Recargar adjuntos
      const adjuntosData = await listarAdjuntos(factura.id);
      setAdjuntos(adjuntosData);
    } catch (error) {
      console.error('Error subiendo adjunto:', error);
      setNotification({
        isOpen: true,
        type: 'error',
        title: '❌ Error',
        message: 'No se pudo subir el archivo. Intente nuevamente.'
      });
    } finally {
      setLoading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDeleteAttachment = async (adjuntoId: string) => {
    if (!factura) return;

    setConfirmModal({
      isOpen: true,
      title: '🗑️ Eliminar Adjunto',
      message: '¿Está seguro de eliminar este adjunto? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        
        try {
          setLoading(true);
          await eliminarAdjunto(factura.id, adjuntoId);
          setNotification({
            isOpen: true,
            type: 'success',
            title: '✅ Adjunto Eliminado',
            message: 'El adjunto ha sido eliminado correctamente.'
          });
          // Recargar adjuntos
          const adjuntosData = await listarAdjuntos(factura.id);
          setAdjuntos(adjuntosData);
        } catch (error) {
          console.error('Error eliminando adjunto:', error);
          setNotification({
            isOpen: true,
            type: 'error',
            title: '❌ Error',
            message: 'No se pudo eliminar el adjunto. Intente nuevamente.'
          });
        } finally {
          setLoading(false);
        }
      }
    });
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
                      label="Número de Factura"
                      value={editMode ? editData.numeroFactura : factura.numero_factura}
                      onChange={(e) => setEditData({ ...editData, numeroFactura: e.target.value })}
                      disabled={!editMode}
                    />
                    <Select
                      label="Proveedor"
                      value={editMode ? editData.proveedorId.toString() : (factura.proveedor_id?.toString() || '0')}
                      onChange={(e) => {
                        const proveedorId = parseInt(e.target.value);
                        const proveedorSeleccionado = proveedores.find(p => p.id === proveedorId);
                        setEditData({ 
                          ...editData, 
                          proveedorId,
                          proveedorNombre: proveedorSeleccionado?.razonSocial || '',  // ← AGREGAR
                          proveedorRuc: proveedorSeleccionado?.ruc || ''              // ← AGREGAR
                        });
                      }}
                      disabled={!editMode}
                      options={[
                        { value: '0', label: 'Seleccione un proveedor' },
                        ...proveedores.map(p => ({
                          value: p.id.toString(),
                          label: `${p.id} - ${p.razonSocial}`
                        }))
                      ]}
                      required
                    />
                    <Input
                      label="Proveedor Nombre"
                      value={editMode ? editData.proveedorNombre : factura.proveedor_nombre || ''}
                      onChange={() => {}}
                      disabled
                    />
                    <Input
                      label="RUC"
                      value={editMode ? editData.proveedorRuc : factura.proveedor_ruc || ''}
                      onChange={() => {}}
                      disabled
                    />
                    <Input
                      label="Fecha Emisión"
                      type="date"
                      value={editMode ? editData.fechaEmision : formatDateForInput(factura.fecha_emision)}
                      onChange={(e) => setEditData({ ...editData, fechaEmision: e.target.value })}
                      disabled={!editMode}
                    />
                    <Input
                      label="Fecha Vencimiento"
                      type="date"
                      value={editMode ? editData.fechaVencimiento : formatDateForInput(factura.fecha_vencimiento || '')}
                      onChange={(e) => setEditData({ ...editData, fechaVencimiento: e.target.value })}
                      disabled={!editMode}
                    />
                    <Select
                      value={editMode ? editData.moneda : factura.moneda}
                      onChange={(e) => setEditData({ ...editData, moneda: e.target.value })}
                      disabled={!editMode}
                      options={[
                        { value: 'PEN', label: 'PEN - Soles' },
                        { value: 'USD', label: 'USD - Dólares' }
                      ]}
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
                        value={editMode ? editData.ordenCompraId : (factura.orden_compra_id || '')}
                        onChange={(e) => setEditData({ ...editData, ordenCompraId: e.target.value })}
                        disabled={!editMode}
                        placeholder="Ingrese ID de OC para conciliar"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'items' && (
                <div className="space-y-4">
                  {editMode && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const nuevaLinea: LineaDetalle = {
                          descripcion: '',
                          cantidad: 1,
                          precio_unitario: 0,
                          impuestos_linea: 0,
                          total_linea: 0
                        };
                        setEditData({
                          ...editData,
                          lineas: [...editData.lineas, nuevaLinea]
                        });
                      }}
                    >
                      + Agregar Línea
                    </Button>
                  )}
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Item</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Descripción</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Cant.</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Precio</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Impuestos</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Total</th>
                          {editMode && <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Acciones</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {(editMode ? editData.lineas : factura.lineas || []).map((item: LineaDetalle, index: number) => (
                          <tr key={item.id || index} className="border-t">
                            <td className="px-4 py-3 text-sm">{index + 1}</td>
                            <td className="px-4 py-3">
                              {editMode ? (
                                <input
                                  type="text"
                                  value={item.descripcion}
                                  onChange={(e) => {
                                    const newLineas = [...editData.lineas];
                                    newLineas[index].descripcion = e.target.value;
                                    setEditData({ ...editData, lineas: newLineas });
                                  }}
                                  className="w-full px-2 py-1 border rounded"
                                />
                              ) : (
                                <span className="text-sm">{item.descripcion}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {editMode ? (
                                <input
                                  type="number"
                                  value={item.cantidad}
                                  onChange={(e) => {
                                    const newLineas = [...editData.lineas];
                                    newLineas[index].cantidad = parseFloat(e.target.value) || 0;
                                    newLineas[index].total_linea = 
                                      newLineas[index].cantidad * newLineas[index].precio_unitario + 
                                      newLineas[index].impuestos_linea;
                                    setEditData({ ...editData, lineas: newLineas });
                                  }}
                                  className="w-20 px-2 py-1 border rounded text-center"
                                />
                              ) : (
                                <span className="text-sm">{item.cantidad}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {editMode ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.precio_unitario}
                                  onChange={(e) => {
                                    const newLineas = [...editData.lineas];
                                    newLineas[index].precio_unitario = parseFloat(e.target.value) || 0;
                                    newLineas[index].total_linea = 
                                      newLineas[index].cantidad * newLineas[index].precio_unitario + 
                                      newLineas[index].impuestos_linea;
                                    setEditData({ ...editData, lineas: newLineas });
                                  }}
                                  className="w-24 px-2 py-1 border rounded text-right"
                                />
                              ) : (
                                <span className="text-sm">{item.precio_unitario.toFixed(2)}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {editMode ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.impuestos_linea}
                                  onChange={(e) => {
                                    const newLineas = [...editData.lineas];
                                    newLineas[index].impuestos_linea = parseFloat(e.target.value) || 0;
                                    newLineas[index].total_linea = 
                                      newLineas[index].cantidad * newLineas[index].precio_unitario + 
                                      newLineas[index].impuestos_linea;
                                    setEditData({ ...editData, lineas: newLineas });
                                  }}
                                  className="w-24 px-2 py-1 border rounded text-right"
                                />
                              ) : (
                                <span className="text-sm">{item.impuestos_linea.toFixed(2)}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">{item.total_linea.toFixed(2)}</td>
                            {editMode && (
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => {
                                    const newLineas = editData.lineas.filter((_, i) => i !== index);
                                    setEditData({ ...editData, lineas: newLineas });
                                  }}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  🗑️
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                        {(editMode ? editData.lineas : factura.lineas || []).length === 0 && (
                          <tr>
                            <td colSpan={editMode ? 7 : 6} className="px-4 py-8 text-center text-gray-500">
                              No hay líneas de detalle disponibles
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'attachments' && (
                <div className="space-y-3">
                  {/* Upload button - only for draft invoices */}
                  {puedeEditar && (
                    <div className="mb-4">
                      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                        <Upload size={20} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Subir Adjunto</span>
                        <input
                          type="file"
                          accept=".pdf,.xml"
                          onChange={handleUploadAttachment}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2 text-center">Formatos aceptados: PDF, XML</p>
                    </div>
                  )}
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
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            icon={Download}
                            onClick={() => window.open(adj.url_storage, '_blank')}
                          >
                            Ver
                          </Button>
                          {puedeEditar && (
                            <button
                              onClick={() => handleDeleteAttachment(adj.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar adjunto"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
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
                          conc.resultado === 'EXITOSA' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <p className="text-sm font-medium">
                          Estado: {conc.resultado}
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

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{confirmModal.title}</h3>
              <p className="text-gray-600 whitespace-pre-line mb-6">{confirmModal.message}</p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                >
                  Cancelar
                </Button>
                <Button variant="primary" onClick={confirmModal.onConfirm}>
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailModal;