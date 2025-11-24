import React from 'react';
import { FileText, Users, Package, Network, ShoppingCart, DollarSign } from 'lucide-react';
import { MenuItem } from '../molecules/MenuItem';

interface MenuItem {
  id: string;
  icon: React.ElementType;
  label: string;
}

const menuItems: MenuItem[] = [
  { id: 'solicitudes', icon: FileText, label: 'Solicitudes' },
  { id: 'proveedores', icon: Users, label: 'Proveedores' },
  { id: 'compras', icon: Package, label: 'Compras' },
  { id: 'licitaciones', icon: Network, label: 'Licitaciones' },
  { id: 'ordenes', icon: ShoppingCart, label: 'Órdenes' },
  { id: 'facturacion', icon: DollarSign, label: 'Facturación' },
];

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = React.useState<string>("solicitudes");
  return (
    <div>
      
      <aside className='w-64 h-screen bg-blue-500 flex flex-col shadow-xl gap-4'>


        <div className='flex items-center justify-center h-1 mt-8'>
          <h1 className='text-2xl font-bold text-white'>TEXTO</h1>
        </div>

        <nav className='flex-1 py-6'>
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.id}
              onClick={() => setActiveItem(item.id)}
            />
          ))}
        </nav>

        <div className='flex items-center justify-center h-1 mb-8'>
          <h1 className='text-2xl font-bold text-white'>TEXTO</h1>
        </div>

      </aside>
    </div>
  )
}

export default Sidebar;