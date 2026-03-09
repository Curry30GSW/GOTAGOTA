import React from 'react';
import { Usuario } from '../../types/usuario';
import { TrashBinIcon } from '../../icons';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    selectedUsuario: Usuario | null;
}

export default function EliminarUsuarioModal({
    isOpen,
    onClose,
    onConfirm,
    selectedUsuario
}: Props) {
    if (!isOpen || !selectedUsuario) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50">
            <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        Confirmar Eliminación
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                    </button>
                </div>

                {/* Contenido */}
                <div className="text-center">
                    <div className="inline-flex p-3 mb-4 bg-red-100 rounded-full dark:bg-red-900/20">
                        <TrashBinIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                        ¿Estás seguro?
                    </h3>

                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                        Estás a punto de eliminar al usuario:
                    </p>

                    <div className="p-4 mb-6 bg-gray-50 rounded-lg dark:bg-gray-700/50">
                        <p className="font-medium text-gray-800 dark:text-white/90">
                            {selectedUsuario.nombre}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            @{selectedUsuario.usuario}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Rol: {selectedUsuario.rol}
                        </p>
                    </div>

                    <p className="mb-6 text-sm text-red-600 dark:text-red-400">
                        Esta acción no se puede deshacer.
                    </p>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Sí, eliminar
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}