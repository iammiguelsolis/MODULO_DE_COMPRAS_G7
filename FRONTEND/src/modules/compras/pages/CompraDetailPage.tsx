import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CompraDetailTemplate from '../components/templates/CompraDetailTemplate';
import { AdquisicionesApi, SolicitudesApi } from '../../../services/solicitudYadquisicion/api';
import type { ProcesoDetalle, OfertaInput, Solicitud } from '../../../services/solicitudYadquisicion/types';

const CompraDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [compra, setCompra] = useState<ProcesoDetalle | null>(null);
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompra = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await AdquisicionesApi.obtener(Number(id));
      setCompra(data);

      // Fetch associated solicitud
      if (data.solicitud_id) {
        const solicitudData = await SolicitudesApi.obtener(data.solicitud_id);
        setSolicitud(solicitudData);
      }
    } catch (err) {
      console.error('Error fetching compra details:', err);
      setError('Error al cargar los detalles de la compra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompra();
  }, [id]);

  const handleInvitar = async (proveedoresIds: number[]) => {
    if (!compra) return;
    try {
      await AdquisicionesApi.invitar(compra.id, proveedoresIds);
      alert('Proveedores invitados exitosamente');
      fetchCompra(); // Refresh data
    } catch (err) {
      console.error('Error inviting suppliers:', err);
      alert('Error al invitar proveedores');
    }
  };

  const handleOfertar = async (data: OfertaInput) => {
    if (!compra) return;
    try {
      await AdquisicionesApi.ofertar(compra.id, data);
      alert('Oferta registrada exitosamente');
      fetchCompra(); // Refresh data
    } catch (err) {
      console.error('Error registering offer:', err);
      alert('Error al registrar oferta');
    }
  };

  const handleAdjudicar = async (idOferta: number) => {
    if (!compra) return;
    try {
      await AdquisicionesApi.adjudicar(compra.id, idOferta);
      alert('Ganador adjudicado exitosamente');
      fetchCompra(); // Refresh data
    } catch (err) {
      console.error('Error adjudicating winner:', err);
      alert('Error al adjudicar ganador');
    }
  };

  const handleCerrarOfertas = async () => {
    if (!compra) return;
    if (!window.confirm('¿Está seguro de cerrar la recepción de ofertas? Ya no se podrán recibir más propuestas.')) return;

    try {
      await AdquisicionesApi.cerrarOfertas(compra.id);
      alert('Recepción de ofertas cerrada exitosamente');
      fetchCompra();
    } catch (err) {
      console.error('Error closing offers:', err);
      alert('Error al cerrar ofertas');
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando detalles...</div>;
  if (error || !compra) return <div className="p-8 text-center text-red-600">{error || 'Compra no encontrada'}</div>;

  return (
    <CompraDetailTemplate
      compra={compra}
      solicitud={solicitud}
      onInvitar={handleInvitar}
      onOfertar={handleOfertar}
      onAdjudicar={handleAdjudicar}
      onCerrarOfertas={handleCerrarOfertas}
    />
  );
};

export default CompraDetailPage;
