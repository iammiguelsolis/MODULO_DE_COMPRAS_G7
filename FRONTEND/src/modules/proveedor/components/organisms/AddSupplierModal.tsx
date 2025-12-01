import React, { useState } from "react";
import { X } from "lucide-react";
import InputLabel from "../atoms/InputLabel";
import UploadFile from "../molecules/UploadFile";
import Button from "../atoms/Button";

interface AddSupplierModalProps {
    onClose: () => void;
    onSave: () => void;
}

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({ onClose, onSave }) => {
    const [supplierData, setSupplierData] = useState({
        razonSocial: '',
        ruc: '',
        rubro: '',
        pais: '',
        direccion: '',
        telefono: '',
        email: '',
        moneda: '',
    });

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Registrar Proveedor</h2>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                    {/* Formulario de registro de proveedor */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Fila 1 */}
                        <div className="col-span-4">
                            <InputLabel
                                label="Razón Social *"
                                value={supplierData.razonSocial}
                                onChange={(e) => setSupplierData({ ...supplierData, razonSocial: e })}
                                placeholder=""
                                fullWidth
                            />
                        </div>
                        <div className="col-span-2">
                            <InputLabel
                                label="RUC *"
                                value={supplierData.ruc}
                                onChange={(e) => setSupplierData({ ...supplierData, ruc: e })}
                                placeholder=""
                                fullWidth
                            />
                        </div>
                        <div className="col-span-3">
                            <InputLabel
                                label="Rubro *"
                                value={supplierData.rubro}
                                onChange={(e) => setSupplierData({ ...supplierData, rubro: e })}
                                placeholder=""
                                fullWidth
                            />
                        </div>
                        <div className="col-span-2">
                            <InputLabel
                                label="País *"
                                value={supplierData.pais}
                                onChange={(e) => setSupplierData({ ...supplierData, pais: e })}
                                placeholder="Perú"
                                fullWidth
                            />
                        </div>
                        {/* Fila 2 */}
                        <div className="col-span-4">
                            <InputLabel
                                label="Dirección *"
                                value={supplierData.direccion}
                                onChange={(e) => setSupplierData({ ...supplierData, direccion: e })}
                                placeholder=""
                                fullWidth
                            />
                        </div>
                        <div className="col-span-2">
                            <InputLabel
                                label="Telefono"
                                value={supplierData.telefono}
                                onChange={(e) => setSupplierData({ ...supplierData, telefono: e })}
                                placeholder=""
                                fullWidth
                            />
                        </div>
                        <div className="col-span-3">
                            <InputLabel
                                label="Email"
                                value={supplierData.email}
                                onChange={(e) => setSupplierData({ ...supplierData, email: e })}
                                placeholder=""
                                fullWidth
                            />
                        </div>
                        <div className="col-span-2">
                            <InputLabel
                                label="Moneda Preferida"
                                value={supplierData.moneda}
                                onChange={(e) => setSupplierData({ ...supplierData, moneda: e })}
                                placeholder="PEN"
                                fullWidth
                            />
                        </div>
                        {/* Upload Area */}
                        <div className="col-span-12">
                            <label className="text-xs text-gray-600 font-medium mb-2 block">
                                Adjuntar documentos iniciales (RUC, CCI, Constancia)
                            </label>
                            <UploadFile />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8 pt-6">
                        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button onClick={onSave}>Guardar</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddSupplierModal;