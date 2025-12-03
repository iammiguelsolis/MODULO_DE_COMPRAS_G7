import React from 'react';
import Input from '../atoms/Input';
import Select from '../atoms/Select';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  estadoFilter: string;
  onEstadoChange: (value: string) => void;
  monedaFilter: string;
  onMonedaChange: (value: string) => void;
  rangoFechas: string;
  onRangoChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  estadoFilter,
  onEstadoChange,
  monedaFilter,
  onMonedaChange,
  rangoFechas,
  onRangoChange
}) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-4">
        <Input
          placeholder="Número, proveedor, OC..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="col-span-2">
        <Select
          value={estadoFilter}
          onChange={(e) => onEstadoChange(e.target.value)}
          options={[
            { value: 'Todos', label: 'Todos' },
            { value: 'BORRADOR', label: 'Borrador' },
            { value: 'APROBADA', label: 'Aprobada' }
          ]}
        />
      </div>
      <div className="col-span-2">
        <Select
          value={monedaFilter}
          onChange={(e) => onMonedaChange(e.target.value)}
          options={[
            { value: 'Todas', label: 'Todas' },
            { value: 'PEN', label: 'PEN' },
            { value: 'USD', label: 'USD' }
          ]}
        />
      </div>
      <div className="col-span-4">
        <Input
          value={rangoFechas}
          onChange={(e) => onRangoChange(e.target.value)}
          placeholder="Últimos 30 días"
        />
      </div>
    </div>
  );
};

export default SearchBar;