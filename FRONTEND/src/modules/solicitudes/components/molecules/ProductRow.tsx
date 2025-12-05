import { Input } from "../atoms/Input";
import { Trash2 } from 'lucide-react';

interface ItemType {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

interface ProductRowProps {
  item: ItemType;
  requestType: 'material' | 'servicio';
  onChange: (id: string, field: keyof ItemType, value: string | number) => void;
  onDelete: (id: string) => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({ item, requestType, onChange, onDelete }) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-start">
      <div className="col-span-6">
        <Input
          placeholder="Nombre del ítem"
          value={item.name}
          onChange={(e) => onChange(item.id, 'name', e.target.value)}
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          placeholder={requestType === 'material' ? '50' : '0'}
          value={item.quantity}
          onChange={(e) => onChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="col-span-3">
        <Input
          placeholder={requestType === 'material' ? '$ 20.00' : '$ 0.00'}
          value={item.price}
          onChange={(e) => onChange(item.id, 'price', e.target.value)}
        />
      </div>
      <div className="col-span-1 flex items-center justify-center pt-2">
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};