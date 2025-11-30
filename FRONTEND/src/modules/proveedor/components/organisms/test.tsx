import SupplierFilters from "../organisms/SupplierFilters";
import { useState } from "react";

export default function TestPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [country, setCountry] = useState("");
    const [rating, setRating] = useState(0);
    const [risk, setRisk] = useState("");

    return (
        <div>
            <SupplierFilters
                search={search}
                onSearchChange={setSearch}
                status={status}
                onStatusChange={setStatus}
                country={country}
                onCountryChange={setCountry}
                rating={rating}
                onRatingChange={setRating}
                risk={risk}
                onRiskChange={setRisk}
            />
            <div className="mt-6">
                <pre className="bg-gray-100 p-4 rounded">
                    {JSON.stringify({ search, status, country, rating, risk }, null, 2)}
                </pre>
            </div>
        </div>
    );
}
