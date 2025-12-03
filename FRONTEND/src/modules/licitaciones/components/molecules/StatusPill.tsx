import React from 'react';
import './StatusPill.css';
import {
  FilePenLine,      // BORRADOR
  AlertCircle,      // NUEVA
  Send,             // EN INVITACION
  FileText,         // CON PROPUESTAS
  Clock,            // EN EVALUACION
  Award,            // ADJUDICADA
  ClipboardCheck,   // CON CONTRATO
  CheckCircle2,     // FINALIZADA
  XCircle,          // CANCELADA
} from 'lucide-react';

interface StatusPillProps {
  status: string;
}

const ICONS: { [key: string]: React.ReactElement } = {
  BORRADOR: <FilePenLine size={14} />,
  NUEVA: <AlertCircle size={14} />,
  'EN INVITACION': <Send size={14} />,
  'CON PROPUESTAS': <FileText size={14} />,
  'EN EVALUACION': <Clock size={14} />,
  ADJUDICADA: <Award size={14} />,
  'CON CONTRATO': <ClipboardCheck size={14} />,
  FINALIZADA: <CheckCircle2 size={14} />,
  CANCELADA: <XCircle size={14} />,
};

const STATUS_STYLES: { [key: string]: { text: string; className: string } } = {
  BORRADOR: { text: 'Borrador', className: 'status-blue' },
  NUEVA: { text: 'Nueva', className: 'status-blue' },
  'EN INVITACION': { text: 'En invitación', className: 'status-blue' },
  'CON PROPUESTAS': { text: 'Con propuestas', className: 'status-blue' },
  'EN EVALUACION': { text: 'En evaluación', className: 'status-blue' },
  ADJUDICADA: { text: 'Adjudicada', className: 'status-blue' },
  'CON CONTRATO': { text: 'Con contrato', className: 'status-blue' },
  FINALIZADA: { text: 'Finalizada', className: 'status-green' },
  CANCELADA: { text: 'Cancelada', className: 'status-red' },
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const normalizedStatus = status.toUpperCase().replace(/\s+/g, ' ');
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
