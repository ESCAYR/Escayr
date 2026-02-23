import React from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InspectionForm from './pages/InspectionForm';
import PublicCertificate from './pages/PublicCertificate';
import EquipmentHistory from './pages/EquipmentHistory';
import EquipmentDetail from './pages/EquipmentDetail';

/**
 * Conceptual Entry Point / Routing Mapping
 * This would be replaced by react-router-dom <BrowserRouter> logic.
 */
export default function App() {
    const currentPath = window.location.pathname;

    // Simple static routing mock
    if (currentPath.startsWith('/verificar/')) {
        return <PublicCertificate />;
    }

    if (currentPath === '/login') {
        return <Login />;
    }

    if (currentPath === '/dashboard') {
        return <Dashboard />;
    }

    if (currentPath === '/equipments') {
        return <EquipmentHistory />;
    }

    if (currentPath.startsWith('/equipments/')) {
        return <EquipmentDetail />;
    }

    if (currentPath === '/inspections/new') {
        return <InspectionForm />;
    }

    // Default redirect to dashboard or login
    return (
        <div className="min-h-screen flex items-center justify-center bg-escayr-base text-center">
            <div>
                <h1 className="text-4xl font-bold text-escayr-dark mb-4">ESCAYR App</h1>
                <div className="space-x-4">
                    <a href="/login" className="btn-secondary inline-block">Ir a Login</a>
                    <a href="/dashboard" className="btn-primary inline-block">Ir a Dashboard</a>
                    <a href="/equipments/EQ-001" className="btn-outline inline-block">Ver Equipo</a>
                    <a href="/inspections/new" className="btn-outline inline-block">Nueva Inspección</a>
                    <a href="/verificar/ESCAYR-84B9A2" className="btn-accent inline-block">Probar QR de Verificación</a>
                </div>
            </div>
        </div>
    );
}
