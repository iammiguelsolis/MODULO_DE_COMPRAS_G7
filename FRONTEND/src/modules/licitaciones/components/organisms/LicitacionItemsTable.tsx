import React from 'react';
import Card from '../atoms/Card';
import CardHeader from '../atoms/CardHeader';
import CardBody from '../atoms/CardBody';
import type { Item } from '../../lib/types';
import './LicitacionItemsTable.css';

interface LicitacionItemsTableProps {
    items: Item[];
}

const LicitacionItemsTable: React.FC<LicitacionItemsTableProps> = ({ items }) => {
    const calculateTotal = (item: Item): number => {
        if (item.type === 'MATERIAL') {
            return (item.quantity || 0) * (item.price || 0);
        } else {
            return (item.estimatedHours || 0) * (item.hourlyRate || 0);
        }
    };

    const formatCurrency = (amount: number): string => {
        return `S/. ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <Card>
            <CardHeader>
                <h2>Ítems</h2>
            </CardHeader>
            <CardBody className="items-table-body">
                <table className="items-table">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th className="text-center">Cantidad / Horas</th>
                            <th className="text-right">Precio Uni. / Tarifa</th>
                            <th className="text-right">Total Item</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td><span className="item-type-badge">{item.type}</span></td>
                                <td>{item.description}</td>
                                <td className="text-center">
                                    {item.type === 'MATERIAL' ? item.quantity : item.estimatedHours}
                                </td>
                                <td className="text-right">
                                    {formatCurrency(item.type === 'MATERIAL' ? (item.price || 0) : (item.hourlyRate || 0))}
                                </td>
                                <td className="text-right">{formatCurrency(calculateTotal(item))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardBody>
        </Card>
    );
};

export default LicitacionItemsTable;
