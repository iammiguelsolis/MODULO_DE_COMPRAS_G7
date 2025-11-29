import React from 'react';
import Label from '../atoms/Label';
import Textarea from '../atoms/Textarea';
import './RejectionJustification.css';

interface RejectionJustificationProps {
    value: string;
    onChange: (value: string) => void;
}

const RejectionJustification: React.FC<RejectionJustificationProps> = ({ value, onChange }) => {
    return (
        <div className="rejection-justification">
            <Label htmlFor="rejection-reason" required>
                Justificación del Rechazo
            </Label>
            <Textarea
                id="rejection-reason"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Describa las razones del rechazo..."
                rows={4}
            />
        </div>
    );
};

export default RejectionJustification;
