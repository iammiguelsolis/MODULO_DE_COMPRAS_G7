import React from 'react';
import './FormGroup.css';

interface FormGroupProps {
    children: React.ReactNode;
    className?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ children, className }) => {
    const groupClassName = `form-group ${className || ''}`.trim();

    return (
        <div className={groupClassName}>
            {children}
        </div>
    );
};

export default FormGroup;
