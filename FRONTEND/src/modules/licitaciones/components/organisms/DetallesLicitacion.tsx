import React from 'react';
import Card from '../atoms/Card';
import CardHeader from '../atoms/CardHeader';
import CardBody from '../atoms/CardBody';
import FormGroup from '../atoms/FormGroup';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import ErrorMessage from '../atoms/ErrorMessage';
import './DetallesLicitacion.css';

interface DetallesLicitacionProps {
  presupuestoMaximo: number | string;
  onPresupuestoChange: (value: number | string) => void;
  deadline: string;
  onDeadlineChange: (value: string) => void;
  totalAmount: number;
  presupuestoError?: string;
  deadlineError?: string;
}


const DetallesLicitacion: React.FC<DetallesLicitacionProps> = ({
  presupuestoMaximo,
  onPresupuestoChange,
  deadline,
  onDeadlineChange,
  presupuestoError,
  deadlineError
}) => {

  return (
    <Card>
      <CardHeader>
        <h2>Detalles de la Licitación</h2>
        <p>Complete la información específica para este proceso de licitación</p>
      </CardHeader>
      <CardBody>
        <div className="licitacion-details-grid">

          <FormGroup>
            <Label htmlFor="presupuesto">Presupuesto Máximo</Label>
            <div className="input-group">
              <span className="input-group-text">S/</span>
              <Input
                type="number"
                id="presupuesto"
                value={presupuestoMaximo}
                onChange={(e) => onPresupuestoChange(e.target.value)}
                placeholder="0.00"
                min="0"
              />
            </div>
            {presupuestoError && <ErrorMessage>{presupuestoError}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="fecha-limite">Fecha Límite para Recibir Propuestas</Label>
            <Input
              type="date"
              id="fecha-limite"
              value={deadline}
              onChange={(e) => onDeadlineChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            {deadlineError && <ErrorMessage>{deadlineError}</ErrorMessage>}
          </FormGroup>

        </div>
      </CardBody>
    </Card>
  );
};

export default DetallesLicitacion;
