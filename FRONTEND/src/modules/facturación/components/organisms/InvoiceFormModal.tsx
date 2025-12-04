import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import Button from '../atoms/Button';
import FileUploader from '../molecules/FileUploader';
import Spinner from '../atoms/Spinner';
import { crearFacturaManual, crearFacturaPrellenado } from '../../services/api';

interface InvoiceFormModalProps {
  onClose: () => void;
  onSuccess: (facturaId: string) => void;
}

const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    proveedor_nombre: '',
    proveedor_ruc: '',
    moneda: 'PEN',
    orden_compra_id: '',
    serie: 'F001',
    numero: '',
    fecha_emision: '',
    fecha_vencimiento: '',
    sub_total: '',
    igv: '',
    total: ''
  });

  const handleManualSubmit = async () => {
    try {
      setLoading(true);
      const response = await crearFacturaManual({
        ...formData,
        sub_total: parseFloat(formData.sub_total) || 0,
        igv: parseFloat(formData.igv) || 0,
        total: parseFloat(formData.total) || 0
      });
      onSuccess(response.id);
    } catch (error) {
      console.error('Error creando factura:', error);
      alert('Error al crear la factura');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo');
      return;
    }

    try {
      setLoading(true);
      const response = await crearFacturaPrellenado(selectedFile);
      alert('¡Factura creada exitosamente con prellenado automático!');
      onSuccess(response.id);
    } catch (error) {
      console.error('Error en prellenado:', error);
      alert('Error al procesar el archivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Registrar Factura</h2>
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
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6">
                  <Input
                    label="Proveedor"
                    value={formData.proveedor_nombre}
                    onChange={(e) => setFormData({ ...formData, proveedor_nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    label="RUC"
                    value={formData.proveedor_ruc}
                    onChange={(e) => setFormData({ ...formData, proveedor_ruc: e.target.value })}
                  />
                </div>

                <div className="col-span-3">
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
                <div className="col-span-3">
                  <Input
                    label="Serie"
                    value={formData.serie}
                    onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    label="Número"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    label="OC (opcional)"
                    value={formData.orden_compra_id}
                    onChange={(e) => setFormData({ ...formData, orden_compra_id: e.target.value })}
                    placeholder="ID de OC"
                  />
                </div>

                <div className="col-span-6">
                  <Input
                    label="Fecha Emisión"
                    type="date"
                    value={formData.fecha_emision}
                    onChange={(e) => setFormData({ ...formData, fecha_emision: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    label="Fecha Vencimiento"
                    type="date"
                    value={formData.fecha_vencimiento}
                    onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
                    required
                  />
                </div>

                <div className="col-span-4">
                  <Input
                    label="Sub Total"
                    type="number"
                    value={formData.sub_total}
                    onChange={(e) => setFormData({ ...formData, sub_total: e.target.value })}
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    label="IGV"
                    type="number"
                    value={formData.igv}
                    onChange={(e) => setFormData({ ...formData, igv: e.target.value })}
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    label="Total"
                    type="number"
                    value={formData.total}
                    onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6">
                <Button variant="secondary" onClick={onClose}>
                  Cancelar
                </Button>
                <Button onClick={handleManualSubmit} loading={loading}>
                  Guardar
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
                <Button variant="secondary" onClick={onClose}>
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
  );
};

export default InvoiceFormModal;