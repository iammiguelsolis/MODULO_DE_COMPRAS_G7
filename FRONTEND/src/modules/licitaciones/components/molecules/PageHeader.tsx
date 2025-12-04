import React from 'react';
import './PageHeader.css';

interface PageHeaderProps {
    title: string;
    description?: React.ReactNode;
    className?: string;
    action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, className, action }) => {
    const headerClassName = `page-header ${className || ''}`.trim();

    return (
        <header className={headerClassName}>
            <div className="page-header-content">
                <h1>{title}</h1>
                {description && <div className="page-header-description">{description}</div>}
            </div>
            {action && <div className="page-header-action">{action}</div>}
        </header>
    );
};

export default PageHeader;
