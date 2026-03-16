import { useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import SedesTab from './SedesTab';
import UsuariosTab from './UsuariosTab';

export default function Configuracion() {
    const [activeTab, setActiveTab] = useState<'sedes' | 'usuarios'>('sedes');

    // Obtener usuario actual
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAdmin = user?.rol === 'admin';

    // Si no es admin, redirigir o mostrar mensaje
    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                        Acceso Restringido
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Solo los administradores pueden acceder a esta sección
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <PageMeta
                title="Configuración | Panel de Control"
                description="Gestión de sedes y usuarios"
            />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Configuración
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Administra las sedes y usuarios del sistema
                    </p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('sedes')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'sedes'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Sedes
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('usuarios')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'usuarios'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Usuarios
                            </div>
                        </button>
                    </nav>
                </div>

                {/* Contenido según tab activo */}
                <div className="mt-6">
                    {activeTab === 'sedes' ? <SedesTab /> : <UsuariosTab />}
                </div>
            </div>
        </>
    );
}