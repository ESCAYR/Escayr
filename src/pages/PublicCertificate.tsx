import React from 'react';

// This page represents the View accessed via QR Code (Public Route)
const mockCertificate = {
    unique_code: 'ESCAYR-84B9A2',
    status: 'vigente',
    result: 'aprobado',
    emission_date: '2026-02-22',
    expiration_date: '2027-02-22',
    inspector_name: 'Juan Pérez',
    client_name: 'Constructora Andina S.A.',
    brand_name: 'Petzl',
    model: 'Newton Fast',
    serial_number: '21A004123',
    inspection_type: 'Inspección Anual Equipos Anticaídas',
    certificate_version: '1.2.0',
    certificate_hash: 'a3f9c2d1b8e74a6b5c4d3e2f1a0b9c8d7e6f5a4b',
    photos: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150'
    ]
};

export default function PublicCertificate() {
    const getStatusBadge = (status: string) => {
        if (status === 'vigente') return <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">VIGENTE</span>;
        if (status === 'por_vencer') return <span className="bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">POR VENCER</span>;
        if (status === 'vencido') return <span className="bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">VENCIDO</span>;
        return <span className="bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">ANULADO</span>;
    };

    const getResultBadge = (result: string) => {
        if (result === 'aprobado') return <span className="text-green-600 font-black text-xl tracking-widest uppercase border-4 border-green-600 px-4 py-1 rounded-md rotate-[-5deg] inline-block shadow-sm">APROBADO</span>;
        if (result === 'condicional') return <span className="text-yellow-600 font-black text-xl tracking-widest uppercase border-4 border-yellow-600 px-4 py-1 rounded-md rotate-[-5deg] inline-block shadow-sm">CONDICIONAL</span>;
        if (result === 'rechazado') return <span className="text-red-600 font-black text-xl tracking-widest uppercase border-4 border-red-600 px-4 py-1 rounded-md rotate-[-5deg] inline-block shadow-sm">RECHAZADO</span>;
        return null;
    };

    // Public Authenticity Indicator Logic
    const getAuthenticityState = () => {
        if (mockCertificate.status === 'anulado') return { state: 'ANULADO', text: 'Documento sin validez probatoria.', color: 'text-gray-500 bg-gray-100 border-gray-500', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' };
        if (mockCertificate.certificate_hash && mockCertificate.status !== 'anulado') return { state: 'VERIFICADO', text: 'El sello criptográfico coincide con la matriz en blockchain/BD.', color: 'text-green-700 bg-green-50 border-green-500', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' };
        return { state: 'INCONSISTENTE', text: 'Alerta: Ausencia de hash o posible manipulación del PDF original.', color: 'text-red-700 bg-red-50 border-red-500', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' };
    };

    const authState = getAuthenticityState();

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border-t-8 border-escayr-dark">

                <div className="bg-escayr-dark px-8 py-6 text-center text-white relative">
                    <h1 className="text-3xl font-bold tracking-widest mb-1">ESCAYR</h1>
                    <p className="text-escayr-light text-sm">Verificación Pública de Certificación</p>
                </div>

                {/* Banner de Autenticidad */}
                <div className={`p-4 border-l-4 flex items-center justify-between shadow-inner ${authState.color}`}>
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={authState.icon} /></svg>
                        <div>
                            <p className="font-black tracking-widest text-sm">{authState.state}</p>
                            <p className="text-xs opacity-90">{authState.text}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div className="flex flex-col items-center border-b border-gray-200 pb-6">
                        <span className="text-gray-500 font-medium mb-2">Estado y Resultado</span>
                        <div className="flex gap-4 items-center">
                            {getStatusBadge(mockCertificate.status)}
                            {getResultBadge(mockCertificate.result)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <h3 className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-3">Datos del Certificado</h3>
                            <dl className="space-y-3">
                                <div className="grid grid-cols-2"><dt className="font-semibold text-gray-700">Código:</dt><dd className="font-mono text-escayr-dark">{mockCertificate.unique_code}</dd></div>
                                <div className="grid grid-cols-2"><dt className="font-semibold text-gray-700">Emisión:</dt><dd>{mockCertificate.emission_date}</dd></div>
                                <div className="grid grid-cols-2"><dt className="font-semibold text-gray-700">Vencimiento:</dt><dd className="font-bold">{mockCertificate.expiration_date}</dd></div>
                                <div className="grid grid-cols-2"><dt className="font-semibold text-gray-700">Inspector:</dt><dd>{mockCertificate.inspector_name}</dd></div>
                            </dl>
                        </div>

                        <div>
                            <h3 className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-3">Equipo Certificado</h3>
                            <dl className="space-y-3">
                                <div className="grid grid-cols-2"><dt className="font-semibold text-gray-700">Empresa:</dt><dd>{mockCertificate.client_name}</dd></div>
                                <div className="grid grid-cols-2"><dt className="font-semibold text-gray-700">Tipo/Norma:</dt><dd>{mockCertificate.inspection_type}</dd></div>
                                <div className="grid grid-cols-2"><dt className="font-semibold text-gray-700">Marca/Modelo:</dt><dd>{mockCertificate.brand_name} {mockCertificate.model}</dd></div>
                                <div className="grid grid-cols-2"><dt className="font-semibold text-gray-700">N° Serie:</dt><dd className="font-mono">{mockCertificate.serial_number}</dd></div>
                            </dl>
                        </div>
                    </div>

                    {/* Governance & Integrity */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-6">
                        <h3 className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            Integridad del Documento
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-gray-600 break-all">
                            <div><span className="font-bold block text-gray-500 font-sans">Hash Criptográfico (SHA-256):</span>{mockCertificate.certificate_hash}</div>
                            <div><span className="font-bold block text-gray-500 font-sans">Versión Plantilla/Regulación:</span>v{mockCertificate.certificate_version}</div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-4 text-center">Evidencias Fotográficas</h3>
                        <div className="flex gap-4 justify-center">
                            {mockCertificate.photos.map((url, i) => (
                                <div key={i} className="w-24 h-24 bg-gray-200 rounded-md border border-gray-300 overflow-hidden flex items-center justify-center text-xs text-gray-400">
                                    [Foto {i + 1}]
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center pt-8">
                        <button className="btn-outline font-bold flex mx-auto items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Descargar Certificado Original PDF
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
