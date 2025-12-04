import React from "react";
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../components/atoms/Input';
import { Select } from '../components/atoms/Select';
import { Button } from '../components/atoms/Button';

interface OrdenHistorial {
  id: number;
  numero_referencia: string;
  titulo: string;
  proveedor: string | null;
  fecha_creacion: string | null;
  estado: string | null;
  tipo_origen: string | null;
  moneda: string | null;
  total: number;
}

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'BORRADOR', label: 'Borrador' },
  { value: 'EN_PROCESO', label: 'En Proceso' },
  { value: 'ENVIADA', label: 'Enviada' },
  { value: 'CERRADA', label: 'Cerrada' },
  { value: 'CANCELADA', label: 'Cancelada' },
];

const TIPOS_ORIGEN = [
  { value: '', label: 'Todos' },
  { value: 'RFQ', label: 'RFQ' },
  { value: 'LICITACION', label: 'Licitación' },
  { value: 'DIRECTA', label: 'Directa' },
];

const HistorialOrdenes: React.FC = () => {
  const [ordenes, setOrdenes] = useState<OrdenHistorial[]>([]);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [origenFiltro, setOrigenFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  const cargarOrdenes = async () => {
    try {
      setCargando(true);
      const params = new URLSearchParams();
      if (estadoFiltro) params.append('estado', estadoFiltro);
      if (origenFiltro) params.append('tipo_origen', origenFiltro);

      const res = await fetch(
        `http://localhost:5000/orden-compra/ordenes?${params.toString()}`
      );
      const data = await res.json();
      setOrdenes(data);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, [estadoFiltro, origenFiltro]);

  const ordenesFiltradas = ordenes.filter((oc) => {
    if (!busqueda.trim()) return true;
    const texto = (
      (oc.numero_referencia || '') +
      (oc.titulo || '') +
      (oc.proveedor || '')
    ).toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Historial de Órdenes de Compra</h1>
          <p className="text-gray-600 mt-1">
            Consulta las órdenes emitidas, su estado, proveedor y montos.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white border rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-end">
          <div className="w-full md:w-1/3">
            <Input
              label="Buscar"
              placeholder="Buscar por número, título o proveedor"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="w-full md:w-1/4">
            <Select
              label="Estado"
              options={ESTADOS}
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            />
          </div>

          <div className="w-full md:w-1/4">
            <Select
              label="Origen"
              options={TIPOS_ORIGEN}
              value={origenFiltro}
              onChange={(e) => setOrigenFiltro(e.target.value)}
            />
          </div>

          <div className="w-full md:w-auto">
            <Button variant="secondary" onClick={cargarOrdenes}>
              Refrescar
            </Button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">N° Orden</th>
                <th className="px-4 py-2 text-left">Título</th>
                <th className="px-4 py-2 text-left">Proveedor</th>
                <th className="px-4 py-2 text-left">Origen</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    Cargando órdenes...
                  </td>
                </tr>
              ) : ordenesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No se encontraron órdenes
                  </td>
                </tr>
              ) : (
                ordenesFiltradas.map((oc) => (
                  <tr key={oc.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{oc.numero_referencia}</td>
                    <td className="px-4 py-2">{oc.titulo}</td>
                    <td className="px-4 py-2">{oc.proveedor || '-'}</td>
                    <td className="px-4 py-2">{oc.tipo_origen}</td>
                    <td className="px-4 py-2">{oc.estado}</td>
                    <td className="px-4 py-2 text-right">
                      {oc.moneda === 'USD' ? '$' : 'S/'}{' '}
                      {oc.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {oc.fecha_creacion
                        ? new Date(oc.fecha_creacion).toLocaleDateString('es-ES')
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistorialOrdenes;
