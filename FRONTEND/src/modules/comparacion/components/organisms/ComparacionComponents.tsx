import React from 'react';
import type { CuadroComparativoResponse, OfertaProveedor } from '../../lib/types';
import { FileText, Star, Send, Check, Loader2, ArrowLeft, Trophy, AlertTriangle } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

// --- Shared Components ---

// Componente visual de la Escala de Competitividad
export const CompetitivenessScale = ({ price, large = false }: { price: number, large?: boolean }) => {
    // Lógica visual simulada: 
    // Verde = Precio bajo/competitivo
    // Ambar = Precio promedio
    // Rojo = Precio alto

    // Referencia base arbitraria para el ejemplo (en una app real vendría del presupuesto o promedio)
    const marketAverage = 2500;
    const percentage = Math.min(Math.max((price / marketAverage) * 100, 10), 100);

    let barColor = "bg-red-500";
    let label = "Alto Riesgo / Precio Elevado";
    let scoreColor = "text-red-600";

    // Invertido: menor precio es mejor (visualmente representamos "bondad" de la oferta)
    // Supongamos que percentage bajo es bajo precio.

    // Ajustamos la lógica visual: 
    // Si precio es bajo (< 80% del promedio) -> Verde
    // Si precio es medio (80-110%) -> Ambar
    // Si precio es alto (> 110%) -> Rojo

    // Para la barra de progreso visual (donde 100% es "mejor"):
    // Usaremos una escala inversa simple para la demo.
    const visualScore = Math.max(0, 100 - (percentage - 50) * 2); // Ajuste arbitrario para demo

    if (visualScore > 70) {
        barColor = "bg-green-500";
        label = "Excelente Oferta";
        scoreColor = "text-green-600";
    } else if (visualScore > 40) {
        barColor = "bg-amber-400";
        label = "Oferta Competitiva";
        scoreColor = "text-amber-600";
    }

    if (large) {
        return (
            <div className="w-full mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex justify-between mb-2">
                    <span className="font-bold text-gray-700">Evaluación de Competitividad de Precio</span>
                    <span className={`font-bold ${scoreColor}`}>{label}</span>
                </div>
                <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden flex relative">
                    {/* Background zones */}
                    <div className="h-full w-1/3 bg-red-100/50"></div>
                    <div className="h-full w-1/3 bg-amber-100/50"></div>
                    <div className="h-full w-1/3 bg-green-100/50"></div>

                    {/* Indicator Bar */}
                    <div
                        className={`absolute top-0 left-0 h-full ${barColor} transition-all duration-1000 ease-out rounded-full shadow-md`}
                        style={{ width: `${visualScore}%` }}
                    >
                        <div className="w-full h-full opacity-30 bg-white/30 animate-pulse"></div>
                    </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                    <span>Poco Competitivo (Costoso)</span>
                    <span>Promedio de Mercado</span>
                    <span>Muy Competitivo (Económico)</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 w-24">
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full ${barColor} rounded-full`}
                    style={{ width: `${visualScore}%` }}
                ></div>
            </div>
            <span className="text-[10px] text-gray-400 text-right">
                {visualScore > 70 ? 'Excelente' : visualScore > 40 ? 'Regular' : 'Alto'}
            </span>
        </div>
    );
};

// --- General Info Card ---
interface GeneralInfoCardProps {
    data: CuadroComparativoResponse;
}

export const GeneralInfoCard: React.FC<GeneralInfoCardProps> = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Información General de la Comparacion</h2>
            <p className="text-gray-400 text-sm mb-6 font-medium">Datos heredados de la solicitud de compra inicial. No editables.</p>

            <div className="flex flex-col gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Codigo</label>
                    <div className="w-full">
                        <Input
                            value={data.codigo || ''}
                            readOnly
                            className="bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed w-full"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Descripcion</label>
                    <div className="w-full">
                        <textarea
                            readOnly
                            value={data.descripcion || ''}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed resize-none focus:outline-none h-32"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Summary Card ---
interface SummaryCardProps {
    data: CuadroComparativoResponse;
    onSendResults: () => void;
    isSending: boolean;
    hasSent: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ data, onSendResults, isSending, hasSent }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col justify-between relative overflow-hidden">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen</h2>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-800 font-semibold text-sm">Monto Total Estimado:</span>
                    <span className="text-gray-900 font-bold text-xl">
                        $ {data.montoTotalEstimado?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    </span>
                </div>

                <div className="bg-blue-100/50 p-4 rounded-lg mb-8 flex items-start gap-4 border border-blue-100">
                    <div className="text-blue-500 mt-1 p-1 bg-white rounded-md shadow-sm">
                        <FileText size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Tipo de Proceso: {data.tipoProceso}</h3>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Compra formal, evaluada y de alto monto.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center w-full">
                <button
                    onClick={onSendResults}
                    disabled={isSending || hasSent}
                    className={`
                        relative w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 transform
                        flex items-center justify-center gap-2 shadow-lg
                        ${hasSent
                            ? 'bg-green-500 cursor-default scale-100'
                            : isSending
                                ? 'bg-blue-400 cursor-wait scale-95'
                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl active:scale-95'
                        }
                    `}
                >
                    {isSending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Procesando...</span>
                        </>
                    ) : hasSent ? (
                        <>
                            <Check className="w-5 h-5" />
                            <span>¡Enviado!</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            <span>Enviar Oferta Ganadora</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// --- Filter Bar ---
interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (val: string) => void;
    statusFilter: string;
    onStatusChange: (val: string) => void;
    countryFilter: string;
    onCountryChange: (val: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    countryFilter,
    onCountryChange
}) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Buscar</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Codigo, Descripción..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-3"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>
                <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Estado</label>
                    <select
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-600"
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="ACTIVO">Activo</option>
                        <option value="EJECUTADO">Ejecutado</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">País</label>
                    <select
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-600"
                        value={countryFilter}
                        onChange={(e) => onCountryChange(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="Perú">Perú</option>
                        <option value="Chile">Chile</option>
                        <option value="Colombia">Colombia</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Puntaje Oferta</label>
                    <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 flex items-center gap-1 bg-gray-50 cursor-not-allowed">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <Star key={i} size={12} className="text-gray-300" fill="currentColor" />
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Riesgo</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-400 cursor-not-allowed" disabled>
                        <option>Bajo/Medio/Alto</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

// --- Offers Table ---
interface OffersTableProps {
    offers: OfertaProveedor[];
    onViewDetails: (offerId: string) => void;
}

export const OffersTable: React.FC<OffersTableProps> = ({ offers, onViewDetails }) => {

    const renderStars = (score: number) => {
        let activeStars = 0;
        let colorClass = "text-gray-300";

        if (score >= 90) { activeStars = 5; colorClass = "text-green-500"; }
        else if (score >= 70) { activeStars = 4; colorClass = "text-yellow-400"; }
        else if (score >= 50) { activeStars = 3; colorClass = "text-yellow-400"; }
        else if (score > 0) { activeStars = 2; colorClass = "text-red-400"; }

        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={14}
                        className={star <= activeStars ? colorClass : "text-gray-300"}
                        fill={star <= activeStars ? "currentColor" : "none"}
                        strokeWidth={2}
                    />
                ))}
            </div>
        );
    };

    const renderStatus = (status: string) => {
        let colorClass = "text-gray-500";
        if (status === 'ACTIVO') colorClass = "text-green-500 font-semibold";
        if (status === 'PENDIENTE') colorClass = "text-amber-400 font-semibold";
        if (status === 'INACTIVO') colorClass = "text-red-500";

        return <span className={`text-xs tracking-wider uppercase ${colorClass}`}>{status}</span>;
    };

    return (
        <div>
            <h3 className="text-gray-500 font-bold mb-4 ml-1">Lista Oferta Proveedor</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#F3F6FD] text-gray-800 font-bold text-xs uppercase italic">
                            <tr>
                                <th className="px-6 py-4 w-32">Codigo</th>
                                <th className="px-6 py-4">Descripcion</th>
                                <th className="px-6 py-4 w-32">Fecha</th>
                                <th className="px-6 py-4 w-40">Monto</th>
                                <th className="px-6 py-4 w-32">ESTADO</th>
                                <th className="px-6 py-4 w-32">Competitividad</th>
                                <th className="px-6 py-4 w-40">Puntaje Oferta</th>
                                <th className="px-6 py-4 w-32 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {offers.map((offer, index) => (
                                <tr key={index} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                    <td className="px-6 py-4 text-gray-500 font-medium">00000</td>
                                    <td className="px-6 py-4 text-gray-400 font-medium tracking-widest">
                                        {offer.nombreProveedor || '-----------------------'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{offer.fechaOferta}</td>
                                    <td className="px-6 py-4 font-bold text-gray-800 text-lg">
                                        $ {offer.totalOferta.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4">
                                        {renderStatus(offer.estado)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <CompetitivenessScale price={offer.totalOferta} />
                                    </td>
                                    <td className="px-6 py-4">
                                        {renderStars(offer.puntajeTecnico)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Button
                                            variant="secondary"
                                            className="text-xs px-3 py-1 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600"
                                            onClick={() => onViewDetails(offer.proveedorId)}
                                        >
                                            Ver Detalles
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {offers.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                                        No se encontraron ofertas con los filtros actuales.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- Offer Detail View ---
interface OfferDetailViewProps {
    offer: OfertaProveedor;
    onBack: () => void;
    onAdjudicar: (proveedorId: string) => Promise<void>;
    isAdjudicating: boolean;
    hasAdjudicated: boolean;
}

export const OfferDetailView: React.FC<OfferDetailViewProps> = ({
    offer,
    onBack,
    onAdjudicar,
    isAdjudicating,
    hasAdjudicated
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header / Nav */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="secondary" onClick={onBack} className="bg-white border border-gray-200 shadow-sm">
                    <ArrowLeft className="w-4 h-4" /> Volver
                </Button>
                <h2 className="text-2xl font-bold text-gray-800">Detalles de la Oferta - {offer.nombreProveedor}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content (Left) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Offer Data Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" />
                            Datos de la Propuesta
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Proveedor</label>
                                <p className="text-gray-800 font-medium text-lg mt-1">{offer.nombreProveedor}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha de Oferta</label>
                                <p className="text-gray-800 font-medium text-lg mt-1">{offer.fechaOferta}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto Total</label>
                                <p className="text-blue-600 font-bold text-2xl mt-1">
                                    $ {offer.totalOferta.toLocaleString('en-US', { minimumFractionDigits: 2 })} {offer.moneda}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Puntaje Técnico</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-gray-800 font-bold text-xl">{offer.puntajeTecnico}/100</span>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} size={16}
                                                className={s <= (offer.puntajeTecnico > 90 ? 5 : 4) ? "text-yellow-400" : "text-gray-300"}
                                                fill="currentColor"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="font-bold text-gray-700">Desglose de Ítems</h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left">Ítem</th>
                                    <th className="px-6 py-3 text-center">Cant.</th>
                                    <th className="px-6 py-3 text-right">Precio Unit.</th>
                                    <th className="px-6 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offer.items.map((item, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-gray-800">{item.descripcion}</td>
                                        <td className="px-6 py-4 text-center text-gray-600">{item.cantidad}</td>
                                        <td className="px-6 py-4 text-right text-gray-600">${item.precioUnitario.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">${item.precioTotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {offer.costosOcultos.length > 0 && (
                            <div className="p-4 bg-orange-50 border-t border-orange-100">
                                <h4 className="text-orange-800 font-bold text-xs uppercase mb-2 flex items-center gap-2">
                                    <AlertTriangle size={14} /> Costos Adicionales Detectados
                                </h4>
                                {offer.costosOcultos.map((co, idx) => (
                                    <div key={idx} className="flex justify-between text-sm text-orange-700">
                                        <span>{co.descripcion}</span>
                                        <span className="font-medium">+ ${co.monto.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="flex flex-col gap-6">
                    {/* Visual Scale Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <CompetitivenessScale price={offer.totalOferta} large={true} />

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                Esta oferta ha sido evaluada comparativamente con el mercado.
                                Revise los indicadores antes de adjudicar.
                            </p>

                            <button
                                onClick={() => onAdjudicar(offer.proveedorId)}
                                disabled={isAdjudicating || hasAdjudicated}
                                className={`
                                    w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform shadow-lg
                                    flex items-center justify-center gap-3 text-lg
                                    ${hasAdjudicated
                                        ? 'bg-green-500 cursor-default scale-100 ring-4 ring-green-100'
                                        : isAdjudicating
                                            ? 'bg-blue-400 cursor-wait scale-95'
                                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-1 active:scale-95'
                                    }
                                `}
                            >
                                {isAdjudicating ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Enviando...</span>
                                    </>
                                ) : hasAdjudicated ? (
                                    <>
                                        <Trophy className="w-6 h-6" />
                                        <span>¡Oferta Ganadora!</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-6 h-6" />
                                        <span>Enviar Oferta Ganadora</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};