import React from 'react';
import { Upload } from 'lucide-react';

const UploadFile: React.FC = () => (
    <div className="rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 p-12 text-center hover:from-blue-100 hover:to-indigo-100 transition-all cursor-pointer group">
        <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Upload className="text-blue-600" size={20} />
            </div>
            <p className="text-sm text-gray-600">Arrastra aquí o haz clic para seleccionar</p>
        </div>
    </div>
);

export default UploadFile;