import React from 'react';
import SelectorHeader from './SelectorHeader';
import CustomDropdown from './CustomDropdown';
import PillList from './PillList';
import type { Documento } from '../../lib/types';
import './DocumentSelector.css';

interface DocumentSelectorProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    options: Documento[];
    selected: string[];
    onChange: (selected: string[]) => void;
    requiredIds?: string[];
    emptyStateVariant?: 'default' | 'error';
}

const DocumentSelector: React.FC<DocumentSelectorProps> = ({
    icon,
    title,
    description,
    options,
    selected,
    onChange,
    requiredIds = [],
    emptyStateVariant
}) => {
    const handleRemove = (id: string) => {
        if (requiredIds.includes(id)) return;
        const newSelected = selected.filter(selectedId => selectedId !== id);
        onChange(newSelected);
    };

    return (
        <div className="document-selector-container">
            <SelectorHeader
                icon={icon}
                title={title}
                description={description}
            />

            <CustomDropdown
                options={options}
                selected={selected}
                onChange={onChange}
                requiredIds={requiredIds}
            />

            <PillList
                selectedIds={selected}
                options={options}
                onRemove={handleRemove}
                requiredIds={requiredIds}
                emptyStateVariant={emptyStateVariant}
            />
        </div>
    );
};

export default DocumentSelector;
