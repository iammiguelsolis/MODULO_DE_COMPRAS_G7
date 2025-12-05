import AddSupplierButton from '../components/molecules/AddSupplierButton';
import SupplierFilters from '../components/organisms/SupplierFilters';
import SupplierTable from '../components/organisms/SupplierTable';
import { useState, useMemo, useEffect } from 'react';
import AddSupplierModal from '../components/organisms/AddSupplierModal';
import { ProveedoresApi } from '../../../services/proveedor/api';
import type { Proveedor } from '../../../services/proveedor/types';

// Datos de ejemplo (fallback cuando no hay backend)
const sampleSuppliers: Proveedor[] = [
    { id: 1, razonSocial: "Proveedor A SAC", ruc: "20123456789", pais: "Perú", clasificacion: 4.5, estado: "ACTIVO", email: "a@test.com", telefono: "999888777", direccion: "Av. Test 123" },
    { id: 2, razonSocial: "Proveedor B LTDA", ruc: "20987654321", pais: "Chile", clasificacion: 3, estado: "INACTIVO", email: "b@test.com", telefono: "999888777", direccion: "Av. Test 456" },
    { id: 3, razonSocial: "Proveedor C SA", ruc: "20456789123", pais: "Argentina", clasificacion: 5, estado: "ACTIVO", email: "c@test.com", telefono: "999888777", direccion: "Av. Test 789" },
    { id: 4, razonSocial: "Proveedor D Corp", ruc: "20111222333", pais: "Perú", clasificacion: 4, estado: "PENDIENTE", email: "d@test.com", telefono: "999888777", direccion: "Av. Test 012" }
];

const ProveedorPage = () => {
    const [showNewProviderModal, setShowNewProviderModal] = useState(false);
    const [suppliers, setSuppliers] = useState<Proveedor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState({
        search: "",
        status: "",
        country: "",
        rating: 0
    });

    // Función para obtener proveedores desde la API
    const fetchSuppliers = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await ProveedoresApi.listar();
            setSuppliers(data);
        } catch (err) {
            console.error("Error al cargar proveedores:", err);
            const errorMessage = err instanceof Error ? err.message : "Error desconocido";
            setError(errorMessage);
            // Fallback: usar datos de ejemplo si falla la API
            setSuppliers(sampleSuppliers);
        } finally {
            setLoading(false);
        }
    };

    // Cargar proveedores al montar el componente
    useEffect(() => {
        fetchSuppliers();
    }, []);

    // Filtrado en FRONTEND (todos los filtros funcionan aquí)
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter((s) => {
            // Filtro de búsqueda (por razón social o RUC)
            const matchSearch =
                filters.search === "" ||
                s.razonSocial.toLowerCase().includes(filters.search.toLowerCase()) ||
                s.ruc.includes(filters.search);

            // Filtro de estado
            const matchStatus = filters.status === "" || s.estado === filters.status;

            // Filtro de país
            const matchCountry = filters.country === "" || s.pais === filters.country;

            // Filtro de clasificación (rating)
            const matchRating = filters.rating === 0 || Math.floor(s.clasificacion) >= Math.floor(filters.rating);

            return matchSearch && matchStatus && matchCountry && matchRating;
        });
    }, [suppliers, filters]);

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
                    />

                    {/* Mensaje de estado */}
                    {loading && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                ⏳ Cargando proveedores...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                ⚠️ Error al conectar con la API. Mostrando datos de ejemplo.
                            </p>
                            <p className="text-xs text-yellow-600 mt-1">{error}</p>
                        </div>
                    )}
                </div>

                {/* Tabla */}
                <SupplierTable suppliers={filteredSuppliers} />
            </div>

            {showNewProviderModal && (
                <AddSupplierModal
                    onClose={() => setShowNewProviderModal(false)}
                    onSave={() => {
                        setShowNewProviderModal(false);
                        fetchSuppliers(); // Recargar lista después de guardar
                        alert("Proveedor guardado exitosamente");
                    }}
                />
            )}
        </>
    );
}

export default ProveedorPage;