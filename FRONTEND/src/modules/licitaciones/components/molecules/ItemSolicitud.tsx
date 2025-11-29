import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Item } from '../../lib/types';
import Select from '../atoms/Select';
import Input from '../atoms/Input';
import Label from '../atoms/Label';
import IconButton from '../atoms/IconButton';
import './ItemSolicitud.css';

interface ItemSolicitudProps {
  item: Item;
  onItemChange: (updatedItem: Item) => void;
  onRemove: () => void;
}


const ItemSolicitud: React.FC<ItemSolicitudProps> = ({ item, onItemChange, onRemove }) => {

  const handleFieldChange = (field: keyof Item, value: any) => {
    const numericFields = ['quantity', 'price', 'estimatedHours', 'hourlyRate'];
    let processedValue = value;

    if (numericFields.includes(field)) {
      processedValue = parseFloat(value) || 0;
    }

    const updatedItem = { ...item, [field]: processedValue };

    if (field === 'type') {
      if (value === 'Producto') {
        updatedItem.estimatedHours = 0;
        updatedItem.hourlyRate = 0;
      } else {
        updatedItem.quantity = 1;
        updatedItem.price = 0;
      }
    }

    onItemChange(updatedItem);
  };

  const total = item.type === 'Producto'
    ? (item.quantity || 0) * (item.price || 0)
    : (item.estimatedHours || 0) * (item.hourlyRate || 0);

  return (
    <div className="solicitud-item-card">
      <div className="solicitud-item-grid">
        <div className="solicitud-col-span-2">
          <Label>Tipo</Label>
          <Select value={item.type} onChange={(e) => handleFieldChange('type', e.target.value as Item['type'])}>
            <option value="Producto">Producto</option>
            <option value="Servicio">Servicio</option>
          </Select>
        </div>
        <div className="solicitud-col-span-4">
          <Label>Descripción</Label>
          <Input
            type="text"
            placeholder="Ej. Laptop, servicio de mantenimiento"
            value={item.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
          />
        </div>

        {item.type === 'Producto' ? (
          <>
            <div className="solicitud-col-span-2">
              <Label>Cantidad</Label>
              <Input
                type="text"
                inputMode="decimal"
                value={item.quantity}
                onChange={(e) => handleFieldChange('quantity', e.target.value)}
              />
            </div>
            <div className="solicitud-col-span-2">
              <Label>Precio Unitario</Label>
              <Input
                type="text"
                inputMode="decimal"
                value={item.price}
                onChange={(e) => handleFieldChange('price', e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="solicitud-col-span-2">
              <Label>Horas Estimadas</Label>
              <Input
                type="text"
                inputMode="decimal"
                value={item.estimatedHours}
                onChange={(e) => handleFieldChange('estimatedHours', e.target.value)}
              />
            </div>
            <div className="solicitud-col-span-2">
              <Label>Tarifa / Hora</Label>
              <Input
                type="text"
                inputMode="decimal"
                value={item.hourlyRate}
                onChange={(e) => handleFieldChange('hourlyRate', e.target.value)}
              />
            </div>
          </>
        )}

        <div className="solicitud-total-column">
          <Label>Total</Label>
          <span>S/ {total.toFixed(2)}</span>
        </div>

        <div className="solicitud-remove-column">
          <IconButton
            variant="danger"
            icon={<Trash2 size={20} />}
            onClick={onRemove}
            ariaLabel="Eliminar item"
          />
        </div>

      </div>
    </div>
  )
}

export default ItemSolicitud;
