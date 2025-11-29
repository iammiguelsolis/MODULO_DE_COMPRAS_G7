import React from 'react';
import './Checkbox.css';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    className,
    id,
    ...props
}) => {
    const checkboxClassName = `checkbox ${className || ''}`.trim();

    return (
        <div className="checkbox-wrapper">
            <input
                type="checkbox"
                className={checkboxClassName}
                id={id}
                {...props}
            />
            {label && id && (
                <label htmlFor={id} className="checkbox-label">
                    {label}
                </label>
            )}
        </div>
    );
};

export default Checkbox;
