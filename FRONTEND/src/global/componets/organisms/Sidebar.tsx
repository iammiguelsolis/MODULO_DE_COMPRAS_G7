import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, Users, Package, Network, ShoppingCart, DollarSign, Scale, BarChart2 } from 'lucide-react';
import { MenuItem } from '../molecules/MenuItem';
import Logo from '../../../assets/logo.svg';

// La imagen se mantiene estática (hardcoded)
const UserImage = "/arjona.jpg";

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
  { id: 'comparacion', icon: Scale, label: 'Comparación' },
  { id: 'analisis', icon: BarChart2, label: 'Evaluación de Proveedores' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para el item activo
  const [activeItem, setActiveItem] = useState<string>("solicitudes");
  
  // Estado para los datos del usuario
  const [userData, setUserData] = useState({
    nombreCompleto: 'Cargando...',
    puesto: ''
  });

  // Efecto para leer del LocalStorage al cargar
  useEffect(() => {
    // Sincronizar item activo con la URL actual
    const path = location.pathname.replace('/', '');
    if (path) setActiveItem(path);

    // Obtener usuario guardado en el Login
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          // Concatenamos nombre y apellido según tu JSON
          nombreCompleto: `${parsedUser.nombres} ${parsedUser.apellidoPaterno}`, 
          puesto: parsedUser.nombrePuesto
        });
      } catch (error) {
        console.error("Error al leer datos del usuario", error);
        setUserData({ nombreCompleto: 'Usuario', puesto: 'Invitado' });
      }
    } else {
        // Si no hay usuario, podrías redirigir al login
        // navigate('/'); 
    }
  }, [location]);

  const handleClick = (id: string) => {
    setActiveItem(id);
    navigate(`/${id}`);
  };

  return (
    <aside className='w-64 h-screen bg-blue-500 flex flex-col shadow-xl text-white font-sans'>

      {/* LOGO */}
      <div className='flex items-center justify-center mt-8 mb-4 gap-3 cursor-pointer'>
        <img src={Logo} alt="Logo" className='w-8 h-8' />
        <h1 className='text-2xl font-bold tracking-wide'>COMPRAS</h1>
      </div>

      {/* MENÚ */}
      <nav className='flex-1 py-4 px-2 space-y-1 overflow-y-auto'>
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

      <div className="px-6">
        <hr className='border-blue-400/50' />
      </div>

      {/* USUARIO ABAJO (Datos dinámicos + Imagen estática) */}
      <div className='flex items-center p-6 gap-3'>
        <img
          src={UserImage}
          alt="Usuario"
          className='w-16 h-16 rounded-full border-2 border-white/80 object-cover shadow-sm'
        />
        <div className='flex flex-col overflow-hidden'>
          <h2 className='text-white font-semibold text-sm truncate' title={userData.nombreCompleto}>
            {userData.nombreCompleto}
          </h2>
          <p className='text-blue-100 text-xs truncate capitalize opacity-90'>
            {userData.puesto}
          </p>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;