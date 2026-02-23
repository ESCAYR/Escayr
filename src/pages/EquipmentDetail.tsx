import React from 'react';
import { Layout } from '../components/Layout';

// Mock Data for the Timeline UI
const equipmentDetails = {
    brand: 'Petzl',
    model: 'Arnés Avao Bod Fast',
    serial: '24B00988',
    client: 'Minería Andina',
    operationalStatus: 'apto',
};

const mockReinspectionData = {
    isReinspection: true,
    previous: {
        date: '2025-02-05',
        result: 'rechazado',
        status: 'no_apto',
        findings: 3
    },
    current: {
        date: '2026-02-22',
        result: 'aprobado',
        status: 'apto',
        findings: 0
    }
};

const mockEvents = [
    {
        id: '1',
        date: '2026-02-22 14:30',
        type: 'inspection_emitted',
        title: 'Inspección Aprobada',
        desc: 'Certificado ESC-26-0092 emitido correctamente por Juan Pérez.',
        color: 'bg-green-500'
    },
    {
        id: '2',
        date: '2026-02-22 14:15',
        type: 'document_uploaded',
        title: 'Ficha Técnica Añadida',
        desc: 'Se adjuntó el manual de usuario original provisto por Petzl.',
        color: 'bg-blue-500'
    },
    {
        id: '3',
        date: '2025-02-10 10:00',
        type: 'finding_action_created',
        title: 'Acción Correctiva Completada',
        desc: 'Limpieza profunda de hebillas metálicas. Realizado por taller.',
        color: 'bg-yellow-500'
    },
    {
        id: '4',
        date: '2025-02-05 09:30',
        type: 'inspection_rejected',
        title: 'Inspección Condicionada',
        desc: 'Hallazgo en movilidad de hebillas por suciedad. Certificado ESC-25-0104.',
        color: 'bg-orange-500'
    }
];

export default function EquipmentDetail() {
    const getRecommendedAction = (status: string) => {
        switch (status) {
            case 'apto': return { text: 'Programar próxima inspección antes del vencimiento.', type: 'info', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
            case 'apto_condicionado': return { text: 'Realizar mantenimiento preventivo o resolver hallazgos menores.', type: 'warning', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' };
            case 'no_apto': return { text: 'Retirar de servicio inmediatamente. Riesgo alto.', type: 'critical', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
            case 'fuera_servicio': return { text: 'Equipo inactivo. Proceder con baja definitiva si aplica.', type: 'neutral', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' };
            default: return { text: 'Analizar historial operativo.', type: 'neutral', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
        }
    };

    const action = getRecommendedAction(equipmentDetails.operationalStatus);

    return (
        <Layout user={{ name: 'Admin', role: 'admin' }}>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Cabecera del Equipo */}
                <div className="card border-l-4 border-escayr-dark">
                    <div className="card-body flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                {equipmentDetails.brand} {equipmentDetails.model}
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded border border-green-600 uppercase font-bold tracking-wider">
                                    {equipmentDetails.operationalStatus}
                                </span>
                            </h1>
                            <p className="text-gray-500 font-mono mt-1">S/N: {equipmentDetails.serial}</p>
                            <p className="text-sm mt-2 font-medium text-gray-700">Cliente: {equipmentDetails.client}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn-secondary text-sm">Ver Certificado Actual</button>
                            <button className="btn-secondary text-sm">Gestionar Docs</button>
                        </div>
                    </div>
                </div>

                {/* Acción Recomendada (Derived) */}
                <div className={`rounded-xl p-5 border-l-4 shadow-sm flex items-start gap-4 ${action.type === 'info' ? 'bg-blue-50 border-blue-500 text-blue-800' :
                    action.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                        action.type === 'critical' ? 'bg-red-50 border-red-500 text-red-800' :
                            'bg-gray-50 border-gray-500 text-gray-800'
                    }`}>
                    <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-1 opacity-80">Siguiente Acción Recomendada del Sistema</h3>
                        <p className="font-medium">{action.text}</p>
                    </div>
                </div>

                {/* Re-inspection Comparison View */}
                {mockReinspectionData.isReinspection && (
                    <div className="card">
                        <div className="card-header border-b-2 border-escayr-light bg-blue-50">
                            <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                Análisis de Reinspección / Levantamiento de Hallazgos
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="flex items-center justify-between text-center gap-4">
                                <div className="flex-1 bg-red-50 p-4 rounded-lg border border-red-100">
                                    <p className="text-xs font-bold text-red-800 uppercase mb-2">Inspección Anterior ({mockReinspectionData.previous.date})</p>
                                    <div className="text-lg font-black text-red-600 uppercase">{mockReinspectionData.previous.result}</div>
                                    <p className="text-xs text-red-700 mt-1">{mockReinspectionData.previous.findings} Hallazgo(s) Críticos</p>
                                </div>

                                <svg className="w-8 h-8 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>

                                <div className="flex-1 bg-green-50 p-4 rounded-lg border border-green-100">
                                    <p className="text-xs font-bold text-green-800 uppercase mb-2">Inspección Actual ({mockReinspectionData.current.date})</p>
                                    <div className="text-lg font-black text-green-600 uppercase">{mockReinspectionData.current.result}</div>
                                    <p className="text-xs text-green-700 mt-1">{mockReinspectionData.current.findings} Hallazgo(s) - Subsanado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Línea de Tiempo de Eventos (Governance) */}
                <div className="card">
                    <div className="card-header border-b-2 border-escayr-light bg-gray-50">
                        <h2 className="text-lg font-bold text-escayr-dark flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Traza de Auditoría / Línea de Vida
                        </h2>
                    </div>
                    <div className="card-body">
                        <div className="relative border-l border-gray-200 ml-3 space-y-8">
                            {mockEvents.map((evt) => (
                                <div key={evt.id} className="relative pl-8">
                                    {/* Icono/Punto del Timeline */}
                                    <div className={`absolute -left-2 top-1.5 w-4 h-4 rounded-full border-2 border-white ${evt.color}`}></div>

                                    {/* Contenido del Evento */}
                                    <div className="mb-1 text-xs text-gray-400 font-mono">{evt.date}</div>
                                    <h3 className="text-md font-bold text-gray-800">{evt.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-md border border-gray-100">
                                        {evt.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
