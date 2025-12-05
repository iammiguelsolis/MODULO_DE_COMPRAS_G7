import { PlusCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";

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
import { ordenCompraService } from '../lib/ordenCompraService';

const GenerarOrdenCompra: React.FC = () => {
  // ROUTER
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Tipo de origen que viene por query param
  const tipoRuta = searchParams.get("tipo")?.toUpperCase() as
    | "RFQ"
    | "LICITACION"
    | "DIRECTA"
    | undefined;

  // JSON que envía tu compañero
  const datosOrigen = location.state;

  // ESTADOS
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [orderType, setOrderType] = useState<"RFQ" | "LICITACION" | "DIRECTA">("RFQ");

  const [currency, setCurrency] = useState<'USD' | 'PEN'>('USD');
  const [expectedDelivery, setExpectedDelivery] = useState('');

  const [selectedSupplier, setSelectedSupplier] = useState<ProveedorType | null>(null);
  const [items, setItems] = useState<ItemType[]>([]);

  const [paymentMode, setPaymentMode] = useState<'CONTADO' | 'TRANSFERENCIA' | 'CREDITO'>('CONTADO');
  const [paymentDays, setPaymentDays] = useState<number>(0);
  const [deliveryTerms, setDeliveryTerms] = useState<string>('');

  const [solicitudId, setSolicitudId] = useState<string>('');
  const [notificacionInventarioId, setNotificacionInventarioId] = useState<string>('');

  const [isOrdenModalOpen, setIsOrdenModalOpen] = useState(false);
  const [isProveedorModalOpen, setIsProveedorModalOpen] = useState(false);


  // --------------------------------------------------------------
  // CARGAR AUTOMÁTICAMENTE DATOS DESDE LICITACIÓN, RFQ O DIRECTA
  // --------------------------------------------------------------
  useEffect(() => {
    if (!tipoRuta || !datosOrigen) return;

    setOrderType(tipoRuta);

    // LICITACIÓN
    if (tipoRuta === "LICITACION") {
      setSelectedSupplier(datosOrigen.proveedor);
      setItems(datosOrigen.items ?? []);
      setSolicitudId(datosOrigen.id_solicitud);
      setExpectedDelivery(datosOrigen.contrato?.fecha_firmado || "");
      return;
    }

    // RFQ
    if (tipoRuta === "RFQ") {
      setSelectedSupplier(datosOrigen.proveedor || null);
      setItems(datosOrigen.items ?? []);
      setSolicitudId(datosOrigen.id_solicitud);
      return;
    }

    // DIRECTA (notificación inventario)
    if (tipoRuta === "DIRECTA") {
      setNotificacionInventarioId(datosOrigen.notificacionId);

      setItems([
        {
          id: "1",
          productId: datosOrigen.productoId,
          name: datosOrigen.productoNombre,
          quantity: datosOrigen.cantidadSugerida,
          unitPrice: 0,
          description: ""
        }
      ]);
    }
  }, [tipoRuta, datosOrigen]);


  // -----------------------------------------
  // MANEJO DE ITEMS
  // -----------------------------------------
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

  const calculateSubtotal = (quantity: number, unitPrice: number) => quantity * unitPrice;

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + calculateSubtotal(item.quantity, item.unitPrice);
    }, 0);
  };


  // -----------------------------------------
  // CREAR ORDEN
  // -----------------------------------------
  const handleCreateOrder = () => {
    if (!selectedSupplier) {
      alert('Debe seleccionar un proveedor');
      return;
    }

    setIsOrdenModalOpen(true);
  };

  const enviarOrden = async () => {
    try {
      if (!selectedSupplier) return;

      const payload = {
        tipoOrigen: orderType,
        proveedorId: selectedSupplier.id,
        solicitudId: solicitudId || undefined,
        notificacionInventarioId: notificacionInventarioId || undefined,

        moneda: currency,
        fechaEntregaEsperada: expectedDelivery,
        condicionesPago: {
          diasPlazo: paymentDays,
          modalidad: paymentMode
        },
        terminosEntrega: deliveryTerms,
        observaciones: notes,
        titulo: title,

        lineas: items
      };

      console.log("📤 Enviando al backend:", payload);

      const response = await ordenCompraService.createOrden(payload);

      alert("✔ Orden creada: " + response.data.numero_referencia);
      setIsOrdenModalOpen(false);

    } catch (error: any) {
      console.error("❌ Error enviando orden:", error);
      alert("❌ Error: " + (error.message || "Error desconocido"));
    }
  };

  const totalAmount = calculateTotal();
  const isReadOnly = orderType === "LICITACION";


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Generar Orden de Compra</h1>
          <p className="text-gray-600 mt-1">Complete el formulario para crear una nueva orden de compra.</p>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate("/ordenes/historial")}
        >
          Ver historial de órdenes
        </Button>

        {/* Superior */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Datos */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900">Detalles</h2>

              <div className="space-y-4">

                <Input
                  label="Título"
                  placeholder="Ingrese título"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Tipo de Orden"
                    options={ORDER_TYPES}
                    value={orderType}
                    onChange={() => { }}
                    disabled
                  />

                  <Select
                    label="Moneda"
                    options={CURRENCIES}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'USD' | 'PEN')}
                  />
                </div>

                <Input
                  type="date"
                  label="Fecha esperada de entrega"
                  value={expectedDelivery}
                  onChange={e => setExpectedDelivery(e.target.value)}
                  disabled={isReadOnly}
                />

                {/* Proveedor */}
                <div>
                  <label className="block mb-2 text-sm text-gray-700 font-medium">Proveedor</label>

                  {selectedSupplier ? (
                    <div className="p-3 border rounded flex items-center justify-between bg-gray-50">
                      <div>
                        <p className="font-medium">{selectedSupplier.name}</p>
                        <p className="text-sm text-gray-600">{selectedSupplier.email}</p>
                      </div>

                      {!isReadOnly && (
                        <Button variant="secondary" onClick={() => setIsProveedorModalOpen(true)}>
                          Cambiar
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      icon={Search}
                      onClick={() => setIsProveedorModalOpen(true)}
                      disabled={isReadOnly}
                    >
                      Seleccionar proveedor
                    </Button>
                  )}
                </div>

                {/* ID Solicitud */}
                {orderType !== "DIRECTA" && (
                  <Input
                    label="Número de Solicitud/Contrato"
                    value={solicitudId}
                    onChange={e => setSolicitudId(e.target.value)}
                    disabled={isReadOnly}
                  />
                )}

                {/* Notificación Inventario */}
                {orderType === "DIRECTA" && (
                  <Input
                    label="ID Notificación de Inventario"
                    value={notificacionInventarioId}
                    onChange={e => setNotificacionInventarioId(e.target.value)}
                    disabled
                  />
                )}

                {/* Notas */}
                <TextArea
                  label="Notas adicionales"
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
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

        {/* Items */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Productos / Servicios</h2>

            {!isReadOnly && (
              <Button variant="primary" icon={PlusCircle} onClick={handleAddItem}>
                Agregar
              </Button>
            )}
          </div>

          <div className="space-y-4">
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
            <p className="text-2xl font-bold">
              Total: {currency === 'USD' ? '$' : 'S/'}
              {totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* MODALES */}
      <OrdenModal
        isOpen={isOrdenModalOpen}
        onClose={() => setIsOrdenModalOpen(false)}
        onConfirm={enviarOrden}          // <-- AQUÍ LO PASAS
        title={title}
        notes={notes}
        orderType={orderType}
        currency={currency}
        items={items}
        totalAmount={totalAmount}
        supplier={selectedSupplier}
        expectedDelivery={expectedDelivery}
        paymentMode={paymentMode}
        paymentDays={paymentDays}
        deliveryTerms={deliveryTerms}
        solicitudId={solicitudId}
        notificacionInventarioId={notificacionInventarioId}
      />

      <ProveedorModal
        isOpen={isProveedorModalOpen}
        onClose={() => setIsProveedorModalOpen(false)}
        onSelectSupplier={setSelectedSupplier}
        selectedSupplier={selectedSupplier}
      />
    </div>
  );
};

export default GenerarOrdenCompra;
