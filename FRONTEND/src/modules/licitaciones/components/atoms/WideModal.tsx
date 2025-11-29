import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './WideModal.css';

interface WideModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    showCloseButton?: boolean;
    width?: 'default' | 'wide';
}

const WideModal: React.FC<WideModalProps> = ({
    isOpen,
    onClose,
    children,
    showCloseButton = true,
    width = 'default'
}) => {
    // Handle ESC key press
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const containerClassName = `modal-container ${width === 'wide' ? 'modal-container-wide' : ''}`.trim();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={containerClassName} onClick={(e) => e.stopPropagation()}>
                {showCloseButton && (
                    <button className="modal-close-button" onClick={onClose} aria-label="Cerrar modal">
                        <X size={20} />
                    </button>
                )}
                {children}
            </div>
        </div>
    );
};

export default WideModal;
