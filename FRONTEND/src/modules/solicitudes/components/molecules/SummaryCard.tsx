import { FileText } from 'lucide-react';
import { Button } from '../atoms/Button';

interface SummaryCardProps {
  totalAmount: number;
  processType: string;
  processDescription: string;
  purchaseType: string;
  onCreateRequest: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ totalAmount, processType, processDescription, purchaseType, onCreateRequest }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen</h3>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">Monto Total Estimado:</span>
        <span className="text-lg font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-800">{processType}</p>
            <p className="text-sm text-gray-600">{processDescription}</p>
          </div>
        </div>
      </div>

      <div className={`rounded-lg p-3 mb-6 ${totalAmount >= 5000 ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
        <p className="text-sm font-semibold text-gray-700">
          Tipo: <span className={totalAmount >= 5000 ? 'text-orange-600' : 'text-green-600'}>{purchaseType}</span>
        </p>
      </div>

      <Button className="w-full" onClick={onCreateRequest}>Crear Solicitud</Button>
    </div>
  );
};