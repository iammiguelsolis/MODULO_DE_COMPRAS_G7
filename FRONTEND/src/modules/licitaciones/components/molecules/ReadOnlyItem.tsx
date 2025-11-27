import React from 'react';
import { Item } from '../../lib/types';
import './ReadOnlyItem.css';

interface ReadOnlyItemProps {
    item: Item;
}

const ReadOnlyItem: React.FC<ReadOnlyItemProps> = ({ item }) => {
    const total = item.type === 'Producto'
        ? (item.quantity || 0) * (item.price || 0)
        : (item.estimatedHours || 0) * (item.hourlyRate || 0);

    return (
        <tr className="readonly-item-row">
            <td><span className="item-type-badge">{item.type}</span></td>
            <td>{item.description}</td>
            {item.type === 'Producto' ? (
                <>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">S/ {item.price?.toFixed(2)}</td>
                </>
            ) : (
                <>
                    <td className="text-center">{item.estimatedHours}</td>
                    <td className="text-right">S/ {item.hourlyRate?.toFixed(2)}</td>
                </>
            )}
            <td className="text-right">S/ {total.toFixed(2)}</td>
        </tr>
    );
};

export default ReadOnlyItem;
