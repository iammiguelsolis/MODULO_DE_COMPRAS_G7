import React from 'react';

interface ScoreBadgeProps {
    score: number;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
    let colorClass = 'bg-red-100 text-red-800';

    if (score >= 80) {
        colorClass = 'bg-green-100 text-green-800';
    } else if (score >= 50) {
        colorClass = 'bg-yellow-100 text-yellow-800';
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${colorClass}`}>
            {score}/100
        </span>
    );
};
