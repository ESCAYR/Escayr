import React from 'react';

// Using simulated router links for static conceptualization
const Link = ({ to, children, className }: any) => <a href={to} className={className}>{children}</a>;

export function Layout({ children, user }: { children: React.ReactNode, user?: any }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar corporativo */}
            <header className="bg-escayr-technical text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Logo placeholder */}
                        <div className="h-8 w-8 bg-escayr-dark rounded flex items-center justify-center font-bold text-escayr-light">
                            E
                        </div>
                        <span className="font-bold text-xl tracking-wide">ESCAYR</span>
                    </div>

                    {user && (
                        <nav className="hidden md:flex space-x-4">
                            <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                            <Link to="/equipments" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Equipos</Link>
                            <Link to="/inspections" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Inspecciones</Link>
                            <Link to="/certificates" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Certificados</Link>
                        </nav>
                    )}

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-300">
                                    {user.role === 'admin' ? 'Administrador' : 'Inspector'} | {user.name}
                                </span>
                                <button className="text-escayr-accent hover:text-white text-sm font-medium">Salir</button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-sm font-medium hover:text-escayr-light">Acceso Profesional</Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Footer minimalista */}
            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} ESCAYR - Certificación de Equipos de Trabajo en Alturas
                </div>
            </footer>
        </div>
    );
}
