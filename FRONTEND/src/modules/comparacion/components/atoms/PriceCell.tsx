import React from 'react';

interface PriceCellProps {
    amount: number;
    currency: string;
    isBestPrice?: boolean;
}

export const PriceCell: React.FC<PriceCellProps> = ({ amount, currency, isBestPrice = false }) => {
    const formattedPrice = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);

    return (
        <div className={`text-right ${isBestPrice ? 'font-bold text-green-600' : 'text-gray-700'}`}>
            {formattedPrice}
            {isBestPrice && <span className="ml-1 text-xs text-green-500">★</span>}
        </div>
    );
};
