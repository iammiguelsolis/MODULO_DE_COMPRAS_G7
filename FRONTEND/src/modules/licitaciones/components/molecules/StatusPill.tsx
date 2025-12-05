import React from 'react';
import './StatusPill.css';
import {
  Clock,            // PENDIENTE y EN EVALUACION
  AlertCircle,      // NUEVA
  Send,             // EN INVITACION
  FileText,         // CON PROPUESTAS
  Award,            // ADJUDICADA
  ClipboardCheck,   // CON CONTRATO
  CheckCircle2,     // FINALIZADA
  XCircle,          // CANCELADA
} from 'lucide-react';

interface StatusPillProps {
  status: string;
}

const ICONS: { [key: string]: React.ReactElement } = {
  PENDIENTE: <Clock size={14} />,
  NUEVA: <AlertCircle size={14} />,
  EN_INVITACION: <Send size={14} />,
  CON_PROPUESTAS: <FileText size={14} />,
  EVALUACION_TECNICA: <Clock size={14} />,
  EVALUACION_ECONOMIA: <Clock size={14} />,
  EN_EVALUACION: <Clock size={14} />, // Fallback
  ADJUDICADA: <Award size={14} />,
  CON_CONTRATO: <ClipboardCheck size={14} />,
  FINALIZADA: <CheckCircle2 size={14} />,
  CANCELADA: <XCircle size={14} />,
};

const STATUS_STYLES: { [key: string]: { text: string; className: string } } = {
  PENDIENTE: { text: 'Pendiente', className: 'status-gray' },
  NUEVA: { text: 'Nueva', className: 'status-blue' },
  EN_INVITACION: { text: 'En invitación', className: 'status-blue' },
  CON_PROPUESTAS: { text: 'Con propuestas', className: 'status-blue' },
  EVALUACION_TECNICA: { text: 'Evaluación', className: 'status-blue' },
  EVALUACION_ECONOMIA: { text: 'Evaluación', className: 'status-blue' },
  EN_EVALUACION: { text: 'En evaluación', className: 'status-blue' },
  ADJUDICADA: { text: 'Adjudicada', className: 'status-blue' },
  CON_CONTRATO: { text: 'Con contrato', className: 'status-blue' },
  FINALIZADA: { text: 'Finalizada', className: 'status-green' },
  CANCELADA: { text: 'Cancelada', className: 'status-red' },
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  // Normalizamos: mayúsculas y reemplazamos espacios por guiones bajos si vienen del backend
  const normalizedStatus = status.toUpperCase().replace(/\s+/g, '_');
  const style = STATUS_STYLES[normalizedStatus] || { text: status, className: 'status-gray' };
  const icon = ICONS[normalizedStatus];

  return (
    <div className={`status-pill ${style.className}`}>
      {icon}
      <span>{style.text}</span>
    </div>
  );
};

export default StatusPill;
