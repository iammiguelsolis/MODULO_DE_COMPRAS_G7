import React from 'react';
import Card from '../atoms/Card';
import CardHeader from '../atoms/CardHeader';
import CardBody from '../atoms/CardBody';
import ReadOnlyField from '../molecules/ReadOnlyField';
import type { LicitacionGeneralInfoProps } from '../../lib/types';
import './LicitacionGeneralInfo.css';

const LicitacionGeneralInfo: React.FC<LicitacionGeneralInfoProps> = ({
    presupuesto = 'S/. 45,000.00',
    solicitudOrigen = 'N° 2025123',
    fechaLimite = '10 Nov 2025',
    comprador = 'Samnuel Luque'
}) => {
    return (
        <Card>
            <CardHeader>
                <h2>Información General</h2>
            </CardHeader>
            <CardBody>
                <div className="general-info-grid">
                    <ReadOnlyField label="Presupuesto Máximo" value={presupuesto} />
                    <ReadOnlyField label="Solicitud de Origen" value={solicitudOrigen} />
                    <ReadOnlyField label="Fecha límite para recibir propuestas" value={fechaLimite} />
                    <ReadOnlyField label="Comprador" value={comprador} />
                </div>
            </CardBody>
        </Card>
    );
};

export default LicitacionGeneralInfo;
