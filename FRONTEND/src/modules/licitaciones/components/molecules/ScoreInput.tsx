import React from 'react';
import './ScoreInput.css';

interface ScoreInputProps {
    value: number | '';
    onChange: (value: number | '') => void;
    disabled?: boolean;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ value, onChange, disabled = false }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (inputValue === '') {
            onChange('');
            return;
        }

        const numValue = parseInt(inputValue, 10);

        // Validate range 0-100
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
            onChange(numValue);
        }
    };

    return (
        <div className="score-input-container">
            <label className="score-input-label">
                Puntuación (0-100) <span className="required">*</span>
            </label>
            <div className="score-input-wrapper">
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    className="score-input"
                    placeholder="Ingrese puntuación"
                />
                <span className="score-suffix">/100</span>
            </div>
            <p className="score-input-hint">
                Considere precio, condiciones de pago, plazos y garantías
            </p>
        </div>
    );
};

export default ScoreInput;
