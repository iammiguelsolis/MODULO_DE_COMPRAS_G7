import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { comparacionService } from '../lib/comparacionservice';
import type { CuadroComparativoResponse } from '../lib/types';
import { Eye, Calendar, Search, BarChart3 } from 'lucide-react';
import { Button } from '../components/atoms/Button';

// Badge componente local para la lista
const StatusBadge = ({ tipo }: { tipo: string }) => {
    let color = "bg-gray-100 text-gray-800";
    if (tipo === 'Licitación') color = "bg-purple-100 text-purple-800";
    if (tipo === 'Comparacion') color = "bg-blue-100 text-blue-800";
    if (tipo === 'Simple') color = "bg-green-100 text-green-800";

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
            {tipo}
        </span>
    );
};

export const ComparacionListPage: React.FC = () => {
    const navigate = useNavigate();
    const [comparaciones, setComparaciones] = useState<CuadroComparativoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchComparaciones = async () => {
            try {
                setLoading(true);
                const data = await comparacionService.getComparaciones();
                setComparaciones(data);
            } catch (error) {
                console.error("Error fetching comparaciones:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComparaciones();
    }, []);

    const filteredComparaciones = comparaciones.filter(comp =>
        comp.tituloSolicitud.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                <BarChart3 className="text-blue-600" size={32} />
                                Cuadros Comparativos
                            </h1>
                            <p className="text-gray-500 text-lg">Gestione y adjudique las comparaciones de ofertas recibidas.</p>
                        </div>
                    </div>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                        <div className="relative max-w-lg">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por título, código o descripción..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                            <p className="text-gray-500 animate-pulse">Cargando comparaciones...</p>
                        </div>
                    ) : filteredComparaciones.length === 0 ? (
                        <div className="p-20 text-center flex flex-col items-center">
                            <div className="bg-gray-100 p-4 rounded-full mb-4">
                                <Search className="text-gray-400 w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No se encontraron resultados</h3>
                            <p className="text-gray-500 mt-1">Intente con otros términos de búsqueda.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                                        <th className="px-6 py-4">Código</th>
                                        <th className="px-6 py-4">Detalle de Solicitud</th>
                                        <th className="px-6 py-4">Tipo</th>
                                        <th className="px-6 py-4">Fecha</th>
                                        <th className="px-6 py-4 text-right">Monto Estimado</th>
                                        <th className="px-6 py-4 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredComparaciones.map((comp) => (
                                        <tr key={comp.rfqId} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-sm font-medium text-blue-600">
                                                {comp.rfqId}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-gray-800 text-base">{comp.tituloSolicitud}</span>
                                                    <span className="text-sm text-gray-500 truncate max-w-md">{comp.descripcion}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge tipo={comp.tipoProceso} />
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {comp.fechaCreacion}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="font-bold text-gray-800">
                                                    $ {comp.montoTotalEstimado.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Button
                                                    variant="primary"
                                                    className="text-sm py-2 px-4 shadow-sm hover:shadow-md transition-all"
                                                    onClick={() => navigate(`/comparacion/${comp.rfqId}`)}
                                                >
                                                    <Eye size={16} /> Ver Detalle
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};