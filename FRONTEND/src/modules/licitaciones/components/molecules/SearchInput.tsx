import React from 'react';
import { Search } from 'lucide-react';
import Input from '../atoms/Input';
import './SearchInput.css';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onSearch?: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
    onSearch,
    onChange,
    ...props
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e);
        }
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    return (
        <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <Input
                type="text"
                className="search-input"
                onChange={handleChange}
                {...props}
            />
        </div>
    );
};

export default SearchInput;
