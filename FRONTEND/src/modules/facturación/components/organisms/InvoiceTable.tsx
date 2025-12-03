import React from 'react';
import Badge from '../atoms/Badge';
import { type FacturaProveedor } from '../../services/api';
import { History } from 'lucide-react';

interface InvoiceTableProps {
  facturas: FacturaProveedor[];
  onFacturaClick: (factura: FacturaProveedor) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ facturas, onFacturaClick }) => {
  // Filtrar facturas EN_CONCILIACION (no deben mostrarse en el listado)
  const facturasVisibles = facturas.filter(f => f.estado !== 'EN_CONCILIACION');
  
  // Agrupar facturas por numero_factura y mostrar solo la última versión
  const facturasAgrupadas = facturasVisibles.reduce((acc, factura) => {
    const existing = acc.find(f => f.numero_factura === factura.numero_factura);
    
    if (!existing) {
      acc.push({ ...factura, hasMultipleVersions: false });
    } else if (factura.version > existing.version) {
      const index = acc.indexOf(existing);
      acc[index] = { ...factura, hasMultipleVersions: true };
    } else {
      const index = acc.findIndex(f => f.numero_factura === factura.numero_factura);
      acc[index] = { ...acc[index], hasMultipleVersions: true };
    }
    
    return acc;
  }, [] as Array<FacturaProveedor & { hasMultipleVersions?: boolean }>);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-300">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-500">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Factura
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Moneda
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Origen
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {facturasAgrupadas.map((factura) => (
              <tr
                key={`${factura.numero_factura}-${factura.version}`}
                className="hover:bg-gray-50 cursor-pointer transition-colors group"
                onClick={() => onFacturaClick(factura)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {factura.numero_factura}
                    </span>
                    {factura.hasMultipleVersions && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 rounded-full">
                        <History size={12} className="text-purple-600" />
                        <span className="text-xs font-medium text-purple-600">
                          v{factura.version}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {factura.proveedor_nombre}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(factura.fecha_emision).toLocaleDateString('es-PE')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {factura.moneda}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {factura.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={factura.estado}>{factura.estado}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {factura.origen}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-blue-600 group-hover:text-blue-700">
                    Ver detalles
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;