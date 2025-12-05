
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import DetallesLicitacion from '../organisms/DetallesLicitacion';
import DocumentacionRequerida from '../organisms/DocumentacionRequerida';
import ResumenCard from '../organisms/ResumenCard';
import Card from '../atoms/Card';
import CardHeader from '../atoms/CardHeader';
import CardBody from '../atoms/CardBody';
import ReadOnlyField from '../molecules/ReadOnlyField';
import ReadOnlyItem from '../molecules/ReadOnlyItem';
import PageHeader from '../molecules/PageHeader';
import type { Item } from '../../lib/types';
import { licitacionesService } from '../../lib/api/licitaciones.service';

const fallbackTitle = "Licitación de Suministros y Servicios TI";
const fallbackNotes = "Requerimos la cotización para la renovación de equipos y la contratación de servicios de soporte técnico especializado.";
const fallbackItems: Item[] = [
  { id: 'prod-1', type: 'MATERIAL', description: 'Laptop de alto rendimiento para desarrolladores', quantity: 10, price: 6000 },
];

interface LocationState {
  licitacionId?: number;
  titulo?: string;
  notas?: string;
  items?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: string;
  }>;
  montoTotal?: number;
  requestType?: 'material' | 'servicio';
}

const RequestLicitacionTemplate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id?: string }>();

  const state = location.state as LocationState | null;

  const licitacionId = state?.licitacionId || (params.id ? parseInt(params.id) : null);

  const convertirItems = (itemsOriginales: LocationState['items'], tipoSolicitud?: 'material' | 'servicio'): Item[] => {
    if (!itemsOriginales || itemsOriginales.length === 0) return fallbackItems;

    const tipoItem: 'MATERIAL' | 'SERVICIO' = tipoSolicitud === 'servicio' ? 'SERVICIO' : 'MATERIAL';

    return itemsOriginales.map((item, index) => {
      const precio = parseFloat(item.price.replace(/[$,\s]/g, '')) || 0;

      if (tipoItem === 'MATERIAL') {
        return {
          id: item.id || `item-${index}`,
          type: tipoItem,
          description: item.name,
          quantity: item.quantity,
          price: precio
        };
      } else {
        return {
          id: item.id || `item-${index}`,
          type: tipoItem,
          description: item.name,
          estimatedHours: item.quantity,
          hourlyRate: precio
        };
      }
    });
  };

  const [nombre] = useState(state?.titulo || fallbackTitle);
  const [notes] = useState(state?.notas || fallbackNotes);
  const [items] = useState<Item[]>(convertirItems(state?.items, state?.requestType));
  const [totalAmount] = useState(state?.montoTotal || items.reduce((sum, item) => {
    const total = item.type === 'MATERIAL'
      ? (item.quantity || 0) * (item.price || 0)
      : (item.estimatedHours || 0) * (item.hourlyRate || 0);
    return sum + total;
  }, 0));

  const [presupuestoMaximo, setPresupuestoMaximo] = useState<number | string>('');
  const [deadline, setDeadline] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<Record<string, string[]>>({ financial: ['propuesta-economica'] });

  const [presupuestoError, setPresupuestoError] = useState('');
  const [deadlineError, setDeadlineError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Verificar que tenemos licitacionId
  useEffect(() => {
    if (!licitacionId) {
      console.warn('No se recibió ID de licitación. Usando modo de demostración.');
    }
  }, [licitacionId]);

  const handleSubmit = async () => {
    let isValid = true;

    setPresupuestoError('');
    setDeadlineError('');

    // Validaciones
    if (!presupuestoMaximo) {
      setPresupuestoError('Por favor, ingrese un presupuesto.');
      isValid = false;
    } else if (parseFloat(String(presupuestoMaximo)) < totalAmount) {
      setPresupuestoError(`El presupuesto no puede ser menor al monto total estimado (S/ ${totalAmount.toFixed(2)}).`);
      isValid = false;
    }

    if (!deadline) {
      setDeadlineError('Por favor, seleccione una fecha límite.');
      isValid = false;
    }

    if (!isValid) return;

    // Si no hay licitacionId, solo mostrar mensaje (modo demostración)
    if (!licitacionId) {
      alert('Modo demostración: No hay licitación asociada.');
      navigate('/licitaciones');
      return;
    }

    setIsLoading(true);

    try {
      // Extraer todos los documentos seleccionados (excepto propuesta-economica que ya está por defecto)
      const documentosRequeridos: string[] = [];
      Object.values(selectedDocs).forEach(docArray => {
        docArray.forEach(doc => {
          if (doc !== 'propuesta-economica') {
            documentosRequeridos.push(doc);
          }
        });
      });

      // Llamar al endpoint para completar detalles de la licitación
      await licitacionesService.completarDetalles(licitacionId, {
        presupuesto_max: parseFloat(String(presupuestoMaximo)),
        fecha_limite: deadline,
        documentos_requeridos: documentosRequeridos
      });

      alert('¡Licitación completada con éxito!');
      navigate('/licitaciones');

    } catch (error) {
      console.error('Error al completar licitación:', error);
      alert('Ocurrió un error al completar la licitación. Verifique la consola para más detalles.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHeader
        title="Completar Solicitud de Licitación"
        description="Complete el formulario especializado para iniciar el proceso de licitación formal."
      />

      <div className="grid grid-cols-3 gap-6 mb-6 items-stretch">
        <div className="col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <h2>Información General</h2>
              <p>Datos heredados de la solicitud de compra.</p>
            </CardHeader>
            <CardBody className="flex-1 flex flex-col gap-4">
              <ReadOnlyField label="Título" value={nombre} />
              <div className="flex-1">
                <ReadOnlyField label="Notas" value={notes} className="h-full" />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-span-1">
          <ResumenCard
            totalAmount={totalAmount}
            onSubmit={handleSubmit}
            nombre={nombre}
            items={items}
            subtitle="Revisar el monto máximo, la fecha límite y los documentos requeridos"
            buttonText={isLoading ? "Procesando..." : "Completar licitación"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2>Ítems Solicitados</h2>
              <p>Datos heredados de la solicitud de compra.</p>
            </CardHeader>
            <CardBody className="items-table-body">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th className="text-center">Cantidad / Horas</th>
                    <th className="text-right">Precio Uni. / Tarifa</th>
                    <th className="text-right">Total Item</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => <ReadOnlyItem key={item.id} item={item} />)}
                </tbody>
              </table>
            </CardBody>
          </Card>

          <DetallesLicitacion
            presupuestoMaximo={presupuestoMaximo}
            onPresupuestoChange={setPresupuestoMaximo}
            deadline={deadline}
            onDeadlineChange={setDeadline}
            totalAmount={totalAmount}
            presupuestoError={presupuestoError}
            deadlineError={deadlineError}
          />
        </div>

        <div className="lg:col-span-1">
          <DocumentacionRequerida selectedDocs={selectedDocs} onSelectedDocsChange={setSelectedDocs} />
        </div>
      </div>
    </div>
  );
};

export default RequestLicitacionTemplate;
