import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, FileText, Package } from 'lucide-react';
import Card from '../atoms/Card';
import CardHeader from '../atoms/CardHeader';
import CardBody from '../atoms/CardBody';
import Button from '../atoms/Button';
import type { SolicitudPendiente } from '../../lib/types';
import './PendingRequestCard.css';

interface PendingRequestCardProps {
    solicitud: SolicitudPendiente;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const PendingRequestCard: React.FC<PendingRequestCardProps> = ({
    solicitud,
    onApprove,
    onReject
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <Card className="pending-request-card">
            <CardHeader className="pending-request-header">
                <div className="header-main-info">
                    <div className="header-top-row">
                        <span className="request-id">{solicitud.id}</span>
                    </div>
                    <h3 className="request-title">{solicitud.nombre}</h3>
                    <div className="request-meta">
                        <span className="meta-item">
                            <strong>Comprador:</strong> {solicitud.solicitante}
                        </span>
                        <span className="meta-item">
                            <strong>Presupuesto Máx:</strong> S/. {solicitud.presupuestoMaximo.toLocaleString()}
                        </span>
                    </div>
                </div>
                <div className="card-header-actions">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={toggleExpand}
                        className="expand-button"
                    >
                        {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                    <div className="action-buttons">
                        <Button
                            variant="primary"
                            size="sm"
                            className="approve-btn"
                            onClick={() => onApprove(solicitud.id)}
                        >
                            <CheckCircle size={16} />
                            Aprobar
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="reject-btn"
                            onClick={() => onReject(solicitud.id)}
                        >
                            <XCircle size={16} />
                            Rechazar
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardBody className="pending-request-details">
                    <div className="details-section">
                        <h4>Notas</h4>
                        <p className="notes-text">{solicitud.notas || "Sin notas adicionales."}</p>
                    </div>

                    <div className="details-grid">
                        <div className="details-column">
                            <h4><Package size={16} /> Ítems ({solicitud.items.length})</h4>
                            <div className="items-table-container">
                                <table className="items-table">
                                    <thead>
                                        <tr>
                                            <th>Tipo</th>
                                            <th>Descripción</th>
                                            <th className="text-center">Cantidad / Horas</th>
                                            <th className="text-right">Precio Uni. / Tarifa</th>
                                            <th className="text-right">Total Item</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {solicitud.items.map((item) => {
                                            // Use pre-calculated total from mock data, or fallback to calculation if missing
                                            const total = item.total ?? ((item.quantity || 0) * (item.price || 0));
                                            return (
                                                <tr key={item.id}>
                                                    <td>
                                                        <span className="item-type-badge">
                                                            {item.type}
                                                        </span>
                                                    </td>
                                                    <td className="item-desc-cell">{item.description}</td>
                                                    <td className="text-center">{item.quantity}</td>
                                                    <td className="text-right">S/. {item.price?.toLocaleString()}</td>
                                                    <td className="text-right item-total">S/. {total.toLocaleString()}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="details-column">
                            <h4><FileText size={16} /> Documentos Requeridos ({solicitud.documentosRequeridos.length})</h4>
                            <div className="docs-list">
                                {solicitud.documentosRequeridos.map((doc) => (
                                    <div key={doc.id} className="doc-row">
                                        <span className="doc-name">{doc.nombre}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardBody>
            )}
        </Card>
    );
};

export default PendingRequestCard;
