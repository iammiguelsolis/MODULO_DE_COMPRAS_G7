import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Checkbox from '../atoms/Checkbox';
import './CustomDropdown.css';

interface CustomDropdownProps {
    options: Array<{ id: string; name: string }>;
    selected: string[];
    onChange: (selected: string[]) => void;
    requiredIds?: string[];
    placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    options,
    selected,
    onChange,
    requiredIds = [],
    placeholder = 'Seleccionar documento...'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleOptionClick = (optionId: string) => {
        if (requiredIds.includes(optionId)) return;

        const newSelected = selected.includes(optionId)
            ? selected.filter(id => id !== optionId)
            : [...selected, optionId];
        onChange(newSelected);
    };

    const handleSelectAll = () => {
        if (selected.length === options.length) {
            onChange(requiredIds);
        } else {
            onChange(options.map(opt => opt.id));
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="custom-select-wrapper" ref={dropdownRef}>
            <div className={`custom-select ${isOpen ? 'open' : ''}`} onClick={handleToggle}>
                <div className="custom-select-trigger">
                    <span>{placeholder}</span>
                    <ChevronDown size={20} className={`chevron ${isOpen ? 'open' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="custom-options">
                    <div className="option-item select-all-item">
                        <Checkbox
                            id="select-all-dropdown"
                            label="Seleccionar Todos"
                            checked={selected.length === options.length}
                            onChange={handleSelectAll}
                        />
                    </div>
                    {options.map(option => (
                        <div key={option.id} className="option-item">
                            <Checkbox
                                id={option.id}
                                label={option.name}
                                checked={selected.includes(option.id)}
                                onChange={() => handleOptionClick(option.id)}
                                disabled={requiredIds.includes(option.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
