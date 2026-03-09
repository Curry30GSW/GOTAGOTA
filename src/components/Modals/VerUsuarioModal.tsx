import React from 'react';
import { Usuario } from '../../types/usuario';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedUsuario: Usuario | null;
}

export default function VerUsuarioModal({
    isOpen,
    onClose,
    selectedUsuario
}: Props) {
    if (!isOpen || !selectedUsuario) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No disponible';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50">
            <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        Detalles del Usuario
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                    </button>
                </div>

                {/* Información del usuario */}
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700/50">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">ID</p>
                                <p className="font-medium text-gray-800 dark:text-white/90">
                                    {selectedUsuario.id_usuario}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Estado</p>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${selectedUsuario.activo === 1
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                    }`}>
                                    {selectedUsuario.activo === 1 ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Usuario:</dt>
                                <dd className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {selectedUsuario.usuario}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Nombre:</dt>
                                <dd className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {selectedUsuario.nombre}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Rol:</dt>
                                <dd className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
                                        {selectedUsuario.rol}
                                    </span>
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Fecha registro:</dt>
                                <dd className="text-sm text-gray-800 dark:text-white/90">
                                    {formatDate(selectedUsuario.created_at)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Botón cerrar */}
                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}