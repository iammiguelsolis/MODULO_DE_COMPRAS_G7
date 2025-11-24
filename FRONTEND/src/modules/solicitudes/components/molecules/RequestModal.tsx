import { CheckCircle, FileText, X } from "lucide-react";
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
  title: string;
  notes: string;
  requestType: 'producto' | 'servicio';
  items: ItemType[];
  totalAmount: number;
  purchaseType: string;
}

export const RequestModal: React.FC<RequestModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  notes, 
  requestType, 
  items,
  totalAmount,
  purchaseType
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2">
              <CheckCircle className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">¡Solicitud Creada!</h2>
              <p className="text-blue-100 text-sm">Revisa los detalles de tu solicitud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tipo de Compra/Licitación - Destacado */}
        <div className={`px-6 py-4  border-b-2 border-gray-300 bg-white `}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg px-4 py-2 b">
                <p className={`text-2xl font-black ${totalAmount >= 5000 ? 'text-orange-600' : 'text-green-600'}`}>
                  {purchaseType}
                </p>
              </div>
              <div className="text-black">
                <p className="text-sm font-medium opacity-90">Clasificación del proceso:</p>
                <p className="font-semibold">
                  {totalAmount >= 5000 ? 'Esta solicitud supera el límite y debeseguir un proceso de licitación formal.' : 'Compra simple, rápida de bajo monto.'}
                </p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-black text-sm font-medium">Monto Total</p>
              <p className="text-black text-2xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Detalles de la Solicitud */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Detalles de la Solicitud
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Título:</label>
                <p className="text-gray-900 font-medium">{title || 'Sin título'}</p>
              </div>
              {notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notas adicionales:</label>
                  <p className="text-gray-700">{notes}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">Tipo de Solicitud:</label>
                <p className="text-gray-900 font-medium capitalize">{requestType}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {requestType === 'producto' ? 'Productos' : 'Servicios'}
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nombre</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                      {requestType === 'producto' ? 'Cantidad' : 'Horas'}
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                      {requestType === 'producto' ? 'Precio Unit.' : 'Tarifa'}
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => {
                    const price = parseFloat(item.price.replace(/[$,\s]/g, '')) || 0;
                    const subtotal = price * item.quantity;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{item.name || 'Sin nombre'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-right">${price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                          ${subtotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={onClose}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
};