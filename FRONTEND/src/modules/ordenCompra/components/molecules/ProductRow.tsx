import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import type { ItemType } from '../../lib/types';

interface ProductRowProps {
  item: ItemType;
  currency: string;
  onChange: (id: string, field: keyof ItemType, value: string | number) => void;
  onDelete: (id: string) => void;
  calculateSubtotal: (quantity: number, unitPrice: number) => number;
  isReadOnly?: boolean;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  item,
  currency,
  onChange,
  onDelete,
  calculateSubtotal,
  isReadOnly = false
}) => {
  const subtotal = calculateSubtotal(item.quantity, item.unitPrice);
  const symbol = currency === 'USD' ? '$' : 'S/.';

  // Modo solo lectura (para Licitaciones)
  if (isReadOnly) {
    return (
      <div className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-200">
        <div className="col-span-5">
          <p className="font-medium text-gray-900">{item.name || 'Producto sin nombre'}</p>
          {item.description && (
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          )}
        </div>
        <div className="col-span-2">
          <p className="text-gray-900">{item.quantity}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-900">{symbol} {item.unitPrice.toFixed(2)}</p>
        </div>
        <div className="col-span-2">
          <div className="flex items-center h-10 px-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">
              {symbol} {subtotal.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="col-span-1"></div>
      </div>
    );
  }

  // Modo editable (para RFQ y Directa)
  return (
    <div className="grid grid-cols-12 gap-4 items-start py-3 border-b border-gray-200">
      {/* Nombre del Producto */}
      <div className="col-span-5">
        <Input
          placeholder="Nombre del producto o servicio"
          value={item.name}
          onChange={(e) => onChange(item.id, 'name', e.target.value)}
          className="w-full"
        />
        <Input
          placeholder="Descripción adicional"
          value={item.description}
          onChange={(e) => onChange(item.id, 'description', e.target.value)}
          className="w-full mt-2"
        />
      </div>

      {/* Cantidad */}
      <div className="col-span-2">
        <Input
          type="number"
          min="1"
          value={item.quantity === 0 ? '' : item.quantity}
          onChange={(e) => {
            const value = e.target.value;
            const numericValue = value === '' ? 0 : parseInt(value) || 0;
            onChange(item.id, 'quantity', numericValue);
          }}
          className="w-full"
        />
      </div>

      {/* Precio Unitario */}
      <div className="col-span-2">
        <div className="relative">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={item.unitPrice === 0 ? '' : item.unitPrice}
            onChange={(e) => {
              const value = e.target.value;
              const numericValue = value === '' ? 0 : parseFloat(value);
              onChange(item.id, 'unitPrice', numericValue);
            }}
            className="w-full pl-8"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {symbol}
          </span>
        </div>
      </div>

      {/* Subtotal */}
      <div className="col-span-2">
        <div className="flex items-center h-10 px-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-900">
            {symbol} {subtotal.toLocaleString('es-ES', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="col-span-1 flex justify-end">
        <Button
          variant="danger"
          size="sm"
          icon={Trash2}
          onClick={() => onDelete(item.id)}
          className="px-3 py-1"
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
};