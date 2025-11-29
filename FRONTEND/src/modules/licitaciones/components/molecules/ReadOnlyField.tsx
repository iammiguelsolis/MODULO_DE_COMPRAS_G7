import React from 'react';
import Label from '../atoms/Label';
import './ReadOnlyField.css';

interface ReadOnlyFieldProps {
    label: string;
    value: string | number;
    className?: string;
}


const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({ label, value, className }) => {
    const fieldClassName = `readonly-field ${className || ''}`.trim();

    return (
        <div className={fieldClassName}>
            <Label>{label}</Label>
            <p>{value}</p>
        </div>
    );
};

export default ReadOnlyField;
