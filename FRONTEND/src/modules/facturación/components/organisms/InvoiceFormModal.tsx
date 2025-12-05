import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import Button from '../atoms/Button';
import FileUploader from '../molecules/FileUploader';
import Spinner from '../atoms/Spinner';
import NotificationModal from '../molecules/NotificationModal';
import { crearFacturaManual, crearFacturaPrellenado, obtenerProveedores } from '../../services/api';
import type { Proveedor } from '../../../../services/proveedor/types';

interface InvoiceFormModalProps {
  onClose: () => void;
  onSuccess: (facturaId: string) => void;
}

interface LineaDetalle {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  impuestosLinea: number;
  totalLinea: number;
}

const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
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

  // Notification State
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

  const [formData, setFormData] = useState({
    numeroFactura: '',
    proveedorId: '',
    fechaEmision: '',
    fechaVencimiento: '',
    moneda: 'PEN',
    ordenCompraId: ''
  });

  // Líneas de detalle
  const [lineas, setLineas] = useState<LineaDetalle[]>([
    {
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      impuestosLinea: 0,
      totalLinea: 0
    }
  ]);

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
    if (notification.onCloseAction) {
      notification.onCloseAction();
    }
  };

  const calcularTotalLinea = (cantidad: number, precioUnitario: number, impuestosLinea: number): number => {
    return (cantidad * precioUnitario) + impuestosLinea;
  };

  const handleLineaChange = (index: number, field: keyof LineaDetalle, value: string | number) => {
    const nuevasLineas = [...lineas];
    nuevasLineas[index] = {
      ...nuevasLineas[index],
      [field]: value
    };

    // Recalcular total de la línea
    if (field === 'cantidad' || field === 'precioUnitario' || field === 'impuestosLinea') {
      nuevasLineas[index].totalLinea = calcularTotalLinea(
        nuevasLineas[index].cantidad,
        nuevasLineas[index].precioUnitario,
        nuevasLineas[index].impuestosLinea
      );
    }

    setLineas(nuevasLineas);
  };

  const agregarLinea = () => {
    setLineas([
      ...lineas,
      {
        descripcion: '',
        cantidad: 1,
        precioUnitario: 0,
        impuestosLinea: 0,
        totalLinea: 0
      }
    ]);
  };

  const eliminarLinea = (index: number) => {
    if (lineas.length === 1) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Debe haber al menos una línea de detalle.'
      });
      return;
    }
    setLineas(lineas.filter((_, i) => i !== index));
  };

  const validarFormulario = (): boolean => {
    if (!formData.numeroFactura || !formData.proveedorId || !formData.fechaEmision || !formData.fechaVencimiento) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Campos Requeridos',
        message: 'Por favor complete todos los campos obligatorios.'
      });
      return false;
    }

    if (lineas.some(l => !l.descripcion || l.cantidad <= 0 || l.precioUnitario <= 0)) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Líneas Incompletas',
        message: 'Todas las líneas deben tener descripción, cantidad y precio válidos.'
      });
      return false;
    }

    return true;
  };

  const handleManualSubmit = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      
      const payload = {
        numeroFactura: formData.numeroFactura,
        proveedorId: parseInt(formData.proveedorId),
        fechaEmision: formData.fechaEmision,
        fechaVencimiento: formData.fechaVencimiento,
        moneda: formData.moneda,
        ordenCompraId: formData.ordenCompraId || undefined,
        lineas: lineas.map(l => ({
          descripcion: l.descripcion,
          cantidad: l.cantidad,
          precioUnitario: l.precioUnitario,
          impuestosLinea: l.impuestosLinea,
          totalLinea: l.totalLinea
        }))
      };

      const response = await crearFacturaManual(payload);
      
      setNotification({
        isOpen: true,
        type: 'success',
        title: '✅ Factura Creada',
        message: `La factura ${formData.numeroFactura} ha sido registrada exitosamente.`,
        onCloseAction: () => onSuccess(response.id)
      });
      
    } catch (error: any) {
      console.error('Error creando factura:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Ocurrió un error al crear la factura.';
      setNotification({
        isOpen: true,
        type: 'error',
        title: '❌ Error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = async () => {
    if (!selectedFile) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Archivo Requerido',
        message: 'Por favor selecciona un archivo PDF o XML para continuar.'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await crearFacturaPrellenado(selectedFile);
      
      setNotification({
        isOpen: true,
        type: 'success',
        title: '✅ Prellenado Exitoso',
        message: 'La factura ha sido creada y prellenada automáticamente desde el archivo.',
        onCloseAction: () => onSuccess(response.id)
      });
      
    } catch (error: any) {
      console.error('Error en prellenado:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error al procesar el archivo.';
      setNotification({
        isOpen: true,
        type: 'error',
        title: '❌ Error de Procesamiento',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcular totales generales
  const subTotal = lineas.reduce((sum, l) => sum + (l.cantidad * l.precioUnitario), 0);
  const totalImpuestos = lineas.reduce((sum, l) => sum + l.impuestosLinea, 0);
  const total = lineas.reduce((sum, l) => sum + l.totalLinea, 0);

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Registrar Nueva Factura</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={mode === 'manual' ? 'primary' : 'outline'}
                onClick={() => setMode('manual')}
              >
                Ingreso Manual
              </Button>
              <Button
                variant={mode === 'auto' ? 'primary' : 'outline'}
                onClick={() => setMode('auto')}
              >
                Prellenado Automático
              </Button>
            </div>

            {mode === 'manual' ? (
              <>
                {/* Manual Form */}
                <div className="space-y-6">
                  {/* Datos Básicos */}
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                      <Input
                        label="Número de Factura"
                        value={formData.numeroFactura}
                        onChange={(e) => setFormData({ ...formData, numeroFactura: e.target.value })}
                        placeholder="F001-000123"
                        required
                      />
                    </div>
                    <div className="col-span-4">
                      <Select
                        label="Proveedor"
                        value={formData.proveedorId}
                        onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
                        options={[
                          { value: '', label: 'Seleccione un proveedor' },
                          ...proveedores.map(p => ({
                            value: p.id.toString(),
                            label: `${p.id} - ${p.razonSocial}`
                          }))
                        ]}
                        required
                      />
                    </div>
                    <div className="col-span-4">
                      <Select
                        label="Moneda"
                        value={formData.moneda}
                        onChange={(e) => setFormData({ ...formData, moneda: e.target.value })}
                        options={[
                          { value: 'PEN', label: 'PEN' },
                          { value: 'USD', label: 'USD' }
                        ]}
                        required
                      />
                    </div>

                    <div className="col-span-4">
                      <Input
                        label="Fecha Emisión"
                        type="date"
                        value={formData.fechaEmision}
                        onChange={(e) => setFormData({ ...formData, fechaEmision: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        label="Fecha Vencimiento"
                        type="date"
                        value={formData.fechaVencimiento}
                        onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        label="OC (opcional)"
                        value={formData.ordenCompraId}
                        onChange={(e) => setFormData({ ...formData, ordenCompraId: e.target.value })}
                        placeholder="ID de OC"
                      />
                    </div>
                  </div>

                  {/* Líneas de Detalle */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Líneas de Detalle</h3>
                      <Button variant="outline" icon={Plus} onClick={agregarLinea}>
                        Agregar Línea
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {lineas.map((linea, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 grid grid-cols-12 gap-3">
                              <div className="col-span-12">
                                <Input
                                  label="Descripción"
                                  value={linea.descripcion}
                                  onChange={(e) => handleLineaChange(index, 'descripcion', e.target.value)}
                                  placeholder="Ej: Laptop HP Pavilion"
                                  required
                                />
                              </div>
                              <div className="col-span-3">
                                <Input
                                  label="Cantidad"
                                  type="number"
                                  value={linea.cantidad.toString()}
                                  onChange={(e) => handleLineaChange(index, 'cantidad', parseFloat(e.target.value) || 0)}
                                  required
                                />
                              </div>
                              <div className="col-span-3">
                                <Input
                                  label="Precio Unitario"
                                  type="number"
                                  value={linea.precioUnitario.toString()}
                                  onChange={(e) => handleLineaChange(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
                                  required
                                />
                              </div>
                              <div className="col-span-3">
                                <Input
                                  label="Impuestos Línea"
                                  type="number"
                                  value={linea.impuestosLinea.toString()}
                                  onChange={(e) => handleLineaChange(index, 'impuestosLinea', parseFloat(e.target.value) || 0)}
                                />
                              </div>
                              <div className="col-span-3">
                                <Input
                                  label="Total Línea"
                                  type="number"
                                  value={linea.totalLinea.toFixed(2)}
                                  onChange={() => {}}
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="pt-6">
                              <Button
                                variant="ghost"
                                icon={Trash2}
                                onClick={() => eliminarLinea(index)} children={undefined}                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totales */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Subtotal</p>
                          <p className="text-lg font-bold text-gray-900">
                            {formData.moneda} {subTotal.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Impuestos</p>
                          <p className="text-lg font-bold text-gray-900">
                            {formData.moneda} {totalImpuestos.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total General</p>
                          <p className="text-xl font-bold text-blue-900">
                            {formData.moneda} {total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                  <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Cancelar
                  </Button>
                  <Button onClick={handleManualSubmit} loading={loading}>
                    Guardar Factura
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Auto Mode */}
                <FileUploader onFileSelect={setSelectedFile} />

                {loading && (
                  <div className="flex flex-col items-center gap-4 mt-8">
                    <Spinner size="lg" />
                    <p className="text-sm text-gray-600">
                      Procesando archivo y extrayendo información...
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-8 pt-6">
                  <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAutoSubmit}
                    loading={loading}
                    disabled={!selectedFile}
                  >
                    Confirmar Prellenado
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </>
  );
};

export default InvoiceFormModal;