import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    prefix?: string;
}

const Input: React.FC<InputProps> = ({
    error = false,
    prefix,
    className,
    ...props
}) => {
    const inputClassName = `input ${error ? 'input-error' : ''} ${className || ''}`.trim();

    if (prefix) {
        return (
            <div className="input-group">
                <span className="input-group-text">{prefix}</span>
                <input className={inputClassName} {...props} />
            </div>
        );
    }

    return <input className={inputClassName} {...props} />;
};

export default Input;
