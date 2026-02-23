import React from 'react';
import { Layout } from '../components/Layout';

// Mock data
const mockAlerts = [
    { id: 1, type: 'warning', message: 'Certificado EQ-0012 por vencer en 15 días (Cliente: Constructora Andina).' },
    { id: 2, type: 'info', message: 'Tiene 2 inspecciones en estado borrador.' }
];

const mockRecent = [
    { id: 'I-1002', date: '2026-02-20', client: 'Constructora Andina', equipment: 'Arnés Petzl Newton', status: 'emitido' },
    { id: 'I-1003', date: '2026-02-21', client: 'Servicios Verticales', equipment: 'Línea de vida 3M', status: 'borrador' },
];

export default function Dashboard() {
    // Conceptual user
    const user = { name: 'Juan Pérez', role: 'inspector' as const };

    return (
        <Layout user={user}>
            <div className="space-y-6">

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-escayr-technical">Dashboard de {user.role === 'admin' ? 'Administración' : 'Inspector'}</h1>
                        <p className="text-gray-600">Resumen de actividad y alertas pendientes.</p>
                    </div>
                    <button className="btn-accent shadow-md">
                        + Nueva Inspección
                    </button>
                </div>

                {/* Alertas Segment */}
                {mockAlerts.length > 0 && (
                    <div className="bg-orange-50 border-l-4 border-escayr-accent p-4 rounded-r-md">
                        <h3 className="text-sm font-bold text-orange-800 mb-2">Alertas del Sistema</h3>
                        <ul className="space-y-1">
                            {mockAlerts.map(alert => (
                                <li key={alert.id} className="text-sm text-orange-700 flex items-start gap-2">
                                    <span>•</span> {alert.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stats Cards */}
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Certificados Vigentes</h3>
                            <p className="mt-2 text-3xl font-bold text-escayr-dark">142</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Inspecciones (Mes)</h3>
                            <p className="mt-2 text-3xl font-bold text-gray-800">28</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Por Vencer (<30d)</h3>
                            <p className="mt-2 text-3xl font-bold text-escayr-accent">5</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="card">
                    <div className="card-header flex justify-between items-center">
                        <h3>Actividad Reciente</h3>
                        <button className="text-sm text-escayr-dark hover:underline">Ver todo</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente / Equipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                {mockRecent.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{item.client}</div>
                                            <div className="text-gray-500 text-xs">{item.equipment}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'emitido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {item.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-escayr-dark hover:text-black">
                                                {item.status === 'emitido' ? 'Ver' : 'Continuar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </Layout>
    );
}
