
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../components/atoms/Input';
import { TextArea } from '../components/atoms/TextArea';
import { Button } from '../components/atoms/Button';
import { ProductRow } from '../components/molecules/ProductRow';
import { SummaryCard } from '../components/molecules/SummaryCard';
import { Select } from '../components/atoms/Select';
import { RequestModal } from '../components/molecules/RequestModal';

interface ItemType {
  id: string;
  name: string;
  quantity: number;
  price: string;
}
const Solicitud: React.FC = () => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [requestType, setRequestType] = useState<'producto' | 'servicio'>('producto');
  const [items, setItems] = useState<ItemType[]>([
    { id: '1', name: '', quantity: 50, price: '$ 20.00' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestTypeChange = (newType: 'producto' | 'servicio') => {
    setRequestType(newType);
    setItems([
      {
        id: Date.now().toString(),
        name: '',
        quantity: newType === 'producto' ? 50 : 0,
        price: newType === 'producto' ? '$ 20.00' : '$ 0.00'
      }
    ]);
  };

  const handleItemChange = (id: string, field: keyof ItemType, value: string | number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleAddItem = () => {
    const newItem: ItemType = {
      id: Date.now().toString(),
      name: '',
      quantity: requestType === 'producto' ? 50 : 0,
      price: requestType === 'producto' ? '$ 20.00' : '$ 0.00',
    };
    setItems([...items, newItem]);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[$,\s]/g, '')) || 0;
      return sum + (price * item.quantity);
    }, 0);
  };

  const getPurchaseType = (total: number) => {
    return total >= 5000 ? 'LICITACIÓN' : 'COMPRA';
  };

  const handleCreateRequest = () => {
    setIsModalOpen(true);
  };

  const totalAmount = calculateTotal();
  const purchaseType = getPurchaseType(totalAmount);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crear Solicitud de Compra</h1>
          <p className="text-gray-600 mt-1">Complete el formulario para generar una solicitud.</p>
        </div>

        {/* Sección Superior: Detalles y Resumen */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Detalles de la Solicitud */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg border border-gray-300 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Detalles de la Solicitud</h2>
              <p className="text-sm text-gray-600 mb-6">
                Ingrese un título y las notas adicionales de manera opcional.
              </p>

              <div className="space-y-4">
                <Input
                  label="Título de la solicitud"
                  placeholder="Ingrese el título"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextArea
                  label="Notas adicionales"
                  placeholder="Ingrese notas adicionales"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="col-span-1">
            <SummaryCard
              totalAmount={totalAmount}
              processType={totalAmount >= 5000 ? 'Tipo de Proceso: Licitación' : 'Tipo de Proceso: Simple'}
              processDescription={totalAmount >= 5000 ? 'Esta solicitud supera el límite y debeseguir un proceso de licitación formal.' : 'Compra simple, rápida de bajo monto.'}
              purchaseType={purchaseType}
              onCreateRequest={handleCreateRequest}
            />
          </div>
        </div>

        {/* Sección Inferior: Productos/Servicios - Full Width */}
        <div className="bg-white rounded-lg border border-gray-300 p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {requestType === 'producto' ? 'Productos' : 'Servicios'}
            </h2>
            <Button variant="primary" icon={PlusCircle} onClick={handleAddItem}>
              Agregar Ítem
            </Button>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Agregue los ítems que desea solicitar
          </p>

          {/* Selector de Tipo */}
          <div className="mb-6 max-w-xs">
            <Select
              label="Tipo de Solicitud"
              options={[
                { value: 'producto', label: 'Producto' },
                { value: 'servicio', label: 'Servicio' },
              ]}
              value={requestType}
              onChange={(e) => handleRequestTypeChange(e.target.value as 'producto' | 'servicio')}
            />
          </div>

          <div className="space-y-4">
            {/* Encabezados */}
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 pb-2 border-b">
              <div className="col-span-6">Nombre</div>
              <div className="col-span-2">
                {requestType === 'producto' ? 'Cantidad' : 'Horas est.'}
              </div>
              <div className="col-span-3">
                {requestType === 'producto' ? 'Precio Unitario' : 'Tarifa hora'}
              </div>
              <div className="col-span-1"></div>
            </div>

            {/* Filas de items */}
            {items.map((item) => (
              <ProductRow
                key={item.id}
                item={item}
                requestType={requestType}
                onChange={handleItemChange}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        notes={notes}
        requestType={requestType}
        items={items}
        totalAmount={totalAmount}
        purchaseType={purchaseType}
      />
    </div>
  );
};

export default Solicitud;