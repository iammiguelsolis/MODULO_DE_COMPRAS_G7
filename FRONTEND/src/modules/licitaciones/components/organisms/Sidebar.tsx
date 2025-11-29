'use client';

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { FileText, Users, Megaphone, FileCheck, DollarSign, ChartColumn, Package } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getLinkClass = (path: string) => {
    if (isClient && pathname === path) {
      return 'active';
    }
    return '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Compras</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="#"><FileText size={20} /> Solicitudes</a>
          </li>

          <li><a href="#"><Users size={20} /> Proveedores</a></li>

          <li><a href="#"><Package size={20} /> Compras</a></li>

          <li className={getLinkClass('/')}>
            <Link to="/"><Megaphone size={20} /> Licitaciones</Link>
          </li>

          <li><a href="#"><FileCheck size={20} /> Órdenes</a></li>
          <li><a href="#"><DollarSign size={20} /> Facturación</a></li>
          <li><a href="#"><ChartColumn size={20} /> Análisis de Proveedores</a></li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <img src="/user.png" alt="Juan Pérez" />
          <div>
            <p>Juan Pérez</p>
            <span>Comprador</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
