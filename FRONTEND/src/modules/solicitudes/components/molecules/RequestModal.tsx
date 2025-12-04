import React from 'react';
import { CheckCircle, FileText, X, AlertCircle } from "lucide-react";
import { Button } from "../atoms/Button";

interface ItemType {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Nuevas props para integración API
  onConfirm: () => void;
  isLoading?: boolean;
  
  // Datos de visualización
  title: string;
  notes: string;
  requestType: 'material' | 'servicio';
  items: ItemType[];
  totalAmount: number;
  purchaseType: string;
}

export const RequestModal: React.FC<RequestModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  notes,
  requestType,
  items,
  totalAmount,
  purchaseType
}) => {
  if (!isOpen) return null;

  const isLicitacion = totalAmount >= 10000;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between ${isLicitacion ? 'bg-orange-600' : 'bg-blue-600'}`}>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2">
              {isLicitacion ? (
                <AlertCircle className="w-6 h-6 text-orange-600" />
              ) : (
                <CheckCircle className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Confirmar Solicitud</h2>
              <p className="text-white/90 text-sm">Verifique los detalles antes de enviar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tipo de Compra/Licitación - Destacado */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Clasificación Automática</p>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-black ${isLicitacion ? 'text-orange-600' : 'text-green-600'}`}>
                  {purchaseType}
                </span>
                <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600 font-medium">
                  {isLicitacion ? '> $10,000' : '< $10,000'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 max-w-md">
                {isLicitacion 
                  ? 'Esta solicitud supera el límite permitido para compra directa. Se iniciará un proceso de licitación.' 
                  : 'Compra simple de bajo monto. Procesamiento rápido.'}
              </p>
            </div>
            <div className="bg-white border rounded-lg px-5 py-3 shadow-sm text-right">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Monto Total</p>
              <p className="text-gray-900 text-2xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Content Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {/* Detalles */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-xs font-bold text-gray-500 uppercase">Título</label>
                <p className="text-gray-900 font-medium text-lg">{title || 'Sin título'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-xs font-bold text-gray-500 uppercase">Tipo</label>
                <p className="text-gray-900 font-medium text-lg capitalize">{requestType}</p>
            </div>
            {notes && (
                <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Notas Adicionales</label>
                    <p className="text-gray-700">{notes}</p>
                </div>
            )}
          </div>

          {/* Tabla de Items */}
          <div className="mb-2">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Detalle de Ítems ({items.length})
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                    <th className="px-4 py-2 text-right font-semibold">Cant.</th>
                    <th className="px-4 py-2 text-right font-semibold">Unitario</th>
                    <th className="px-4 py-2 text-right font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => {
                    const price = parseFloat(item.price.replace(/[$,\s]/g, '')) || 0;
                    const subtotal = price * item.quantity;
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-gray-900">{item.name || '-'}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-2 text-right text-gray-600">${price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right font-medium text-gray-900">${subtotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t flex gap-3 justify-end items-center">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar / Editar
          </Button>
          <Button 
            variant="primary" 
            onClick={onConfirm} 
            disabled={isLoading}
            className={isLicitacion ? "bg-orange-600 hover:bg-orange-700" : ""}
          >
            {isLoading 
              ? 'Procesando...' 
              : `Confirmar ${isLicitacion ? 'y Solicitar Licitación' : 'Solicitud'}`
            }
          </Button>
        </div>
      </div>
    </div>
  );
};