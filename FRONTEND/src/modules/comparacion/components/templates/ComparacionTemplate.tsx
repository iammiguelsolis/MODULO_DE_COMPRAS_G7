import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { comparacionService } from '../../lib/comparacionservice';
import type { CuadroComparativoResponse, OfertaProveedor } from '../../lib/types';
import { GeneralInfoCard, SummaryCard, FilterBar, OffersTable, OfferDetailView } from '../organisms/ComparacionComponents';
import { TablaComparativa } from '../organisms/TablaComparativa';
import { Button } from '../atoms/Button';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export const ComparacionTemplate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // Core State
    const [data, setData] = useState<CuadroComparativoResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // UI State
    const [activeTab, setActiveTab] = useState<'resumen' | 'matriz'>('resumen');
    const [selectedOffer, setSelectedOffer] = useState<OfertaProveedor | null>(null);
    
    // Actions State
    const [sending, setSending] = useState<boolean>(false);
    const [hasSent, setHasSent] = useState<boolean>(false);
    const [adjudicatingId, setAdjudicatingId] = useState<string | null>(null);
    
    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [countryFilter, setCountryFilter] = useState('');

    const fetchData = async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            // El servicio ahora garantiza un retorno aunque el ID no sea exacto
            const result = await comparacionService.getCuadroComparativo(id);
            if(result) {
                setData(result);
            } else {
                setError('No se pudo recuperar la información del cuadro comparativo.');
            }
        } catch (err) {
            setError('Error de conexión al cargar el cuadro comparativo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // Lógica de filtrado de ofertas
    const filteredOffers = useMemo(() => {
        if (!data) return [];
        
        return data.detallePorProveedor.filter(offer => {
            const matchesSearch = searchTerm === '' || 
                offer.nombreProveedor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                offer.proveedorId.includes(searchTerm);
            
            const matchesStatus = statusFilter === '' || offer.estado === statusFilter;
            const matchesCountry = countryFilter === '' || true; 

            return matchesSearch && matchesStatus && matchesCountry;
        });
    }, [data, searchTerm, statusFilter, countryFilter]);

    const handleSendResults = async () => {
        if (!data) return;
        setSending(true);
        setTimeout(() => {
            setSending(false);
            setHasSent(true);
        }, 2000);
    };

    const handleAdjudicar = async (proveedorId: string) => {
        if (!data || !id) return;
        
        if (window.confirm(`¿Está seguro de adjudicar al proveedor seleccionado?`)) {
            try {
                setAdjudicatingId(proveedorId);
                await comparacionService.adjudicarProveedor({
                    rfqId: id,
                    proveedorId: proveedorId
                });
                setHasSent(true); 
                alert('Proveedor adjudicado correctamente');
            } catch (error) {
                console.error(error);
                alert('Error al adjudicar proveedor');
            } finally {
                setAdjudicatingId(null);
            }
        }
    };

    const handleViewOfferDetails = (offerId: string) => {
        const offer = data?.detallePorProveedor.find(o => o.proveedorId === offerId);
        if (offer) {
            setSelectedOffer(offer);
        }
    };

    const handleBackToSummary = () => {
        setSelectedOffer(null);
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-gray-500 font-medium text-lg">Cargando detalles de comparación...</p>
            </div>
        );
    }

    // --- Error State ---
    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-gray-100">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ArrowLeft size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Algo salió mal</h2>
                    <p className="text-gray-500 mb-6">{error || 'No se encontraron datos para esta comparación.'}</p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="secondary" onClick={() => navigate('/comparacion')}>
                            Volver al listado
                        </Button>
                        <Button onClick={fetchData}>
                            <RefreshCw size={16} /> Reintentar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VISTA DETALLE DE OFERTA INDIVIDUAL (Sub-View) ---
    if (selectedOffer) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] p-6 font-sans">
                <div className="max-w-[1400px] mx-auto">
                    <OfferDetailView 
                        offer={selectedOffer}
                        onBack={handleBackToSummary}
                        onAdjudicar={handleAdjudicar}
                        isAdjudicating={!!adjudicatingId}
                        hasAdjudicated={hasSent}
                    />
                </div>
            </div>
        );
    }

    // --- VISTA PRINCIPAL (Dashboard de Comparación) ---
    return (
        <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-8 font-sans">
            <div className="max-w-[1400px] mx-auto">
                
                {/* Header Navigation */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <button 
                            onClick={() => navigate('/comparacion')} 
                            className="flex items-center text-gray-500 hover:text-gray-800 transition-colors mb-2 text-sm font-medium"
                        >
                            <ArrowLeft size={16} className="mr-1" /> Volver al listado
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Enviar Comparación <span className="text-gray-400 font-normal text-xl ml-2">#{id}</span>
                        </h1>
                        <p className="text-gray-500 mt-1">Complete el formulario especializado para iniciar el proceso de licitación formal.</p>
                    </div>
                    
                    {/* Tab Switcher */}
                    <div className="bg-white p-1.5 rounded-xl border border-gray-200 flex shadow-sm">
                        <button 
                            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'resumen' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('resumen')}
                        >
                            Resumen General
                        </button>
                        <button 
                            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'matriz' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('matriz')}
                        >
                            Matriz Comparativa
                        </button>
                    </div>
                </div>

                {activeTab === 'resumen' ? (
                    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                        {/* Top Section: Grid 2 Columns */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                            {/* Left: General Info (2/3 width) */}
                            <div className="lg:col-span-2 h-full">
                                <GeneralInfoCard data={data} />
                            </div>

                            {/* Right: Summary (1/3 width) */}
                            <div className="lg:col-span-1 h-full">
                                <SummaryCard
                                    data={data}
                                    onSendResults={handleSendResults}
                                    isSending={sending}
                                    hasSent={hasSent}
                                />
                            </div>
                        </div>

                        {/* Middle Section: Filter Bar */}
                        <FilterBar 
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            statusFilter={statusFilter}
                            onStatusChange={setStatusFilter}
                            countryFilter={countryFilter}
                            onCountryChange={setCountryFilter}
                        />

                        {/* Bottom Section: Offers Table with Filtered Data */}
                        <OffersTable 
                            offers={filteredOffers} 
                            onViewDetails={handleViewOfferDetails}
                        />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-6">
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Matriz Comparativa Detallada</h2>
                                <p className="text-gray-500 text-sm">Visualice todos los ítems cotizados por cada proveedor lado a lado para una toma de decisiones precisa.</p>
                            </div>
                            <TablaComparativa 
                                data={data} 
                                onAdjudicar={handleAdjudicar}
                                isAdjudicating={!!adjudicatingId}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};