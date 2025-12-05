import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import Button from '../atoms/Button';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100 opacity-100">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            {type === 'success' ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex justify-center">
            <Button onClick={onClose} variant={type === 'success' ? 'primary' : 'secondary'}>
              {type === 'success' ? 'Continuar' : 'Cerrar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
