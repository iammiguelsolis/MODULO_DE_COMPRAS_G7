import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Item } from '../../lib/types';
import ItemSolicitud from '../molecules/ItemSolicitud';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import CardHeader from '../atoms/CardHeader';
import CardBody from '../atoms/CardBody';
import EmptyState from '../molecules/EmptyState';
import ErrorMessage from '../atoms/ErrorMessage';
import './ProductosYServicios.css';
import { ProductosYServiciosProps } from '../../lib/types';

const ProductosYServicios: React.FC<ProductosYServiciosProps> = ({ items, onItemsChange, error }) => {

  const handleAddItem = () => {
    onItemsChange([...items, {
      id: Date.now().toString(),
      type: 'Producto',
      description: '',
      quantity: 1,
      price: 0,
      estimatedHours: 0,
      hourlyRate: 0
    }]);
  };

  const handleItemChange = (index: number, updatedItem: Item) => {
    const newItems = items.map((item, i) => (i === index ? updatedItem : item));
    onItemsChange(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  return (
    <Card>
      <CardHeader className="product-services-header">
        <div>
          <h2>Productos y Servicios</h2>
          <p>Agregue los items que desea solicitar.</p>
        </div>
        <Button variant="primary" onClick={handleAddItem}>
          <PlusCircle size={20} />
          <span>Agregar Ítem</span>
        </Button>
      </CardHeader>
      <CardBody>
        {items.length === 0 ? (
          error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            <EmptyState message="Aún no ha agregado ningún item." variant="error" />
          )
        ) : (
          <div className="items-list-container">
            {items.map((item, index) => (
              <ItemSolicitud
                key={item.id}
                item={item}
                onItemChange={(updatedItem) => handleItemChange(index, updatedItem)}
                onRemove={() => handleRemoveItem(index)}
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ProductosYServicios;
