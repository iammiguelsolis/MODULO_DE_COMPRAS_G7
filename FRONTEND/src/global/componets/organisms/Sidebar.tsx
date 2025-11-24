import React from 'react';
import { useNavigate } from "react-router-dom";
import { FileText, Users, Package, Network, ShoppingCart, DollarSign } from 'lucide-react';
import { MenuItem } from '../molecules/MenuItem';
import Logo from '../../../assets/logo.svg';

const UserImage = "https://i.pinimg.com/236x/86/37/32/8637324331fea244495f9da93176a373.jpg";

interface MenuItemType {
  id: string;
  icon: React.ElementType;
  label: string;
}

const menuItems: MenuItemType[] = [
  { id: 'solicitudes', icon: FileText, label: 'Solicitudes' },
  { id: 'proveedores', icon: Users, label: 'Proveedores' },
  { id: 'compras', icon: Package, label: 'Compras' },
  { id: 'licitaciones', icon: Network, label: 'Licitaciones' },
  { id: 'ordenes', icon: ShoppingCart, label: 'Órdenes' },
  { id: 'facturacion', icon: DollarSign, label: 'Facturación' },
];

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = React.useState<string>("solicitudes");
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    setActiveItem(id);
    navigate(`/${id}`);
  };

  return (
    <aside className='w-64 h-screen bg-blue-500 flex flex-col shadow-xl gap-4'>

      {/* LOGO */}
      <div className='flex items-center justify-center mt-8 gap-4 cursor-pointer mr-3'>
        <img src={Logo} alt="Logo" className='w-10 h-auto' />
        <h1 className='text-2xl font-bold text-white'>COMPRAS</h1>
      </div>

      {/* MENÚ */}
      <nav className='flex-1 py-6'>
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeItem === item.id}
            onClick={() => handleClick(item.id)}
          />
        ))}
      </nav>

      <hr className='border-white border-1'>
      </hr>

      {/* USUARIO ABAJO */}
      <div className='flex items-center mb-4 mx-auto'>
        <img
          src={UserImage}
          alt="Usuario"
          className='w-20 h-20 rounded-full border-2 border-white object-cover'
        />
        <div className='ml-4'>
          <h2 className='text-white font-bold text-lg mt-2'>Samnuel Luque</h2>
          <p className='text-white text-sm opacity-80'>Comprador</p>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
