import SearchInput from "../molecules/SearchInput";
import StatusSelect from "../molecules/StatusSelect";
import CountrySelect from "../molecules/CountrySelect";
import RiskSelect from "../molecules/RiskSelect";
import StarSlider from "../molecules/StarSlider";

interface SupplierFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;

    status?: string;
    onStatusChange: (value: string) => void;

    country?: string;
    onCountryChange: (value: string) => void;

    rating: number;
    onRatingChange: (value: number) => void;

    risk?: string;
    onRiskChange: (value: string) => void;
}

export default function SupplierFilters({
    search,
    onSearchChange,
    status,
    onStatusChange,
    country,
    onCountryChange,
    rating,
    onRatingChange,
    risk,
    onRiskChange,
}: SupplierFiltersProps) {
    return (
        <div className="grid grid-cols-12 gap-10 pr-20">
            <div className="relative col-span-4">
                <SearchInput value={search} onChange={onSearchChange} />
            </div>
            <div className="relative col-span-2">
                <StatusSelect value={status} onChange={onStatusChange} />
            </div>
            <div className="relative col-span-2">
                <CountrySelect value={country} onChange={onCountryChange} />
            </div>
            <div className="relative col-span-2">
                <StarSlider value={rating} onChange={onRatingChange} />
            </div>
            <div className="relative col-span-2">
                <RiskSelect value={risk} onChange={onRiskChange} />
            </div>
        </div>
    );
}
