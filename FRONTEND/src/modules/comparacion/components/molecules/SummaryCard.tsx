import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { Button } from '../atoms/Button';

interface SummaryCardProps {
  totalAmount: number;
  processType: string;
  processDescription: string;
  purchaseType: string;
  onCreateRequest: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ totalAmount, processType, processDescription, onCreateRequest }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-300 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen</h3>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">Monto Total Estimado:</span>
        <span className="text-lg font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
      </div>

      <div className={`${totalAmount >= 5000 ? 'bg-orange-100' : 'bg-blue-100'} rounded-lg p-4 mb-4`}>
        <div className="flex items-start gap-3">
          {
            totalAmount >= 5000 ?
              <AlertTriangle className="w-6 h-6 text-orange-600 mt-1" />
              :
              <FileText className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          }
          <div>
            <p className="font-medium text-gray-800">{processType}</p>
            <p className="text-sm text-gray-600">{processDescription}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto">
        {
          totalAmount >= 5000 ? (
            <Button className='mx-auto bg-orange-500 hover:bg-orange-600' onClick={onCreateRequest}>Iniciar Proceso de Licitación</Button>
          ) : (
            <Button className='mx-auto' onClick={onCreateRequest}>Crear Solicitud</Button>
          )
        }
      </div>
    </div>
  );
};