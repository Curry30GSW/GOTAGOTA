import React from 'react';
import { PencilIcon, TrashBinIcon } from '../../icons';
import { Usuario } from '../../types/usuario';

interface UsuarioCardProps {
    usuario: Usuario;
    onEditar: (usuario: Usuario) => void;
    onEliminar: (id: number, nombre: string) => void;
    onActivar: (id: number) => void;
    sedeNombre: string;
    formatDate: (date: string) => string;
    getRolStyles: (rol: string) => string;
    getRolLabel: (rol: string) => string;
    getEstadoStyles: (activo: number) => string;
}

export default function UsuarioCard({
    usuario,
    onEditar,
    onEliminar,
    onActivar,
    sedeNombre,
    formatDate,
    getRolStyles,
    getRolLabel,
    getEstadoStyles
}: UsuarioCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
            {/* Header con ID y acciones */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        #{usuario.id_usuario}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoStyles(usuario.activo)}`}>
                        {usuario.activo === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEditar(usuario)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Editar"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>

                    {usuario.activo === 1 ? (
                        <button
                            onClick={() => onEliminar(usuario.id_usuario, usuario.nombre)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Inhabilitar"
                        >
                            <TrashBinIcon className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() => onActivar(usuario.id_usuario)}
                            className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Activar"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Información del usuario */}
            <div className="space-y-2">
                {/* Usuario y Nombre */}
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {usuario.nombre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        @{usuario.usuario}
                    </p>
                </div>

                {/* Rol y Sede */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rol</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRolStyles(usuario.rol)}`}>
                            {getRolLabel(usuario.rol)}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Sede</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                            {sedeNombre}
                        </p>
                    </div>
                </div>

                {/* Fecha de creación */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fecha de creación</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                        {formatDate(usuario.created_at)}
                    </p>
                </div>
            </div>
        </div>
    );
}