import React from 'react';
import Label from '../atoms/Label';
import Select from '../atoms/Select';
import './ProviderSelectorCard.css';

interface Supplier {
    id: number;
    name: string;
    ruc: string;
}

interface ProviderSelectorCardProps {
    suppliers: Supplier[];
    selectedSupplierId: number | null;
    onSelectSupplier: (supplierId: number) => void;
    totalFiles?: number;
    evaluatedFiles?: number;
}

const ProviderSelectorCard: React.FC<ProviderSelectorCardProps> = ({
    suppliers,
    selectedSupplierId,
    onSelectSupplier,
    totalFiles = 0,
    evaluatedFiles = 0
}) => {
    const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);

    return (
        <div className="provider-selector-card">
            <div className="provider-selector-field">
                <Label>
                    Seleccionar Proveedor <span className="required">*</span>
                </Label>
                <Select
                    value={selectedSupplierId || ''}
                    onChange={(e) => onSelectSupplier(Number(e.target.value))}
                >
                    <option value="">-- Seleccione un proveedor para evaluar --</option>
                    {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                            {supplier.name} - RUC: {supplier.ruc}
                        </option>
                    ))}
                </Select>
            </div>

            {selectedSupplier && (
                <div className="provider-info-banner">
                    <div className="provider-info-row">
                        <span className="provider-label">Proveedor:</span>
                        <span className="provider-value">{selectedSupplier.name}</span>
                    </div>
                    <div className="provider-info-row">
                        <span className="provider-label">RUC:</span>
                        <span className="provider-value">{selectedSupplier.ruc}</span>
                    </div>
                    <div className="provider-info-row">
                        <span className="provider-label">Archivos:</span>
                        <span className="provider-value">
                            {evaluatedFiles} / {totalFiles} evaluados
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderSelectorCard;
