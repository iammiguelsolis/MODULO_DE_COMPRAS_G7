import React from 'react';
import { Check, X } from 'lucide-react';
import './EvaluationStatusButtons.css';

export type EvaluationStatus = 'correct' | 'incorrect' | null;

interface EvaluationStatusButtonsProps {
    value: EvaluationStatus;
    onChange: (value: EvaluationStatus) => void;
    disabled?: boolean;
}

const EvaluationStatusButtons: React.FC<EvaluationStatusButtonsProps> = ({
    value,
    onChange,
    disabled = false
}) => {
    const handleCorrectClick = () => {
        // Toggle: if already correct, set to null; otherwise set to correct
        onChange(value === 'correct' ? null : 'correct');
    };

    const handleIncorrectClick = () => {
        // Toggle: if already incorrect, set to null; otherwise set to incorrect
        onChange(value === 'incorrect' ? null : 'incorrect');
    };

    return (
        <div className="evaluation-status-buttons">
            <button
                type="button"
                className={`eval-btn eval-btn-correct ${value === 'correct' ? 'active' : ''}`}
                onClick={handleCorrectClick}
                disabled={disabled}
                aria-label="Marcar como correcto"
            >
                <Check size={16} />
                <span>Correcto</span>
            </button>
            <button
                type="button"
                className={`eval-btn eval-btn-incorrect ${value === 'incorrect' ? 'active' : ''}`}
                onClick={handleIncorrectClick}
                disabled={disabled}
                aria-label="Marcar como incorrecto"
            >
                <X size={16} />
                <span>Incorrecto</span>
            </button>
        </div>
    );
};

export default EvaluationStatusButtons;
