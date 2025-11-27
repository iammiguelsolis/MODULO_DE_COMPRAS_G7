import React from 'react';
import './Label.css';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

const Label: React.FC<LabelProps> = ({
    required = false,
    className,
    children,
    ...props
}) => {
    const labelClassName = `label ${className || ''}`.trim();

    return (
        <label className={labelClassName} {...props}>
            {children}
            {required && <span className="label-required">*</span>}
        </label>
    );
};

export default Label;
