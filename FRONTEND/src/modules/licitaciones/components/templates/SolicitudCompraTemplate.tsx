import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Item } from '../../lib/types';
import DetallesSolicitudForm from '../organisms/DetallesSolicitudForm';
import ProductosYServicios from '../organisms/ProductosYServicios';
import ResumenCard from '../organisms/ResumenCard';
import PageHeader from '../molecules/PageHeader';
import { limite_money } from '../../lib/constants';

const SolicitudCompraTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [titleError, setTitleError] = useState('');

  const totalAmount = items.reduce((sum, item) => {
    const total = item.type === 'Producto'
      ? (item.quantity || 0) * (item.price || 0)
      : (item.estimatedHours || 0) * (item.hourlyRate || 0);
    return sum + total;
  }, 0);

  const handleSubmit = () => {
    // Validación del título
    if (!title.trim()) {
      alert('Por favor, ingrese un título para la solicitud.');
      setTitleError('Por favor, ingrese un título para la solicitud.');
      return;
    }

    setTitleError('');

    const isLicitacion = totalAmount > limite_money;

    if (isLicitacion) {
      navigate(`/licitacion`);
    }
  };

  return (
    <>
      <PageHeader
        title="Solicitud de Compra o Servicio"
        description="Complete los detalles de su solicitud. Puede agregar múltiples productos o servicios."
      />

      <div className="main-page-content">
        <DetallesSolicitudForm
          title={title}
          onTitleChange={setTitle}
          notes={notes}
          onNotesChange={setNotes}
          titleError={titleError}
        />

        <ProductosYServicios
          items={items}
          onItemsChange={setItems}
        />

        <ResumenCard
          totalAmount={totalAmount}
          onSubmit={handleSubmit}
          title={title}
          items={items}
        />
      </div>
    </>
  );
};

export default SolicitudCompraTemplate;
