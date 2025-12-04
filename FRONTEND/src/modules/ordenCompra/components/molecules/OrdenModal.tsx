import React from 'react';
import { 
  X, FileText, User, Calendar, DollarSign,
  CreditCard, Truck
} from 'lucide-react';
import { Button } from '../atoms/Button';
import type { ItemType, ProveedorType } from '../../lib/types';



interface OrdenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  
  title: string;
  notes: string;

  orderType: 'RFQ' | 'LICITACION' | 'DIRECTA';
  currency: 'USD' | 'PEN';

  items: ItemType[];
  totalAmount: number;

  supplier: ProveedorType | null;

  expectedDelivery: string;
  paymentMode: 'CONTADO' | 'TRANSFERENCIA' | 'CREDITO';
  paymentDays: number;
  deliveryTerms: string;

  solicitudId?: string;
  notificacionInventarioId?: string;
}

export const OrdenModal: React.FC<OrdenModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  notes,
  orderType,
  currency,
  items,
  totalAmount,
  supplier,
  expectedDelivery,
  paymentMode,
  paymentDays,
  deliveryTerms,
  solicitudId,
  notificacionInventarioId
}) => {

  if (!isOpen) return null;

  const symbol = currency === 'USD' ? '$' : 'S/.';

  // Map etiquetas del tipo de orden
  const getOrderTypeLabel = () => ({
    RFQ: 'Compra Simple (RFQ)',
    LICITACION: 'Licitación con Contrato',
    DIRECTA: 'Compra Directa por Inventario'
  }[orderType]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isReadOnly = orderType === 'LICITACION';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Confirmar Orden de Compra</h2>
            <p className="text-gray-600 mt-1">Revise los detalles antes de generar la orden</p>
          </div>

          <Button
            variant="secondary"
            icon={X}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            Cerrar
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Información General */}
          <div className="grid grid-cols-2 gap-6">
            
            {/* Título */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" /><span>Título:</span>
              </div>
              <p className="font-medium text-gray-900">{title || 'Sin título'}</p>
            </div>

            {/* Tipo */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" /><span>Tipo:</span>
              </div>
              <p className="font-medium text-gray-900">{getOrderTypeLabel()}</p>
            </div>

            {/* Proveedor */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" /><span>Proveedor:</span>
              </div>
              <p className="font-medium text-gray-900">
                {supplier?.name || (orderType === 'DIRECTA' ? 'Proveedor no requerido' : 'No seleccionado')}
              </p>
              {supplier?.contact && (
                <p className="text-sm text-gray-600">{supplier.contact}</p>
              )}
            </div>

            {/* Entrega esperada */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" /><span>Entrega esperada:</span>
              </div>
              <p className="font-medium text-gray-900">{formatDate(expectedDelivery)}</p>
            </div>
          </div>

          {/* Notas */}
          {notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Notas Adicionales</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{notes}</p>
            </div>
          )}

          {/* Condiciones */}
          <div className="grid grid-cols-2 gap-6">
            
            {/* Pago */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CreditCard className="w-4 h-4" /><span>Condiciones de Pago:</span>
              </div>
              <p className="font-medium text-gray-900">
                {
                  paymentMode === 'CONTADO'
                    ? 'Al Contado'
                    : paymentMode === 'TRANSFERENCIA'
                      ? 'Transferencia'
                      : 'Crédito'
                }
                {paymentMode !== 'CONTADO' && ` - ${paymentDays} días`}
              </p>
            </div>

            {/* Entrega */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" /><span>Términos de Entrega:</span>
              </div>
              <p className="font-medium text-gray-900">{deliveryTerms || 'No especificado'}</p>
            </div>

          </div>

          {/* Referencias */}
          {(solicitudId || notificacionInventarioId) && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Referencias del Origen:</p>
              
              {solicitudId && (
                <p className="text-sm text-blue-700 mt-1">
                  Solicitud o Contrato: {solicitudId}
                </p>
              )}

              {notificacionInventarioId && (
                <p className="text-sm text-blue-700 mt-1">
                  Notificación de Inventario: {notificacionInventarioId}
                </p>
              )}
            </div>
          )}

          {/* Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos/Servicios</h3>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                  
                  <div>
                    <p className="font-medium text-gray-900">
                      {index + 1}. {item.name || 'Ítem sin nombre'}
                    </p>

                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}

                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>Cantidad: {item.quantity}</span>
                      <span>Precio: {symbol}{item.unitPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="font-semibold text-gray-900">
                    {symbol}{(item.quantity * item.unitPrice).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <DollarSign className="w-5 h-5" />
                Total de la Orden:
              </span>

              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {symbol}{totalAmount.toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <p className="text-sm text-gray-600 mt-1">{items.length} ítems</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end p-6 border-t border-gray-200 bg-gray-50">

          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>

          <Button variant="primary" onClick={onConfirm}>
            Confirmar y Generar Orden
          </Button>


        </div>
      </div>
    </div>
  );
};
