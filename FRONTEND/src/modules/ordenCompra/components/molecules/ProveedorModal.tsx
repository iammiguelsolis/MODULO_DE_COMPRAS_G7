import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

interface ProveedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSupplier: (supplier: any) => void;
  selectedSupplier: any;
}

// Datos de ejemplo para proveedores
const MOCK_PROVEEDORES = [
  {
    id: 'prov-001',
    name: 'Tecnología Avanzada S.A.',
    contact: 'Carlos Rodríguez',
    phone: '+51 900 123 456',
    email: 'carlos@tecnologia-avanzada.com'
  },
  {
    id: 'prov-002',
    name: 'Suministros Industriales Perú',
    contact: 'María González',
    phone: '+51 910 987 654',
    email: 'maria@suministros-peru.com'
  },
  {
    id: 'prov-003',
    name: 'Office Solutions Perú',
    contact: 'Roberto Silva',
    phone: '+51 920 555 789',
    email: 'roberto@office-solutions.pe'
  },
];

export const ProveedorModal: React.FC<ProveedorModalProps> = ({
  isOpen,
  onClose,
  onSelectSupplier,
  selectedSupplier
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [proveedores] = useState(MOCK_PROVEEDORES);

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Seleccionar Proveedor</h2>
            <p className="text-gray-600 mt-1">Elija un proveedor para la orden de compra</p>
          </div>
          <Button
            variant="secondary"
            icon={X}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            Cerrar
          </Button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Input
              placeholder="Buscar proveedor por nombre, contacto o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Proveedores List */}
        <div className="overflow-y-auto max-h-96">
          {filteredProveedores.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron proveedores que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProveedores.map((proveedor) => (
                <div
                  key={proveedor.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedSupplier?.id === proveedor.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => onSelectSupplier(proveedor)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{proveedor.name}</h3>
                        {selectedSupplier?.id === proveedor.id && (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Contacto:</span> {proveedor.contact}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span> {proveedor.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Teléfono:</span> {proveedor.phone}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={selectedSupplier?.id === proveedor.id ? "primary" : "secondary"}
                      size="sm"
                    >
                      {selectedSupplier?.id === proveedor.id ? 'Seleccionado' : 'Seleccionar'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          {selectedSupplier && (
            <Button variant="primary" onClick={onClose}>
              Confirmar Selección
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};