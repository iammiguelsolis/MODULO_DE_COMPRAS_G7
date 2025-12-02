import React, { useState, useEffect } from "react";
import { X, Plus, Edit2, Trash2, AlertTriangle } from "lucide-react";

// ==================== INTERFACES ====================
interface Supplier {
    id: number;
    razonSocial: string;
    ruc: string;
    rubro: string;
    pais: string;
    direccion: string;
    telefono: string;
    email: string;
    moneda: string;
    estado: string;
}

interface CuentaBancaria {
    id: number;
    banco: string;
    moneda: string;
    numeroCuenta: string;
    cci: string;
    titular: string;
}

interface Contacto {
    id: number;
    nombre: string;
    cargo: string;
    email: string;
    telefono: string;
}

interface SupplierDetailModalProps {
    supplierId: number;
    onClose: () => void;
    onDeactivate?: (id: number) => void;
}

// ==================== COMPONENTES AUXILIARES ====================

// Botón reutilizable
const Button: React.FC<{
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "danger";
    size?: "sm" | "md";
    onClick?: () => void;
    icon?: React.ReactNode;
}> = ({ children, variant = "primary", size = "md", onClick, icon }) => {
    const baseClasses = "rounded-lg font-medium transition-colors flex items-center gap-2";
    const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base";
    const variantClasses = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
        danger: "bg-red-600 text-white hover:bg-red-700"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]}`}
        >
            {icon}
            {children}
        </button>
    );
};

// Campo de información (solo lectura)
const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        <div className="text-sm text-gray-700 font-medium">{value}</div>
    </div>
);

// Input numérico para modales
const NumericInputField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    allowedChars?: string;
}> = ({ label, value, onChange, placeholder, allowedChars = "" }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const pattern = new RegExp(`^[0-9${allowedChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]*$`);

        if (inputValue === "" || pattern.test(inputValue)) {
            onChange(inputValue);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    );
};

// Select para modales
const SelectField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
}> = ({ label, value, onChange, options, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
            <option value="">{placeholder || "Seleccionar..."}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

// Input para modales
const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
}> = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
    </div>
);

// ==================== SUB-MODALES ====================

// Modal para agregar/editar cuenta bancaria
const BankAccountModal: React.FC<{
    account: CuentaBancaria | null;
    onClose: () => void;
    onSave: (account: Omit<CuentaBancaria, "id">) => void;
}> = ({ account, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<CuentaBancaria, "id">>({
        banco: account?.banco || "",
        moneda: account?.moneda || "",
        numeroCuenta: account?.numeroCuenta || "",
        cci: account?.cci || "",
        titular: account?.titular || ""
    });

    const bancoOptions = [
        { value: "BCP", label: "BCP - Banco de Crédito del Perú" },
        { value: "BBVA", label: "BBVA Continental" },
        { value: "Interbank", label: "Interbank" },
        { value: "Scotiabank", label: "Scotiabank Perú" },
        { value: "Banbif", label: "Banbif" },
        { value: "Pichincha", label: "Banco Pichincha" },
        { value: "GNB", label: "GNB Perú" },
        { value: "Santander", label: "Santander Perú" },
        { value: "Otro", label: "Otro" }
    ];

    const monedaOptions = [
        { value: "PEN", label: "PEN - Soles" },
        { value: "USD", label: "USD - Dólares" },
        { value: "EUR", label: "EUR - Euros" }
    ];

    const handleSave = () => {
        if (!formData.banco || !formData.moneda || !formData.numeroCuenta || !formData.titular) {
            alert("Por favor completa todos los campos obligatorios (*)");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {account ? "Editar Cuenta Bancaria" : "Agregar Cuenta Bancaria"}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <SelectField
                        label="Banco *"
                        value={formData.banco}
                        onChange={(v) => setFormData({ ...formData, banco: v })}
                        options={bancoOptions}
                        placeholder="Seleccionar banco"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            label="Moneda *"
                            value={formData.moneda}
                            onChange={(v) => setFormData({ ...formData, moneda: v })}
                            options={monedaOptions}
                            placeholder="Seleccionar"
                        />
                        <NumericInputField
                            label="Número de Cuenta *"
                            value={formData.numeroCuenta}
                            onChange={(v) => setFormData({ ...formData, numeroCuenta: v })}
                            placeholder="001122333444"
                            allowedChars="-"
                        />
                    </div>
                    <NumericInputField
                        label="CCI"
                        value={formData.cci}
                        onChange={(v) => setFormData({ ...formData, cci: v })}
                        placeholder="002-011-0222033344-55"
                        allowedChars="-"
                    />
                    <InputField
                        label="Titular *"
                        value={formData.titular}
                        onChange={(v) => setFormData({ ...formData, titular: v })}
                        placeholder="Nombre del titular"
                    />
                </div>

                <div className="flex gap-2 justify-end mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar</Button>
                </div>
            </div>
        </div>
    );
};

// Modal para agregar/editar contacto
const ContactModal: React.FC<{
    contact: Contacto | null;
    onClose: () => void;
    onSave: (contact: Omit<Contacto, "id">) => void;
}> = ({ contact, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<Contacto, "id">>({
        nombre: contact?.nombre || "",
        cargo: contact?.cargo || "",
        email: contact?.email || "",
        telefono: contact?.telefono || ""
    });

    const handleSave = () => {
        if (!formData.nombre || !formData.email) {
            alert("Por favor completa los campos obligatorios");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {contact ? "Editar Contacto" : "Agregar Contacto"}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <InputField
                        label="Nombre *"
                        value={formData.nombre}
                        onChange={(v) => setFormData({ ...formData, nombre: v })}
                        placeholder="Juan Pérez"
                    />
                    <InputField
                        label="Cargo"
                        value={formData.cargo}
                        onChange={(v) => setFormData({ ...formData, cargo: v })}
                        placeholder="Gerente de Ventas"
                    />
                    <InputField
                        label="Email *"
                        value={formData.email}
                        onChange={(v) => setFormData({ ...formData, email: v })}
                        placeholder="contacto@empresa.com"
                        type="email"
                    />
                    <NumericInputField
                        label="Teléfono"
                        value={formData.telefono}
                        onChange={(v) => setFormData({ ...formData, telefono: v })}
                        placeholder="+51999888777"
                        allowedChars="+ "
                    />
                </div>

                <div className="flex gap-2 justify-end mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar</Button>
                </div>
            </div>
        </div>
    );
};

// Modal de confirmación
const ConfirmModal: React.FC<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: "danger" | "warning";
}> = ({ title, message, onConfirm, onCancel, type = "warning" }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${type === "danger" ? "bg-red-100" : "bg-yellow-100"}`}>
                    <AlertTriangle size={24} className={type === "danger" ? "text-red-600" : "text-yellow-600"} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-gray-600">{message}</p>
                </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
                <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button variant="danger" onClick={onConfirm}>Confirmar</Button>
            </div>
        </div>
    </div>
);

// ==================== COMPONENTE PRINCIPAL ====================

const SupplierDetailModal: React.FC<SupplierDetailModalProps> = ({
    supplierId,
    onClose,
    onDeactivate
}) => {
    // Estados
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [cuentasBancarias, setCuentasBancarias] = useState<CuentaBancaria[]>([]);
    const [contactos, setContactos] = useState<Contacto[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para modales
    const [showBankModal, setShowBankModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [editingBank, setEditingBank] = useState<CuentaBancaria | null>(null);
    const [editingContact, setEditingContact] = useState<Contacto | null>(null);
    const [confirmAction, setConfirmAction] = useState<{
        type: "deactivate" | "deleteBank" | "deleteContact";
        id?: number;
    } | null>(null);

    // Cargar datos (simulado con datos de ejemplo)
    useEffect(() => {
        fetchSupplierData();
    }, [supplierId]);

    const fetchSupplierData = async () => {
        setLoading(true);
        try {
            // SIMULACIÓN: Reemplazar con llamadas API reales
            // const response = await fetch(`/api/proveedores/${supplierId}`);
            // const data = await response.json();

            // Datos de ejemplo
            const mockSupplier: Supplier = {
                id: supplierId,
                razonSocial: "Tecnologías Andinas S.A.C.",
                ruc: "20601234567",
                rubro: "Tecnología",
                pais: "Perú",
                direccion: "Av. Principal 123, Lima",
                telefono: "+51987654321",
                email: "contacto@techandinas.com",
                moneda: "PEN",
                estado: "ACTIVO"
            };

            const mockBanks: CuentaBancaria[] = [
                { id: 1, banco: "BCP", moneda: "PEN", numeroCuenta: "0011-0222-0333", cci: "002-011-0222033344-55", titular: "Tecnologías Andinas S.A.C." },
                { id: 2, banco: "BBVA", moneda: "USD", numeroCuenta: "0011-0444-0555", cci: "011-011-0444055566-77", titular: "Tecnologías Andinas S.A.C." }
            ];

            const mockContacts: Contacto[] = [
                { id: 1, nombre: "Ana García", cargo: "Gerente de Ventas", email: "ana.garcia@techandinas.com", telefono: "+51999888777" },
                { id: 2, nombre: "Luis Rojas", cargo: "Coordinador", email: "luis.rojas@techandinas.com", telefono: "+51988555777" }
            ];

            setSupplier(mockSupplier);
            setCuentasBancarias(mockBanks);
            setContactos(mockContacts);
        } catch (error) {
            console.error("Error al cargar proveedor:", error);
        } finally {
            setLoading(false);
        }
    };

    // Funciones para cuentas bancarias
    const handleSaveBank = async (bankData: Omit<CuentaBancaria, "id">) => {
        try {
            if (editingBank) {
                // EDITAR: PUT /api/proveedores/${supplierId}/cuentas/${editingBank.id}
                setCuentasBancarias(prev => prev.map(b =>
                    b.id === editingBank.id ? { ...bankData, id: b.id } : b
                ));
            } else {
                // AGREGAR: POST /api/proveedores/${supplierId}/cuentas
                const newBank = { ...bankData, id: Date.now() };
                setCuentasBancarias(prev => [...prev, newBank]);
            }
            setShowBankModal(false);
            setEditingBank(null);
        } catch (error) {
            console.error("Error al guardar cuenta bancaria:", error);
        }
    };

    const handleDeleteBank = async (id: number) => {
        try {
            // DELETE /api/proveedores/${supplierId}/cuentas/${id}
            setCuentasBancarias(prev => prev.filter(b => b.id !== id));
            setConfirmAction(null);
        } catch (error) {
            console.error("Error al eliminar cuenta bancaria:", error);
        }
    };

    // Funciones para contactos
    const handleSaveContact = async (contactData: Omit<Contacto, "id">) => {
        try {
            if (editingContact) {
                // EDITAR: PUT /api/proveedores/${supplierId}/contactos/${editingContact.id}
                setContactos(prev => prev.map(c =>
                    c.id === editingContact.id ? { ...contactData, id: c.id } : c
                ));
            } else {
                // AGREGAR: POST /api/proveedores/${supplierId}/contactos
                const newContact = { ...contactData, id: Date.now() };
                setContactos(prev => [...prev, newContact]);
            }
            setShowContactModal(false);
            setEditingContact(null);
        } catch (error) {
            console.error("Error al guardar contacto:", error);
        }
    };

    const handleDeleteContact = async (id: number) => {
        try {
            // DELETE /api/proveedores/${supplierId}/contactos/${id}
            setContactos(prev => prev.filter(c => c.id !== id));
            setConfirmAction(null);
        } catch (error) {
            console.error("Error al eliminar contacto:", error);
        }
    };

    // Desactivar proveedor
    const handleDeactivate = async () => {
        try {
            // PUT /api/proveedores/${supplierId}/estado
            // body: { estado: "INACTIVO" }
            if (onDeactivate) onDeactivate(supplierId);
            setConfirmAction(null);
            onClose();
        } catch (error) {
            console.error("Error al desactivar proveedor:", error);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8">
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!supplier) return null;

    return (
        <>
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] max-h-[90vh] overflow-y-auto">
                    <div className="p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Detalle de Proveedor</h2>
                            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Grid 2x2 */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* 1. Información General */}
                            <div className="border border-gray-300 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información General</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoField label="Razón Social" value={supplier.razonSocial} />
                                    <InfoField label="RUC" value={supplier.ruc} />
                                    <InfoField label="Rubro" value={supplier.rubro} />
                                    <InfoField label="País" value={supplier.pais} />
                                    <InfoField label="Teléfono" value={supplier.telefono} />
                                    <InfoField label="Email" value={supplier.email} />
                                    <InfoField label="Dirección" value={supplier.direccion} />
                                    <InfoField label="Moneda Preferida" value={supplier.moneda} />
                                </div>
                            </div>

                            {/* 2. Cuentas Bancarias */}
                            <div className="border border-gray-300 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Cuentas Bancarias</h3>
                                    <Button
                                        size="sm"
                                        onClick={() => { setEditingBank(null); setShowBankModal(true); }}
                                        icon={<Plus size={16} />}
                                    >
                                        Agregar
                                    </Button>
                                </div>
                                <div className="overflow-x-auto border border-gray-300 rounded-2xl">
                                    <div className="max-h-[280px] overflow-y-auto">
                                        <table className="min-w-full table-auto">
                                            <thead className="sticky top-0">
                                                <tr className="bg-blue-500 text-white uppercase text-sm">
                                                    <th className="px-6 py-4 text-left">Banco</th>
                                                    <th className="px-6 py-4 text-left">Moneda</th>
                                                    <th className="px-6 py-4 text-left">Nº Cuenta</th>
                                                    <th className="px-6 py-4 text-left">Titular</th>
                                                    <th className="px-6 py-4 text-center">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cuentasBancarias.map((cuenta) => (
                                                    <tr key={cuenta.id} className="border-b border-gray-200 hover:bg-gray-50 bg-white">
                                                        <td className="px-6 py-4 text-sm text-gray-700">{cuenta.banco}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{cuenta.moneda}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{cuenta.numeroCuenta}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{cuenta.titular}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex gap-2 justify-center">
                                                                <button
                                                                    onClick={() => { setEditingBank(cuenta); setShowBankModal(true); }}
                                                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                                    title="Editar"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => setConfirmAction({ type: "deleteBank", id: cuenta.id })}
                                                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Contactos */}
                            <div className="border border-gray-300 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Contactos</h3>
                                    <Button
                                        size="sm"
                                        onClick={() => { setEditingContact(null); setShowContactModal(true); }}
                                        icon={<Plus size={16} />}
                                    >
                                        Agregar
                                    </Button>
                                </div>
                                <div className="overflow-x-auto border border-gray-300 rounded-2xl">
                                    <div className="max-h-[280px] overflow-y-auto">
                                        <table className="min-w-full table-auto">
                                            <thead className="sticky top-0">
                                                <tr className="bg-blue-500 text-white uppercase text-sm">
                                                    <th className="px-6 py-4 text-left">Nombre</th>
                                                    <th className="px-6 py-4 text-left">Cargo</th>
                                                    <th className="px-6 py-4 text-left">Email</th>
                                                    <th className="px-6 py-4 text-left">Teléfono</th>
                                                    <th className="px-6 py-4 text-center">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {contactos.map((contacto) => (
                                                    <tr key={contacto.id} className="border-b border-gray-200 hover:bg-gray-50 bg-white">
                                                        <td className="px-6 py-4 text-sm text-gray-700">{contacto.nombre}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{contacto.cargo}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{contacto.email}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{contacto.telefono}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex gap-2 justify-center">
                                                                <button
                                                                    onClick={() => { setEditingContact(contacto); setShowContactModal(true); }}
                                                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                                    title="Editar"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => setConfirmAction({ type: "deleteContact", id: contacto.id })}
                                                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Espacio para botones */}
                            <div className="flex items-end justify-end gap-3">
                                <Button variant="danger" onClick={() => setConfirmAction({ type: "deactivate" })}>
                                    Desactivar
                                </Button>
                                <Button variant="secondary" onClick={onClose}>
                                    Volver
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-modales */}
            {showBankModal && (
                <BankAccountModal
                    account={editingBank}
                    onClose={() => { setShowBankModal(false); setEditingBank(null); }}
                    onSave={handleSaveBank}
                />
            )}

            {showContactModal && (
                <ContactModal
                    contact={editingContact}
                    onClose={() => { setShowContactModal(false); setEditingContact(null); }}
                    onSave={handleSaveContact}
                />
            )}

            {/* Modal de confirmación */}
            {confirmAction && (
                <ConfirmModal
                    title={
                        confirmAction.type === "deactivate" ? "Desactivar Proveedor" :
                            confirmAction.type === "deleteBank" ? "Eliminar Cuenta Bancaria" :
                                "Eliminar Contacto"
                    }
                    message={
                        confirmAction.type === "deactivate"
                            ? "¿Estás seguro de desactivar este proveedor? Esta acción cambiará su estado a INACTIVO."
                            : "¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer."
                    }
                    type={confirmAction.type === "deactivate" ? "warning" : "danger"}
                    onConfirm={() => {
                        if (confirmAction.type === "deactivate") handleDeactivate();
                        else if (confirmAction.type === "deleteBank") handleDeleteBank(confirmAction.id!);
                        else handleDeleteContact(confirmAction.id!);
                    }}
                    onCancel={() => setConfirmAction(null)}
                />
            )}
        </>
    );
};

export default SupplierDetailModal;