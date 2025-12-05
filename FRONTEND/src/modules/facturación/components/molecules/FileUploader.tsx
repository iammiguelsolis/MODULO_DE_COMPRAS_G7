import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  acceptedTypes = '.pdf,.xml',
  label = 'Adjuntar archivos (PDF/XML)'
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs text-gray-600 font-medium">{label}</label>
      )}
      
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`rounded-xl p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? 'bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-500 border-dashed'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100'
        }`}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-700">{selectedFile.name}</span>
              <button
                onClick={handleRemove}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Upload className="text-blue-600" size={20} />
            </div>
            <p className="text-sm text-gray-600">
              Arrastra aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-gray-500">PDF o XML</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes}
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />
    </div>
  );
};

export default FileUploader;