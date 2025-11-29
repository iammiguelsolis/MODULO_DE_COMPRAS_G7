import React from 'react';
import './IconButton.css';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    variant?: 'default' | 'danger';
    ariaLabel: string;
}

const IconButton: React.FC<IconButtonProps> = ({
    icon,
    variant = 'default',
    ariaLabel,
    className,
    ...props
}) => {
    const buttonClassName = `icon-button icon-button-${variant} ${className || ''}`.trim();

    return (
        <button
            className={buttonClassName}
            aria-label={ariaLabel}
            type="button"
            {...props}
        >
            {icon}
        </button>
    );
};

export default IconButton;
