import React from 'react';
import type { CuadroComparativoResponse } from '../../lib/types';
import { PriceCell } from '../atoms/PriceCell';
import { ScoreBadge } from '../atoms/ScoreBadge';

interface TablaComparativaProps {
    data: CuadroComparativoResponse;
    onAdjudicar: (proveedorId: string) => void;
    isAdjudicating: boolean;
}

export const TablaComparativa: React.FC<TablaComparativaProps> = ({ data, onAdjudicar, isAdjudicating }) => {
    const proveedores = data.detallePorProveedor;

    // Asumimos que todos los proveedores cotizan los mismos items en el mismo orden
    // O tomamos los items del primer proveedor como referencia para las filas
    const referenciaItems = proveedores.length > 0 ? proveedores[0].items : [];

    return (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                            Concepto
                        </th>
                        {proveedores.map((prov) => (
                            <th key={prov.proveedorId} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="font-bold text-gray-900 text-sm">{prov.nombreProveedor}</div>
                                <div className={`text-xs mt-1 ${prov.estado === 'ACTIVO' ? 'text-green-600' : 'text-red-500'}`}>
                                    {prov.estado}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {/* Fila: Precio Total */}
                    <tr className="bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            Monto Total
                        </td>
                        {proveedores.map((prov) => (
                            <td key={prov.proveedorId} className="px-6 py-4 whitespace-nowrap">
                                <div className="flex justify-center">
                                    <PriceCell
                                        amount={prov.totalOferta}
                                        currency={prov.moneda}
                                        isBestPrice={prov.totalOferta === Math.min(...proveedores.map(p => p.totalOferta))}
                                    />
                                </div>
                            </td>
                        ))}
                    </tr>

                    {/* Filas: Items */}
                    {referenciaItems.map((item, index) => (
                        <tr key={item.itemId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                <div className="font-medium text-gray-900">{item.descripcion}</div>
                                <div className="text-xs">Cant: {item.cantidad}</div>
                            </td>
                            {proveedores.map((prov) => {
                                const itemProv = prov.items.find(i => i.itemId === item.itemId);
                                return (
                                    <td key={prov.proveedorId} className="px-6 py-4 whitespace-nowrap">
                                        {itemProv ? (
                                            <div className="flex justify-center">
                                                <PriceCell
                                                    amount={itemProv.precioTotal}
                                                    currency={itemProv.moneda}
                                                    isBestPrice={itemProv.isBestPrice}
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs text-center block">-</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}

                    {/* Fila: Costos Ocultos */}
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                            Costos Ocultos
                        </td>
                        {proveedores.map((prov) => (
                            <td key={prov.proveedorId} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                {prov.costosOcultos.length > 0 ? (
                                    prov.costosOcultos.map((co, idx) => (
                                        <div key={idx} className="text-xs text-red-500">
                                            + {co.descripcion}: {co.monto} {co.moneda}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-green-500 text-xs">Ninguno</span>
                                )}
                            </td>
                        ))}
                    </tr>

                    {/* Fila: Puntaje Técnico */}
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                            Puntaje Técnico
                        </td>
                        {proveedores.map((prov) => (
                            <td key={prov.proveedorId} className="px-6 py-4 whitespace-nowrap text-center">
                                <ScoreBadge score={prov.puntajeTecnico} />
                            </td>
                        ))}
                    </tr>

                    {/* Pie: Botón Adjudicar */}
                    <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap"></td>
                        {proveedores.map((prov) => (
                            <td key={prov.proveedorId} className="px-6 py-4 whitespace-nowrap text-center">
                                <button
                                    onClick={() => onAdjudicar(prov.proveedorId)}
                                    disabled={prov.estado !== 'ACTIVO' || isAdjudicating}
                                    className={`
                    w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:text-sm
                    ${prov.estado === 'ACTIVO'
                                            ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                            : 'bg-gray-300 cursor-not-allowed'}
                  `}
                                >
                                    {isAdjudicating ? 'Procesando...' : 'ADJUDICAR'}
                                </button>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
