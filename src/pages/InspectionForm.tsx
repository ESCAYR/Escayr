import React, { useState } from 'react';
import { Layout } from '../components/Layout';

type Category = 'textil' | 'plastico' | 'metalico' | 'partes_moviles' | 'seguros';

const mockChecklist: { id: string; category: Category; description: string }[] = [
    { id: '1', category: 'textil', description: 'Estado general de las cintas (sin cortes, quemaduras o desgaste excesivo)' },
    { id: '2', category: 'textil', description: 'Estado de las costuras de seguridad (sin hilos sueltos o rotos)' },
    { id: '3', category: 'metalico', description: 'Estado de las partes metálicas (hebillas y argollas D, sin óxido o deformaciones)' },
    { id: '4', category: 'plastico', description: 'Etiqueta legible (fecha de fabricación, lote, norma)' },
];

const categoryLabels: Record<Category, string> = {
    textil: 'Partes Textiles',
    plastico: 'Partes Plásticas',
    metalico: 'Partes Metálicas',
    partes_moviles: 'Partes Móviles',
    seguros: 'Seguros y Cierres'
};

export default function InspectionForm() {
    const [items, setItems] = useState<Record<string, { compliant: boolean | null, finding: boolean, comment: string }>>({});
    const [status, setStatus] = useState<'borrador' | 'listo_para_emitir'>('borrador');
    const [result, setResult] = useState<'aprobado' | 'rechazado' | 'condicional' | ''>('');
    const [isOffline, setIsOffline] = useState(false);

    // Conceptual Offline-first implementation mockup using localStorage
    React.useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        const savedDraft = localStorage.getItem('escayr_inspection_draft_001');
        if (savedDraft) {
            console.log("Cargado borrador offline");
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Group items by category
    const groupedItems = mockChecklist.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<Category, typeof mockChecklist>);

    const handleToggleCompliant = (id: string, value: boolean) => {
        setItems(prev => ({
            ...prev,
            [id]: { ...prev[id], compliant: value }
        }));
    };

    const handleToggleFindingAction = (id: string) => {
        alert(`Plan de Acción para el hallazgo [${id}]:\nIndique responsable y fecha objetivo (Mockup).`);
    };

    const handleSaveDraft = () => {
        alert('Borrador guardado exitosamente');
    };

    const handEmmit = () => {
        if (!result) {
            alert('Debe seleccionar el Resultado Final de la inspección antes de emitir.');
            return;
        }
        if (isOffline) {
            alert('Sin conexión: Los datos se han guardado localmente. Podrá emitir al recuperar la conexión.');
            return;
        }
        if (confirm('¿Está seguro de emitir el certificado? Esto congelará las evidencias y generará el PDF final.')) {
            alert('Certificado emitido con éxito. Redirigiendo...');
        }
    };

    return (
        <Layout user={{ name: 'Juan Pérez', role: 'inspector' }}>
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header de Inspección */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            Inspección de Equipo
                            {isOffline && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">Sin Conexión (Modo Local)</span>}
                        </h1>
                        <p className="text-gray-500">Arnés de Cuerpo Completo - Constructora Andina</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Borrador</span>
                </div>

                {/* Datos Principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card">
                        <div className="card-header">Datos del Equipo</div>
                        <div className="card-body space-y-2 text-sm">
                            <p><span className="font-semibold w-32 inline-block">Marca/Modelo:</span> Petzl / Newton Fast</p>
                            <p><span className="font-semibold w-32 inline-block">No. Serie:</span> 21A004123</p>
                            <p><span className="font-semibold w-32 inline-block">Fabricación:</span> 2021-04-10</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">Evidencia Fotográfica General</div>
                        <div className="card-body">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <p className="text-sm text-gray-500 mb-2">Sube o toma fotografías del equipo</p>
                                <button className="btn-secondary text-sm">Subir Fotos / Abrir Cámara</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checklist Agrupado */}
                {Object.entries(groupedItems).map(([category, catItems]) => (
                    <div className="card mt-6" key={category}>
                        <div className="card-header bg-escayr-light text-escayr-dark border-b-escayr-dark border-b-2">
                            <h3 className="font-bold uppercase tracking-wider text-xs">{categoryLabels[category as Category]}</h3>
                        </div>
                        <div className="card-body p-0">
                            <ul className="divide-y divide-gray-200">
                                {catItems.map(item => {
                                    const isFailing = items[item.id]?.compliant === false;
                                    return (
                                        <li key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="text-sm">{item.description}</p>
                                                {isFailing && (
                                                    <div className="mt-2 bg-red-50 p-2 text-xs border border-red-200 rounded text-red-700 flex justify-between items-center">
                                                        <span>⚠️ Hallazgo detectado</span>
                                                        <button onClick={() => handleToggleFindingAction(item.id)} className="font-bold underline">
                                                            + Asignar Plan de Acción
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex bg-gray-100 rounded-md p-1">
                                                    <button
                                                        onClick={() => handleToggleCompliant(item.id, true)}
                                                        className={`px-3 py-1 text-sm rounded ${items[item.id]?.compliant === true ? 'bg-green-500 text-white' : 'text-gray-600'}`}
                                                    >
                                                        Cumple
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleCompliant(item.id, false)}
                                                        className={`px-3 py-1 text-sm rounded ${items[item.id]?.compliant === false ? 'bg-red-500 text-white' : 'text-gray-600'}`}
                                                    >
                                                        Falla
                                                    </button>
                                                </div>

                                                <button className="text-escayr-accent hover:underline text-sm font-medium">
                                                    + Hallazgo / Foto
                                                </button>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                ))}

                {/* Resultado Final (Nuevo Requisito) */}
                <div className="card mt-6 border-l-4 border-escayr-dark">
                    <div className="card-body">
                        <h3 className="font-bold text-gray-800 mb-4">Dictamen / Resultado de Mapeo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <button
                                onClick={() => setResult('aprobado')}
                                className={`p-3 border-2 rounded-lg font-bold ${result === 'aprobado' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                APROBADO
                            </button>
                            <button
                                onClick={() => setResult('condicional')}
                                className={`p-3 border-2 rounded-lg font-bold ${result === 'condicional' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                CONDICIONAL
                            </button>
                            <button
                                onClick={() => setResult('rechazado')}
                                className={`p-3 border-2 rounded-lg font-bold ${result === 'rechazado' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                RECHAZADO
                            </button>
                        </div>
                    </div>
                </div>

                {/* Firma digital */}
                <div className="card">
                    <div className="card-header">Firma Digital del Inspector</div>
                    <div className="card-body h-40 bg-gray-50 flex items-center justify-center border border-gray-200">
                        <span className="text-gray-400 italic">Área para firmar en pantalla o recuadrar firma guardada</span>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex justify-end gap-4 pb-12">
                    <button className="btn-secondary" onClick={handleSaveDraft}>Guardar Borrador</button>
                    <button className="btn-primary" onClick={handEmmit}>Emitir Certificado</button>
                </div>

            </div>
        </Layout>
    );
}
