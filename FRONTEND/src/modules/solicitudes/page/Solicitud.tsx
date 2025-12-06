import { PlusCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/atoms/Input';
import { TextArea } from '../components/atoms/TextArea';
import { Button } from '../components/atoms/Button';
import { ProductRow } from '../components/molecules/ProductRow';
import { SummaryCard } from '../components/molecules/SummaryCard';
import { Select } from '../components/atoms/Select';
import { RequestModal } from '../components/molecules/RequestModal';

// --- IMPORTANTE: Agregamos AdquisicionesApi ---
import { SolicitudesApi, AdquisicionesApi } from '../../../services/solicitudYadquisicion/api';
import type { SolicitudInput, ItemSolicitudInput, TipoItem } from '../../../services/solicitudYadquisicion/types';

interface ItemType {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

const Solicitud: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [requestType, setRequestType] = useState<'material' | 'servicio'>('material');

  const [isLoading, setIsLoading] = useState(false);

  const [items, setItems] = useState<ItemType[]>([
    { id: '1', name: '', quantity: 50, price: '$ 20.00' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LÓGICA DE INTERFAZ ---

  const handleRequestTypeChange = (newType: 'material' | 'servicio') => {
    setRequestType(newType);
    setItems([
      {
        id: Date.now().toString(),
        name: '',
        quantity: newType === 'material' ? 50 : 0,
        price: newType === 'material' ? '$ 20.00' : '$ 0.00'
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
      quantity: requestType === 'material' ? 50 : 0,
      price: requestType === 'material' ? '$ 20.00' : '$ 0.00',
    };
    setItems([...items, newItem]);
  };

  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[$,\s]/g, '')) || 0;
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const price = parsePrice(item.price);
      return sum + (price * item.quantity);
    }, 0);
  };

  // Cálculo visual para la UI (El backend tiene la palabra final)
  const getPurchaseType = (total: number) => {
    return total >= 10000 ? 'LICITACIÓN' : 'COMPRA';
  };

  // --- INTEGRACIÓN Y REDIRECCIÓN ---

  const handleSubmit = async () => {
    if (!title.trim()) return alert("El título es obligatorio");
    if (items.some(i => !i.name.trim())) return alert("Todos los ítems deben tener nombre");

    setIsLoading(true);

    try {
      // 1. Preparar Payload
      const tipoBackend: TipoItem = requestType === 'material' ? 'MATERIAL' : 'SERVICIO';
      const itemsPayload: ItemSolicitudInput[] = items.map(item => {
        const precio = parsePrice(item.price);
        const baseItem = {
          tipo: tipoBackend,
          nombre: item.name,
          cantidad: item.quantity,
          comentario: ""
        };
        if (tipoBackend === 'MATERIAL') {
          return { ...baseItem, precio_unitario: precio };
        } else {
          return { ...baseItem, tarifa_hora: precio, horas_estimadas: item.quantity };
        }
      });

      const payload: SolicitudInput = {
        titulo: title,
        notas_adicionales: notes,
        items: itemsPayload
      };

      // 2. CREAR SOLICITUD
      const solicitudRes = await SolicitudesApi.crear(payload);
      const idSolicitud = solicitudRes.id;
      console.log("Solicitud creada:", idSolicitud);

      await SolicitudesApi.aprobar(idSolicitud);
      console.log("Solicitud aprobada automáticamente");

      const procesoRes = await AdquisicionesApi.generar(idSolicitud);
      console.log("Proceso generado:", procesoRes);

      // 5. REDIRECCIÓN INTELIGENTE
      setIsModalOpen(false);

      if (procesoRes.tipo_proceso === 'LICITACION') {
        navigate(`/licitaciones/completar/${procesoRes.proceso.id}`, {
          state: {
            licitacionId: procesoRes.proceso.id,
            titulo: title,
            notas: notes,
            items: items,
            montoTotal: calculateTotal(),
            requestType: requestType
          }
        });
      } else {
        navigate('/compras', { state: { procesoId: procesoRes.proceso.id } });
      }

    } catch (error) {
      console.error("Error en el flujo:", error);
      alert("Ocurrió un error al procesar la solicitud.");
    } finally {
      setIsLoading(false);
    }
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

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <div className="bg-white rounded-lg border border-gray-300 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Detalles de la Solicitud</h2>
              <p className="text-sm text-gray-600 mb-6">
                Ingrese un título y las notas adicionales.
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

          <div className="col-span-1">
            <SummaryCard
              totalAmount={totalAmount}
              processType={totalAmount >= 10000 ? 'Tipo de Proceso: Licitación' : 'Tipo de Proceso: Simple'}
              processDescription={totalAmount >= 10000 ? 'Esta solicitud supera el límite. Se iniciará un proceso de licitación.' : 'Compra simple de bajo monto.'}
              purchaseType={purchaseType}
              onCreateRequest={() => setIsModalOpen(true)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-300 p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {requestType === 'material' ? 'Materiales' : 'Servicios'}
            </h2>
            <Button variant="primary" icon={PlusCircle} onClick={handleAddItem}>
              Agregar Ítem
            </Button>
          </div>

          <div className="mb-6 max-w-xs">
            <Select
              label="Tipo de Solicitud"
              options={[
                { value: 'material', label: 'Material' },
                { value: 'servicio', label: 'Servicio' },
              ]}
              value={requestType}
              onChange={(e) => handleRequestTypeChange(e.target.value as 'material' | 'servicio')}
            />
          </div>

          <div className="space-y-4">
            {/* Headers */}
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 pb-2 border-b">
              <div className="col-span-6">Nombre</div>
              <div className="col-span-2">
                {requestType === 'material' ? 'Cantidad' : 'Horas est.'}
              </div>
              <div className="col-span-3">
                {requestType === 'material' ? 'Precio Unitario' : 'Tarifa hora'}
              </div>
              <div className="col-span-1"></div>
            </div>

            {/* Rows */}
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

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        notes={notes}
        requestType={requestType}
        items={items}
        totalAmount={totalAmount}
        purchaseType={purchaseType}
        onConfirm={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Solicitud;