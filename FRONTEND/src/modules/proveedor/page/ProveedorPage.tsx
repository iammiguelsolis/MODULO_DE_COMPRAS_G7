import AddSupplierButton from '../components/molecules/AddSupplierButton';
import SupplierFilters from '../components/organisms/SupplierFilters';
import SupplierTable from '../components/organisms/SupplierTable';
import { useState, useMemo } from 'react';
import AddSupplierModal from '../components/organisms/AddSupplierModal';

const sampleSuppliers = [
    { id: 1, proveedor: "Proveedor A", ruc: "123456789", rubro: "Tecnología", pais: "Perú", clasificacion: 4.5, estado: "Activo", homologacion: "Sí" },
    { id: 2, proveedor: "Proveedor B", ruc: "987654321", rubro: "Alimentos", pais: "Chile", clasificacion: 3, estado: "Inactivo", homologacion: "No" },
    { id: 3, proveedor: "Proveedor C", ruc: "456789123", rubro: "Construcción", pais: "Argentina", clasificacion: 5, estado: "Activo", homologacion: "Sí" }
];


const ProveedorPage = () => {
    const [showNewProviderModal, setShowNewProviderModal] = useState(false);

    const [filters, setFilters] = useState({
        search: "",
        status: "",
        country: "",
        rating: 0,
        risk: ""
    });

    const filteredSuppliers = useMemo(() => {
        return sampleSuppliers.filter(s => {
            const matchSearch =
                filters.search === "" ||
                s.proveedor.toLowerCase().includes(filters.search.toLowerCase()) ||
                s.ruc.includes(filters.search) ||
                s.rubro.toLowerCase().includes(filters.search.toLowerCase());

            const matchStatus = filters.status === "" || s.estado === filters.status;
            const matchCountry = filters.country === "" || s.pais === filters.country;
            const matchRating = filters.rating === 0 || Math.floor(s.clasificacion) >= Math.floor(filters.rating);
            const matchRisk = filters.risk === "" || true;

            return matchSearch && matchStatus && matchCountry && matchRating && matchRisk;
        });
    }, [filters]);

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-8">
                {/* Contenedor de filtros */}
                <div className="bg-white border rounded-2xl border-gray-300 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
                        <AddSupplierButton onClick={() => setShowNewProviderModal(true)} />
                    </div>
                    <SupplierFilters
                        search={filters.search}
                        onSearchChange={(val) => setFilters(prev => ({ ...prev, search: val }))}
                        status={filters.status}
                        onStatusChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
                        country={filters.country}
                        onCountryChange={(val) => setFilters(prev => ({ ...prev, country: val }))}
                        rating={filters.rating}
                        onRatingChange={(val) => setFilters(prev => ({ ...prev, rating: val }))}
                        risk={filters.risk}
                        onRiskChange={(val) => setFilters(prev => ({ ...prev, risk: val }))}
                    />
                </div>

                {/* Tabla: el contenedor */}
                <SupplierTable suppliers={filteredSuppliers} />
            </div>

            {showNewProviderModal && (
                <AddSupplierModal
                    onClose={() => setShowNewProviderModal(false)}
                    onSave={() => {
                        setShowNewProviderModal(false);
                        alert("Proveedor guardado exitosamente");
                    }}
                />
            )}
        </>

    );
}

export default ProveedorPage;
