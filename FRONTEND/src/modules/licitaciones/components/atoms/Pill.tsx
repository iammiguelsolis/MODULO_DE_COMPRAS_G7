import React from 'react';
import './Pill.css';

interface PillProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
    onRemove?: () => void;
    className?: string;
}

const Pill: React.FC<PillProps> = ({
    children,
    variant = 'primary',
    onRemove,
    className
}) => {
    const pillClassName = `pill pill-${variant} ${className || ''}`.trim();

    return (
        <div className={pillClassName}>
            <span className="pill-text">{children}</span>
            {onRemove && (
                <button
                    className="pill-remove"
                    onClick={onRemove}
                    type="button"
                    aria-label="Eliminar"
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default Pill;
