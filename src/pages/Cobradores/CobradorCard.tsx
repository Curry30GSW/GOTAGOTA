import React from 'react';
import { PencilIcon, TrashBinIcon } from '../../icons';
import { Cobrador } from '../../types/cobrador';

interface CobradorCardProps {
    cobrador: Cobrador;
    onVer: (cobrador: Cobrador) => void;
    onEditar: (cobrador: Cobrador) => void;
    onEliminar: (cobrador: Cobrador) => void;
    onReactivar: (cobrador: Cobrador) => void;
}

export default function CobradorCard({
    cobrador,
    onVer,
    onEditar,
    onEliminar,
    onReactivar
}: CobradorCardProps) {
    const getEstadoStyles = (activo: number) => {
        return activo === 1
            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    };

    const formatFecha = (fecha?: string) => {
        if (!fecha) return 'No registrada';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow">
            {/* Header con ID y Estado */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    #{cobrador.id_cobrador}
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoStyles(cobrador.activo)}`}>
                    {cobrador.activo === 1 ? 'Activo' : 'Inactivo'}
                </span>
            </div>

            {/* Información principal */}
            <div className="space-y-3">
                {/* Nombre completo */}
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Nombre completo</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {cobrador.nombre} {cobrador.apellidos}
                    </p>
                </div>

                {/* Grid de información */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Cédula</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {cobrador.cedula}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Celular</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {cobrador.celular}
                        </p>
                    </div>
                </div>

                {/* Dirección */}
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Dirección</p>
                    <p className="text-sm text-gray-900 dark:text-white truncate">
                        {cobrador.direccion || '-'}
                    </p>
                </div>

                {/* Fecha de registro */}
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fecha de registro</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                        {formatFecha(cobrador.created_at)}
                    </p>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={() => onVer(cobrador)}
                    className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                    title="Ver detalles"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7 -1.274 4.057-5.065 7-9.542 7 -4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>

                <button
                    onClick={() => onEditar(cobrador)}
                    className="p-2 rounded-lg border border-gray-300 bg-white text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:border-gray-600 dark:bg-gray-700 dark:text-amber-400 dark:hover:bg-gray-600 transition-colors"
                    title="Editar"
                >
                    <PencilIcon className="w-4 h-4" />
                </button>

                {cobrador.activo === 1 ? (
                    <button
                        onClick={() => onEliminar(cobrador)}
                        className="p-2 rounded-lg border border-gray-300 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-gray-600 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-gray-600 transition-colors"
                        title="Eliminar"
                    >
                        <TrashBinIcon className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={() => onReactivar(cobrador)}
                        className="px-3 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 transition-colors text-xs font-medium"
                        title="Reactivar"
                    >
                        Activar
                    </button>
                )}
            </div>
        </div>
    );
}