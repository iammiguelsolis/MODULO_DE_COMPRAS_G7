import { PlusCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../components/atoms/Input';
import { TextArea } from '../components/atoms/TextArea';
import { Button } from '../components/atoms/Button';
import { ProductRow } from '../components/molecules/ProductRow';
import { SummaryCard } from '../components/molecules/SummaryCard';
import { Select } from '../components/atoms/Select';
import { OrdenModal } from '../components/molecules/OrdenModal';
import { ProveedorModal } from '../components/molecules/ProveedorModal';
import type { ItemType, ProveedorType } from '../lib/types';
import { ORDER_TYPES, CURRENCIES } from '../lib/constants';

const GenerarOrdenCompra: React.FC = () => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [orderType, setOrderType] = useState<'RFQ' | 'LICITACION' | 'DIRECTA'>('RFQ');
  const [currency, setCurrency] = useState<'USD' | 'PEN'>('USD');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [items, setItems] = useState<ItemType[]>([
    { 
      id: '1', 
      productId: '',
      name: '', 
      quantity: 1, 
      unitPrice: 0,
      description: '' 
    },
  ]);
  const [selectedSupplier, setSelectedSupplier] = useState<ProveedorType | null>(null);
  const [isOrdenModalOpen, setIsOrdenModalOpen] = useState(false);
  const [isProveedorModalOpen, setIsProveedorModalOpen] = useState(false);

  const handleOrderTypeChange = (newType: 'RFQ' | 'LICITACION' | 'DIRECTA') => {
    setOrderType(newType);
    // Si es LICITACIÓN, cargaríamos datos del contrato aquí
    if (newType === 'LICITACION') {
      // En una implementación real, cargaríamos datos de la licitación
      // Por ahora, solo cambiamos el tipo
    }
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
      productId: '',
      name: '',
      quantity: 1,
      unitPrice: 0,
      description: '',
    };
    setItems([...items, newItem]);
  };

  const calculateSubtotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + calculateSubtotal(item.quantity, item.unitPrice);
    }, 0);
  };

  const handleCreateOrder = () => {
    // Validar campos requeridos
    if (!selectedSupplier) {
      alert('Por favor seleccione un proveedor');
      return;
    }
    
    if (items.some(item => !item.name || item.quantity <= 0 || item.unitPrice <= 0)) {
      alert('Por favor complete todos los campos de productos (nombre, cantidad y precio)');
      return;
    }
    
    setIsOrdenModalOpen(true);
  };

  const handleSelectSupplier = (supplier: ProveedorType) => {
    setSelectedSupplier(supplier);
    setIsProveedorModalOpen(false);
  };

  const totalAmount = calculateTotal();
  const isReadOnly = orderType === 'LICITACION';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Generar Orden de Compra</h1>
          <p className="text-gray-600 mt-1">Complete el formulario para crear una nueva orden de compra.</p>
        </div>

        {/* Sección Superior: Detalles y Resumen */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Detalles de la Orden */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Detalles de la Orden</h2>
              <p className="text-sm text-gray-600 mb-6">
                Complete la información general de la orden de compra.
              </p>

              <div className="space-y-4">
                <Input
                  label="Título de la orden"
                  placeholder="Ingrese el título descriptivo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Tipo de Orden"
                    options={ORDER_TYPES}
                    value={orderType}
                    onChange={(e) => handleOrderTypeChange(e.target.value as 'RFQ' | 'LICITACION' | 'DIRECTA')}
                  />

                  <Select
                    label="Moneda"
                    options={CURRENCIES}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'USD' | 'PEN')}
                  />
                </div>

                <Input
                  label="Fecha Esperada de Entrega"
                  type="date"
                  value={expectedDelivery}
                  onChange={(e) => setExpectedDelivery(e.target.value)}
                />

                {/* Selección de Proveedor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proveedor *
                  </label>
                  {selectedSupplier ? (
                    <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{selectedSupplier.name}</p>
                        <p className="text-sm text-gray-600">{selectedSupplier.contact} • {selectedSupplier.email}</p>
                      </div>
                      {!isReadOnly && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => setIsProveedorModalOpen(true)}
                        >
                          Cambiar
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button 
                      variant="secondary" 
                      icon={Search}
                      onClick={() => setIsProveedorModalOpen(true)}
                      className="w-full justify-center"
                      disabled={isReadOnly}
                    >
                      Seleccionar Proveedor
                    </Button>
                  )}
                  {orderType === 'LICITACION' && (
                    <p className="text-sm text-blue-600 mt-2">
                      ℹ️ El proveedor está definido por el contrato de licitación
                    </p>
                  )}
                </div>

                <TextArea
                  label="Notas adicionales"
                  placeholder="Ingrese notas adicionales para la orden"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="col-span-1">
            <SummaryCard
              totalAmount={totalAmount}
              currency={currency}
              orderType={orderType}
              itemsCount={items.length}
              supplierName={selectedSupplier?.name}
              onCreateOrder={handleCreateOrder}
              isDisabled={!selectedSupplier || items.length === 0}
            />
          </div>
        </div>

        {/* Sección Inferior: Productos */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-900">Productos/Servicios</h2>
            {!isReadOnly && (
              <Button variant="primary" icon={PlusCircle} onClick={handleAddItem}>
                Agregar Producto
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-6">
            {isReadOnly 
              ? 'Productos definidos en el contrato de licitación (solo lectura)' 
              : 'Agregue los productos o servicios a incluir en la orden'
            }
          </p>

          <div className="space-y-4">
            {/* Encabezados */}
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 pb-2 border-b">
              <div className="col-span-5">Producto/Servicio</div>
              <div className="col-span-2">Cantidad</div>
              <div className="col-span-2">Precio Unit.</div>
              <div className="col-span-2">Subtotal</div>
              <div className="col-span-1">Acciones</div>
            </div>

            {/* Filas de productos */}
            {items.map((item) => (
              <ProductRow
                key={item.id}
                item={item}
                currency={currency}
                onChange={handleItemChange}
                onDelete={handleDeleteItem}
                calculateSubtotal={calculateSubtotal}
                isReadOnly={isReadOnly}
              />
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-end mt-6 pt-6 border-t">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {currency === 'USD' ? '$' : 'S/.'} {totalAmount.toLocaleString('es-ES', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Orden */}
      <OrdenModal
        isOpen={isOrdenModalOpen}
        onClose={() => setIsOrdenModalOpen(false)}
        title={title}
        notes={notes}
        orderType={orderType}
        currency={currency}
        items={items}
        totalAmount={totalAmount}
        supplier={selectedSupplier}
        expectedDelivery={expectedDelivery}
      />

      {/* Modal de Selección de Proveedor */}
      <ProveedorModal
        isOpen={isProveedorModalOpen}
        onClose={() => setIsProveedorModalOpen(false)}
        onSelectSupplier={handleSelectSupplier}
        selectedSupplier={selectedSupplier}
      />
    </div>
  );
};

export default GenerarOrdenCompra;