import React from 'react';
import { Layout } from '../components/Layout';

// Mock data showing operation history of equipments
const mockHistory = [
    {
        id: 'EQ-001',
        client: 'Constructora Andina S.A.',
        brand: 'Petzl',
        equipment: 'Arnés Newton Fast',
        serial: '21A004123',
        lastInspection: '2026-02-22',
        nextInspection: '2027-02-22',
        status: 'vigente',
        result: 'aprobado',
        operationalStatus: 'apto',
        docsCount: 3
    },
    {
        id: 'EQ-002',
        client: 'Servicios Verticales',
        brand: '3M',
        equipment: 'Eslinga Doble',
        serial: '3M-9821-XX',
        lastInspection: '2025-10-15',
        nextInspection: '2026-04-15',
        status: 'vigente',
        result: 'condicional',
        operationalStatus: 'apto_condicionado',
        docsCount: 2
    },
    {
        id: 'EQ-003',
        client: 'Mantenimiento del Norte',
        brand: 'Singing Rock',
        equipment: 'Casco Flash',
        serial: 'SR-77112',
        lastInspection: '2024-11-10',
        nextInspection: '2025-11-10',
        status: 'vencido',
        result: 'rechazado',
        operationalStatus: 'no_apto',
        docsCount: 4
    }
];

export default function EquipmentHistory() {
    return (
        <Layout user={{ name: 'Admin', role: 'admin' }}>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-escayr-technical">Historial Operativo de Equipos</h1>
                        <p className="text-gray-600">Seguimiento de inspecciones, vida útil y gestión documental de los equipos.</p>
                    </div>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Buscar por serie o cliente..." className="input-field" />
                        <button className="btn-secondary">Filtrar</button>
                    </div>
                </div>

                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo / Serie</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Última Insp.</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Próxima Insp.</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Certificado</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Operativo</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Docs</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                {mockHistory.map(eq => (
                                    <tr key={eq.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-escayr-dark">{eq.brand} {eq.equipment}</div>
                                            <div className="font-mono text-xs text-gray-500">{eq.serial}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{eq.client}</td>
                                        <td className="px-6 py-4 text-center text-gray-500">{eq.lastInspection}</td>
                                        <td className="px-6 py-4 text-center font-medium">{eq.nextInspection}</td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${eq.status === 'vigente' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {eq.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-4 font-bold border rounded-md uppercase ${eq.operationalStatus === 'apto' ? 'border-green-600 text-green-700 bg-green-50' :
                                                    eq.operationalStatus === 'no_apto' ? 'border-red-600 text-red-700 bg-red-50' :
                                                        eq.operationalStatus === 'apto_condicionado' ? 'border-yellow-600 text-yellow-700 bg-yellow-50' :
                                                            'border-gray-600 text-gray-700 bg-gray-50'
                                                }`}>
                                                {eq.operationalStatus.replace('_', ' ')}
                                            </span>
                                            <div className="text-[10px] text-gray-400 mt-1">Por: {eq.result}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-escayr-dark hover:text-black font-medium text-sm flex items-center justify-end gap-1 w-full">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                </svg>
                                                {eq.docsCount} Docs
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expediente / Visualizador de Docs (Conceptual Modal Area) */}
                <div className="card bg-gray-50 border-dashed border-2">
                    <div className="card-body text-center text-sm text-gray-500">
                        Selecciona un equipo para ver su línea de tiempo documental (Ficha Técnica, Certificado de Conformidad, Certificado de Inspección).
                    </div>
                </div>

            </div>
        </Layout>
    );
}
