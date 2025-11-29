import React from 'react';
import './Select.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
}

const Select: React.FC<SelectProps> = ({
    error = false,
    className,
    children,
    ...props
}) => {
    const selectClassName = `select ${error ? 'select-error' : ''} ${className || ''}`.trim();

    return (
        <select className={selectClassName} {...props}>
            {children}
        </select>
    );
};

export default Select;
