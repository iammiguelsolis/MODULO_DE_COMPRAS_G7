import React from 'react';
import { FileText, User, Package } from 'lucide-react';
import { Button } from '../atoms/Button';

interface SummaryCardProps {
  totalAmount: number;
  currency: string;
  orderType: 'RFQ' | 'LICITACION' | 'DIRECTA';
  itemsCount: number;
  supplierName?: string;
  onCreateOrder: () => void;
  isDisabled?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  totalAmount,
  currency,
  orderType,
  itemsCount,
  supplierName,
  onCreateOrder,
  isDisabled = false
}) => {
  const symbol = currency === 'USD' ? '$' : 'S/.';
  
  const getOrderTypeInfo = () => {
    switch (orderType) {
      case 'RFQ':
        return {
          label: 'Compra Simple (RFQ)',
          description: 'Orden generada desde cotización simple con proveedor ganador.',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'LICITACION':
        return {
          label: 'Licitación',
          description: 'Orden vinculada a contrato aprobado. Información de solo lectura.',
          color: 'bg-purple-100 text-purple-800'
        };
      case 'DIRECTA':
        return {
          label: 'Compra Directa',
          description: 'Orden automática para reabastecimiento de inventario.',
          color: 'bg-green-100 text-green-800'
        };
      default:
        return { label: '', description: '', color: '' };
    }
  };

  const orderTypeInfo = getOrderTypeInfo();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de Orden</h2>
      
      {/* Información de la Orden */}
      <div className="space-y-4 mb-6">
        {/* Tipo de Orden */}
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Tipo de Orden</p>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-lg mt-1 ${orderTypeInfo.color}`}>
              {orderTypeInfo.label}
            </span>
            <p className="text-xs text-gray-600 mt-1">
              {orderTypeInfo.description}
            </p>
          </div>
        </div>

        {/* Proveedor */}
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Proveedor</p>
            <p className="text-sm text-gray-900 mt-1">
              {supplierName || 'No seleccionado'}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Productos/Servicios</p>
            <p className="text-sm text-gray-900 mt-1">
              {itemsCount} {itemsCount === 1 ? 'ítem' : 'ítems'}
            </p>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            {symbol} {totalAmount.toLocaleString('es-ES', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </span>
        </div>
        
        {/* Estado basado en el monto */}
        {totalAmount > 0 && (
          <div className={`text-xs px-2 py-1 rounded-lg text-center mt-2 ${
            totalAmount >= 5000 
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
              : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            {totalAmount >= 5000 
              ? '⚠️ Requiere aprobación adicional' 
              : '✅ Listo para procesar'
            }
          </div>
        )}
      </div>

      {/* Botón de Crear Orden */}
      <Button
        variant="primary"
        onClick={onCreateOrder}
        disabled={isDisabled}
        className="w-full justify-center"
      >
        Generar Orden de Compra
      </Button>

      {/* Validaciones */}
      {isDisabled && (
        <div className="mt-3 p-3 bg-pink-50 border border-pink-200 rounded-lg">
          <p className="text-xs text-pink-700 text-center">
            {!supplierName && itemsCount === 0 && 'Seleccione un proveedor y agregue productos'}
            {!supplierName && itemsCount > 0 && 'Seleccione un proveedor'}
            {supplierName && itemsCount === 0 && 'Agregue al menos un producto'}
          </p>
        </div>
      )}
    </div>
  );
};