import React from 'react';
import './Textarea.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
    error = false,
    className,
    ...props
}) => {
    const textareaClassName = `textarea ${error ? 'textarea-error' : ''} ${className || ''}`.trim();

    return <textarea className={textareaClassName} {...props} />;
};

export default Textarea;
