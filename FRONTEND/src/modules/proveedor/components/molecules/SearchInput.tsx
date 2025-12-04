import InputText from "../atoms/InputText";
import { Search } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
    return (
        <div className="flex flex-col items-left">
            <span className="mb-2 text-sm text-gray-600">Buscar</span>
            <div className="relative">
                <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                <InputText
                    value={value}
                    onChange={onChange}
                    placeholder="Nombre, RUC, rubro..."
                    fullWidth
                />
            </div>
        </div>

    );
}
