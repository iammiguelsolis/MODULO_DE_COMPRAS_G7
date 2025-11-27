import React from 'react';
import './FilterPanel.css';
import { X } from 'lucide-react';
import Card from '../atoms/Card';
import Select from '../atoms/Select';
import Input from '../atoms/Input';
import Label from '../atoms/Label';
import Button from '../atoms/Button';
import SearchInput from '../molecules/SearchInput';
import type { FilterBarProps } from '../../lib/types';
import { estados_li } from '../../lib/constants';


const FilterPanel: React.FC<FilterBarProps> = ({
    searchQuery, onSearchQueryChange,
    status, onStatusChange,
    startDate, onStartDateChange,
    endDate, onEndDateChange,
    onApplyFilters,
    onClearFilters
}) => {

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onStartDateChange(e.target.value);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onEndDateChange(e.target.value);
    };

    return (
        <Card className="filter-panel-card">
            <div className="filter-grid">
                <div className="filter-item search-filter">
                    <Label htmlFor="search">Buscar por Título o ID</Label>
                    <SearchInput
                        id="search"
                        placeholder="E.g., Compra de equipo..."
                        value={searchQuery}
                        onChange={(e) => onSearchQueryChange(e.target.value)}
                    />
                </div>

                <div className="filter-item">
                    <Label htmlFor="status">Estado</Label>
                    <Select id="status" value={status} onChange={(e) => onStatusChange(e.target.value)}>
                        <option value="">Todos</option>
                        {estados_li.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                    </Select>
                </div>

                <div className="filter-item">
                    <Label htmlFor="start-date">Fecha Desde</Label>
                    <Input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        max={endDate || undefined}
                    />
                </div>

                <div className="filter-item">
                    <Label htmlFor="end-date">Fecha Hasta</Label>
                    <Input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        min={startDate || undefined}
                    />
                </div>
            </div>
            <div className="filter-actions">
                <Button variant="secondary" size="sm" onClick={onClearFilters}>
                    <X size={16} />
                    <span>Limpiar Filtros</span>
                </Button>
                <Button variant="primary" size="sm" onClick={onApplyFilters}>
                    <span>Aplicar Filtros</span>
                </Button>
            </div>
        </Card>
    );
};

export default FilterPanel;
