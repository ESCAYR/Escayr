import React, { useState } from 'react';
import { Layout } from '../components/Layout';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Supabase auth conceptual flow
        // const { error } = await supabase.auth.signInWithPassword({ email, password });
        setTimeout(() => {
            setLoading(false);
            alert('Login flow initiated');
        }, 1000);
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto mt-12">
                <div className="card">
                    <div className="card-header bg-escayr-dark text-white text-center py-6">
                        <h2 className="text-2xl font-bold">Plataforma de Certificación</h2>
                        <p className="text-escayr-light mt-1 text-sm">Acceso exclusivo para personal autorizado</p>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="label-field" htmlFor="email">Correo Electrónico</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="input-field"
                                    placeholder="inspector@escayr.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="label-field" htmlFor="password">Contraseña</label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full flex justify-center py-3 text-lg"
                                >
                                    {loading ? 'Iniciando sesión...' : 'Ingresar al Sistema'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
