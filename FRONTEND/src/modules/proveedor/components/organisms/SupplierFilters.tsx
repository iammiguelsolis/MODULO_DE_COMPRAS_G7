import SearchInput from "../molecules/SearchInput";
import StatusSelect from "../molecules/StatusSelect";
import CountrySelect from "../molecules/CountrySelect";
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
}: SupplierFiltersProps) {
    return (
        <div className="grid grid-cols-10 gap-10 pr-20">
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
        </div>
    );
}
