import React from 'react';
import Pill from '../atoms/Pill';
import EmptyState from './EmptyState';
import './PillList.css';

interface PillListProps {
    selectedIds: string[];
    options: Array<{ id: string; nombre: string }>;
    onRemove: (id: string) => void;
    requiredIds?: string[];
    emptyMessage?: string;
    emptyStateVariant?: 'default' | 'error';
}

const PillList: React.FC<PillListProps> = ({
    selectedIds,
    options,
    onRemove,
    requiredIds = [],
    emptyMessage = 'No se han seleccionado documentos',
    emptyStateVariant = 'default'
}) => {
    const getOptionName = (id: string) => options.find(opt => opt.id === id)?.nombre || id;

    if (selectedIds.length === 0) {
        return <EmptyState message={emptyMessage} variant={emptyStateVariant} />;
    }

    return (
        <div className="selected-pills-container">
            {selectedIds.map(id => {
                const isRequired = requiredIds.includes(id);
                return (
                    <Pill
                        key={id}
                        variant={isRequired ? 'secondary' : 'primary'}
                        onRemove={isRequired ? undefined : () => onRemove(id)}
                        className={isRequired ? 'pill-required' : ''}
                    >
                        {getOptionName(id)}
                    </Pill>
                );
            })}
        </div>
    );
};

export default PillList;
