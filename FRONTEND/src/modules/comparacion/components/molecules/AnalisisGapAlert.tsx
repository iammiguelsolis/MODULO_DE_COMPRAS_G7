import React from 'react';
import type { AnalisisGap } from '../../lib/types';

interface AnalisisGapAlertProps {
    analisis: AnalisisGap;
}

export const AnalisisGapAlert: React.FC<AnalisisGapAlertProps> = ({ analisis }) => {
    if (!analisis.esOfertaTemeraria) return null;

    const riskColor = {
        BAJO: 'bg-yellow-50 border-yellow-400 text-yellow-700',
        MEDIO: 'bg-orange-50 border-orange-400 text-orange-700',
        ALTO: 'bg-red-50 border-red-400 text-red-700'
    }[analisis.nivelRiesgo] || 'bg-gray-50 border-gray-400 text-gray-700';

    return (
        <div className={`border-l-4 p-4 mb-6 rounded ${riskColor}`} role="alert">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="font-bold">Alerta de Análisis Gap: Riesgo {analisis.nivelRiesgo}</p>
                    <p className="text-sm">{analisis.detalles}</p>
                </div>
            </div>
        </div>
    );
};
