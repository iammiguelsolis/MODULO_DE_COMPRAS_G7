import AddSupplierButton from '../components/molecules/AddSupplierButton';
import SupplierFilters from '../components/organisms/SupplierFilters';
import SupplierTable from '../components/organisms/SupplierTable';
import { useState, useMemo, useEffect } from 'react';
import AddSupplierModal from '../components/organisms/AddSupplierModal';

interface Supplier {
    id: number;
    razonSocial: string;
    ruc: string;
    rubro: string;
    pais: string;
    clasificacion: number;
    estado: string;
}

interface ProveedorAPI {
    id: number;
    razonSocial: string;
    ruc: string;
    rubro: string;
    pais: string;
    estado: string;
    email: string;
    clasificacion?: number;
}

// Datos de ejemplo (fallback cuando no hay backend)
const sampleSuppliers: Supplier[] = [
    { id: 1, razonSocial: "Proveedor A SAC", ruc: "20123456789", rubro: "Tecnología", pais: "Perú", clasificacion: 4.5, estado: "ACTIVO" },
    { id: 2, razonSocial: "Proveedor B LTDA", ruc: "20987654321", rubro: "Alimentos", pais: "Chile", clasificacion: 3, estado: "INACTIVO" },
    { id: 3, razonSocial: "Proveedor C SA", ruc: "20456789123", rubro: "Construcción", pais: "Argentina", clasificacion: 5, estado: "ACTIVO" },
    { id: 4, razonSocial: "Proveedor D Corp", ruc: "20111222333", rubro: "Tecnología", pais: "Perú", clasificacion: 4, estado: "PENDIENTE" }
];

const ProveedorPage = () => {
    const [showNewProviderModal, setShowNewProviderModal] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
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
            // IMPORTANTE: Reemplaza esta URL cuando tengas el backend
            const API_BASE_URL = "http://localhost:8080/api"; // 👈 CAMBIA ESTO

            // Construir parámetros de query para la API
            const params = new URLSearchParams();
            if (filters.status) params.append("estado", filters.status);
            if (filters.search) params.append("busqueda", filters.search);

            const url = `${API_BASE_URL}/proveedores?${params.toString()}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data: ProveedorAPI[] = await response.json();

            // Mapear los datos de la API al formato que usa tu tabla
            const mappedData: Supplier[] = data.map((proveedor) => ({
                id: proveedor.id,
                razonSocial: proveedor.razonSocial, // API usa "razonSocial", tu tabla usa "proveedor"
                ruc: proveedor.ruc,
                rubro: proveedor.rubro,
                pais: proveedor.pais,
                clasificacion: proveedor.clasificacion || 0, // Si la API no devuelve clasificación
                estado: proveedor.estado
            }));

            setSuppliers(mappedData);
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

    // Cargar proveedores al montar el componente y cuando cambien los filtros de API
    useEffect(() => {
        fetchSuppliers();
    }, [filters.status, filters.search]);

    // Filtrado en FRONTEND (país y clasificación)
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter((s) => {
            const matchCountry = filters.country === "" || s.pais === filters.country;
            const matchRating = filters.rating === 0 || Math.floor(s.clasificacion) >= Math.floor(filters.rating);

            return matchCountry && matchRating;
        });
    }, [suppliers, filters.country, filters.rating]);

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