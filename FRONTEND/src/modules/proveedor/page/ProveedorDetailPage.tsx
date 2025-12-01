import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import Button from "../components/atoms/Button";
import InputText from "../components/atoms/InputText";
import Select from "../components/atoms/Select";

// Importamos los organismos
import GeneralSection from "../components/organisms/GeneralSection";
import EstadoSection from "../components/organisms/EstadoSection";
import HistorialSection from "../components/organisms/HistorialSection";

// Simulación de datos iniciales (en producción vendrían de una API)
const sampleSupplierData = {
    id: 1,
    razonSocial: "Tecnologías Andinas S.A.C.",
    ruc: "20601234567",
    rubro: "TI & Hardware",
    pais: "Perú",
    direccion: "Av. Principal 123, Lima",
    telefono: "",
    email: "",
    moneda: "PEN",
    estado: "Activo",
    historialCambios: [
        { fecha: "2025-06-01", usuario: "admin", cambio: "Activo → Suspendido", motivo: "Actualización de RUC pendiente" },
        { fecha: "2025-07-15", usuario: "compras01", cambio: "Suspendido → Activo", motivo: "Documentos regularizados" },
    ],
};

const TABS = ["general", "estado", "historial"];

export default function ProveedorDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    // Control del tab por query param
    const tab = searchParams.get("tab") || "general";

    // Estado del proveedor que vamos a editar o mostrar
    const [supplier, setSupplier] = useState(sampleSupplierData);

    // Estado local para edición general (copiar datos para reset)
    const [editMode, setEditMode] = useState(false);
    const [editedSupplier, setEditedSupplier] = useState(supplier);

    // Estado para cambiar pestaña, que cambia el query param "tab"
    function changeTab(t: string) {
        if (!TABS.includes(t)) return;
        setSearchParams({ tab: t });
    }

    // Volver a lista (asumiendo que la ruta de lista es /proveedores)
    function handleBack() {
        navigate("/proveedores");
    }

    // Cuando cambia el id (o la página carga) podríamos cargar la data real (simulado aquí)
    useEffect(() => {
        // Simular fetch:
        // fetch(`/api/proveedores/${id}`).then(res => res.json()).then(data => { setSupplier(data); setEditedSupplier(data); });

        // Por ahora dejamos sampleSupplierData
        // Reiniciamos edición al cambiar proveedor
        setSupplier(sampleSupplierData);
        setEditedSupplier(sampleSupplierData);
        setEditMode(false);
    }, [id]);

    // Funciones para editar campos de proveedor en pestaña General
    function onChangeField(field: keyof typeof editedSupplier, value: string) {
        setEditedSupplier((prev) => ({ ...prev, [field]: value }));
    }

    // Guardar edición General
    function saveGeneralChanges() {
        setSupplier(editedSupplier);
        setEditMode(false);
    }

    // Cancelar edición General
    function cancelGeneralEdit() {
        setEditedSupplier(supplier);
        setEditMode(false);
    }

    // --- Aquí irán funciones para pestaña Estado (confirmación y cambio estado) ---
    // El componente EstadoSection manejará esto mediante props

    // --- Funciones para Historial ---
    // Actualizar historial con nuevos cambios
    function onSaveHistorialChange(updatedSupplier: typeof supplier) {
        setSupplier(updatedSupplier);
        setEditedSupplier(updatedSupplier);
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl p-8 space-y-8">
                <h1 className="text-xl font-semibold text-gray-900 mb-4">Detalle de proveedor</h1>

                {/* Pestañas */}
                <div className="flex gap-2 mb-6">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => changeTab(t)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${t === tab
                                ? "bg-blue-600 text-white"
                                : "bg-white text-black border border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Contenido de pestañas */}
                {tab === "general" && (
                    <GeneralSection
                        supplier={editedSupplier}
                        onChangeField={onChangeField}
                        editMode={editMode}
                        onEdit={() => setEditMode(true)}
                        onSave={saveGeneralChanges}
                        onCancel={cancelGeneralEdit}
                    />
                )}

                {tab === "estado" && (
                    <EstadoSection
                        supplier={supplier}
                        onChangeState={(newState, motivo, fechaInicio, fechaFin) => {
                            // Aquí puedes abrir un modal de confirmación (o alert simple)
                            const confirm = window.confirm(
                                `¿Confirmas cambiar el estado a "${newState}"?`
                            );
                            if (!confirm) return;

                            // Actualizar estado (simulado)
                            setSupplier((prev) => ({
                                ...prev,
                                estado: newState,
                                historialCambios: [
                                    ...prev.historialCambios,
                                    {
                                        fecha: new Date().toISOString().slice(0, 10),
                                        usuario: "usuarioActual",
                                        cambio: `${prev.estado} → ${newState}`,
                                        motivo,
                                    },
                                ],
                            }));

                            // Cambios reflejados también en edición para no perder sincronía
                            setEditedSupplier((prev) => ({
                                ...prev,
                                estado: newState,
                            }));
                        }}
                    />
                )}

                {tab === "historial" && (
                    <HistorialSection
                        supplier={supplier}
                        onSaveChanges={onSaveHistorialChange}
                    />
                )}

                {/* Botón Volver abajo a la derecha */}
                <div className="flex justify-end mt-10">
                    <Button variant="primary" onClick={handleBack}>
                        Volver
                    </Button>
                </div>
            </div>
        </div>
    );
}
