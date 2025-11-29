import React from 'react';
import './PageHeader.css';

interface PageHeaderProps {
    title: string;
    description?: React.ReactNode;
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, className }) => {
    const headerClassName = `page-header ${className || ''}`.trim();

    return (
        <header className={headerClassName}>
            <h1>{title}</h1>
            {description && <div className="page-header-description">{description}</div>}
        </header>
    );
};

export default PageHeader;
