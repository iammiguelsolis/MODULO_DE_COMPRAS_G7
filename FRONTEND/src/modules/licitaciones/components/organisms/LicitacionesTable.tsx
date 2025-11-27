import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import StatusPill from '../molecules/StatusPill';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import './LicitacionesTable.css';
import type { LicitacionesTableProps } from '../../lib/types';

const LicitacionesTable: React.FC<LicitacionesTableProps> = ({ licitaciones }) => {
    const navigate = useNavigate();

    return (
        <Card className="licitaciones-table-card">
            <div className="table-responsive">
                <table className="licitaciones-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Fecha Creación</th>
                            <th>Presupuesto</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {licitaciones.length > 0 ? (
                            licitaciones.map((lic) => (
                                <tr key={lic.id}>
                                    <td className="font-medium">{lic.id}</td>
                                    <td>{lic.titulo}</td>
                                    <td>{new Date(lic.fechaCreacion + 'T00:00:00').toLocaleDateString('es-PE', { timeZone: 'UTC' })}</td>
                                    <td suppressHydrationWarning>
                                        S/ {lic.presupuesto.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td><StatusPill status={lic.estado} /></td>
                                    <td>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => navigate('/licitacion/detail')}
                                        >
                                            <Eye size={16} />
                                            <span>Ver detalles</span>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No se encontraron licitaciones que coincidan con los filtros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default LicitacionesTable;
