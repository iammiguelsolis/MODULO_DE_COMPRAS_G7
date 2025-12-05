import React, { useState, useEffect } from "react";
import { X, Plus, Edit2, Trash2 } from "lucide-react";
import type { ProveedorDetalle, CuentaBancaria, ContactoProveedor } from "../../../../services/proveedor/types";
import Button from "../atoms/ButtonDetail";
import InfoField from "../atoms/InfoField";
import { ProveedoresApi } from "../../../../services/proveedor/api";

import BankAccountModal from "./BankAccountModal";
import ContactModal from "./ContactModal";
import ConfirmModal from "./ConfirmModal";

// ==================== INTERFACES ====================

interface SupplierDetailModalProps {
    supplierId: number;
    onClose: () => void;
    onDeactivate?: (id: number) => void;
}

// ==================== COMPONENTE PRINCIPAL ====================

const SupplierDetailModal: React.FC<SupplierDetailModalProps> = ({
    supplierId,
    onClose,
    onDeactivate
}) => {
    // Estados
    const [supplier, setSupplier] = useState<ProveedorDetalle | null>(null);
    const [cuentasBancarias, setCuentasBancarias] = useState<CuentaBancaria[]>([]);
    const [contactos, setContactos] = useState<ContactoProveedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para modales
    const [showBankModal, setShowBankModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [editingBank, setEditingBank] = useState<CuentaBancaria | null>(null);
    const [editingContact, setEditingContact] = useState<ContactoProveedor | null>(null);
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
        setError(null);
        try {

            const supplierData = await ProveedoresApi.obtenerDetalle(supplierId);
            setSupplier(supplierData);
            setContactos(supplierData.contactos);
            setCuentasBancarias(supplierData.cuentasBancarias);

        } catch (err) {
            console.error("Error al cargar proveedor:", err);
            const errorMessage = err instanceof Error ? err.message : "Error desconocido";
            setError(errorMessage);
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
    const handleSaveContact = async (contactData: Omit<ContactoProveedor, "id">) => {
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