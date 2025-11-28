
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const hardcodedTitle = "Licitación de Suministros y Servicios TI";
const hardcodedNotes = "Requerimos la cotización para la renovación de equipos y la contratación de servicios de soporte técnico especializado.";
const hardcodedItems: Item[] = [
  { id: 'prod-1', type: 'Producto', description: 'Laptop de alto rendimiento para desarrolladores', quantity: 10, price: 6000 },
];



const RequestLicitacionTemplate: React.FC = () => {
  const navigate = useNavigate();

  const [title] = useState(hardcodedTitle);
  const [notes] = useState(hardcodedNotes);
  const [items] = useState<Item[]>(hardcodedItems);

  const [budget, setBudget] = useState<number | string>('');
  const [deadline, setDeadline] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<Record<string, string[]>>({ financial: ['propuesta-economica'] });

  const [budgetError, setBudgetError] = useState('');
  const [deadlineError, setDeadlineError] = useState('');

  const totalAmount = items.reduce((sum, item) => {
    const total = item.type === 'Producto'
      ? (item.quantity || 0) * (item.price || 0)
      : (item.estimatedHours || 0) * (item.hourlyRate || 0);
    return sum + total;
  }, 0);

  const handleSubmit = () => {
    let isValid = true;

    setBudgetError('');
    setDeadlineError('');

    if (!budget) {
      alert('Por favor, ingrese un presupuesto.');
      setBudgetError('Por favor, ingrese un presupuesto.');
      isValid = false;
    } else if (parseFloat(String(budget)) < totalAmount) {
      alert(`El presupuesto no puede ser menor al monto total estimado (S/ ${totalAmount.toFixed(2)}).`);
      setBudgetError(`El presupuesto no puede ser menor al monto total estimado (S/ ${totalAmount.toFixed(2)}).`);
      isValid = false;
    }

    if (!deadline) {
      alert('Por favor, seleccione una fecha límite.');
      setDeadlineError('Por favor, seleccione una fecha límite.');
      isValid = false;
    }

    if (isValid) {
      alert('¡Solicitud de licitación creada con éxito!');
      navigate('/licitaciones');
    }
  };

  return (
    <>
      <PageHeader
        title="Crear Solicitud de Licitación"
        description="Complete el formulario especializado para iniciar el proceso de licitación formal."
      />

      <div className="main-page-content">

        <Card>
          <CardHeader>
            <h2>Información General</h2>
            <p>Datos heredados de la solicitud de compra.</p>
          </CardHeader>
          <CardBody>
            <ReadOnlyField label="Título" value={title} />
            <ReadOnlyField label="Notas" value={notes} />
          </CardBody>
        </Card>

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
          budget={budget}
          onBudgetChange={setBudget}
          deadline={deadline}
          onDeadlineChange={setDeadline}
          totalAmount={totalAmount}
          budgetError={budgetError}
          deadlineError={deadlineError}
        />
        <DocumentacionRequerida selectedDocs={selectedDocs} onSelectedDocsChange={setSelectedDocs} />

        <ResumenCard
          totalAmount={totalAmount}
          onSubmit={handleSubmit}
          title={title}
          items={items}
          subtitle="Revisar el monto máximo, la fecha límite y los documentos requetidos"
          buttonText="Crear licitación"
        />
      </div>
    </>
  );
};

export default RequestLicitacionTemplate;
