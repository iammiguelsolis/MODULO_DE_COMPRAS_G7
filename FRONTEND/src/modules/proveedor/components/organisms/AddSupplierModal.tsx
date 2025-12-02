import React, { useState } from "react";
import { X } from "lucide-react";
import InputLabel from "../atoms/InputLabel";
import Button from "../atoms/Button";
import NumericInputLabel from "../atoms/NumericInputLabel";
import SelectLabel from "../atoms/SelectLabel";

interface AddSupplierModalProps {
    onClose: () => void;
    onSave: () => void;
}

interface SupplierData {
    razonSocial: string;
    ruc: string;
    rubro: string;
    pais: string;
    direccion: string;
    telefono: string;
    email: string;
    moneda: string;
}

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({ onClose, onSave }) => {
    const [supplierData, setSupplierData] = useState<SupplierData>({
        razonSocial: '',
        ruc: '',
        rubro: '',
        pais: '',
        direccion: '',
        telefono: '',
        email: '',
        moneda: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Opciones para los selectores
    const paisesOptions = [
        { value: "Perú", label: "Perú" },
        { value: "Chile", label: "Chile" },
        { value: "Argentina", label: "Argentina" },
        { value: "Colombia", label: "Colombia" },
        { value: "Ecuador", label: "Ecuador" },
        { value: "Bolivia", label: "Bolivia" },
        { value: "Brasil", label: "Brasil" },
        { value: "México", label: "México" },
        { value: "Estados Unidos", label: "Estados Unidos" },
        { value: "España", label: "España" },
    ];

    const monedasOptions = [
        { value: "PEN", label: "PEN - Sol Peruano" },
        { value: "USD", label: "USD - Dólar Americano" },
        { value: "EUR", label: "EUR - Euro" },
        { value: "CLP", label: "CLP - Peso Chileno" },
        { value: "ARS", label: "ARS - Peso Argentino" },
        { value: "COP", label: "COP - Peso Colombiano" },
        { value: "BRL", label: "BRL - Real Brasileño" },
        { value: "MXN", label: "MXN - Peso Mexicano" },
    ];

    const handleSave = async () => {
        // Validación básica
        if (!supplierData.razonSocial || !supplierData.ruc || !supplierData.pais || !supplierData.direccion) {
            setError("Por favor completa todos los campos obligatorios (*)");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // IMPORTANTE: Reemplaza esta URL cuando tengas el backend
            const API_BASE_URL = "http://localhost:8080/api"; // 👈 CAMBIA ESTO

            const response = await fetch(`${API_BASE_URL}/proveedores`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(supplierData),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Proveedor creado:", data);

            // Llamar al callback de éxito
            onSave();
        } catch (err) {
            console.error("Error al guardar proveedor:", err);
            const errorMessage = err instanceof Error ? err.message : "Error desconocido";
            setError(`Error al guardar: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Registrar Proveedor</h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Sección 1: Información del Proveedor */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Proveedor</h3>

                        {/* Fila 1 */}
                        <div className="grid grid-cols-12 gap-6 mb-4">
                            <div className="col-span-6">
                                <InputLabel
                                    label="Razón Social *"
                                    value={supplierData.razonSocial}
                                    onChange={(e) => setSupplierData({ ...supplierData, razonSocial: e })}
                                    placeholder=""
                                    fullWidth
                                />
                            </div>
                            <div className="col-span-3">
                                <NumericInputLabel
                                    label="RUC *"
                                    value={supplierData.ruc}
                                    onChange={(e) => setSupplierData({ ...supplierData, ruc: e })}
                                    placeholder=""
                                    fullWidth
                                />
                            </div>
                            <div className="col-span-3">
                                <SelectLabel
                                    label="País *"
                                    value={supplierData.pais}
                                    onChange={(e) => setSupplierData({ ...supplierData, pais: e })}
                                    options={paisesOptions}
                                    placeholder="Seleccionar país"
                                    fullWidth
                                />
                            </div>
                        </div>

                        {/* Fila 2 */}
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-3">
                                <SelectLabel
                                    label="Moneda Preferida"
                                    value={supplierData.moneda}
                                    onChange={(e) => setSupplierData({ ...supplierData, moneda: e })}
                                    options={monedasOptions}
                                    placeholder="Seleccionar moneda"
                                    fullWidth
                                />
                            </div>
                            <div className="col-span-5">
                                <InputLabel
                                    label="Rubro"
                                    value={supplierData.rubro}
                                    onChange={(e) => setSupplierData({ ...supplierData, rubro: e })}
                                    placeholder=""
                                    fullWidth
                                />
                            </div>
                        </div>
                    </div>

                    {/* Línea divisora */}
                    <div className="border-t border-gray-200 mb-8"></div>

                    {/* Sección 2: Información de Contacto */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de Contacto</h3>

                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-5">
                                <InputLabel
                                    label="Domicilio Legal *"
                                    value={supplierData.direccion}
                                    onChange={(e) => setSupplierData({ ...supplierData, direccion: e })}
                                    placeholder=""
                                    fullWidth
                                />
                            </div>
                            <div className="col-span-3">
                                <NumericInputLabel
                                    label="Teléfono"
                                    value={supplierData.telefono}
                                    onChange={(e) => setSupplierData({ ...supplierData, telefono: e })}
                                    placeholder="+51"
                                    fullWidth
                                    allowPlus
                                />
                            </div>
                            <div className="col-span-4">
                                <InputLabel
                                    label="Email"
                                    value={supplierData.email}
                                    onChange={(e) => setSupplierData({ ...supplierData, email: e })}
                                    placeholder="ejemplo@empresa.com"
                                    fullWidth
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave}>
                            {loading ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddSupplierModal;