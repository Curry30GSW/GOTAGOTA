import React from 'react';
import { Sede, SedeFormData } from '../../types/sede';

interface EditarSedeModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: SedeFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    formErrors: Partial<SedeFormData>;
    sede: Sede | null;
}

export default function EditarSedeModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onSubmit,
    formErrors,
    sede
}: EditarSedeModalProps) {
    if (!isOpen || !sede) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
                    Editar Sede
                </h2>

                <form onSubmit={onSubmit}>
                    {/* Nombre */}
                    <div className="mb-4">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nombre de la Sede *
                        </label>
                        <input
                            type="text"
                            name="nombre_sede"
                            value={formData.nombre_sede}
                            onChange={onChange}
                            className={`w-full rounded-lg border ${formErrors.nombre_sede ? 'border-red-500' : 'border-gray-300'} bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90`}
                        />
                        {formErrors.nombre_sede && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.nombre_sede}</p>
                        )}
                    </div>

                    {/* Dirección */}
                    <div className="mb-4">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Dirección *
                        </label>
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={onChange}
                            className={`w-full rounded-lg border ${formErrors.direccion ? 'border-red-500' : 'border-gray-300'} bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90`}
                        />
                        {formErrors.direccion && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.direccion}</p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div className="mb-6">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Teléfono *
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={onChange}
                            className={`w-full rounded-lg border ${formErrors.telefono ? 'border-red-500' : 'border-gray-300'} bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90`}
                        />
                        {formErrors.telefono && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.telefono}</p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Actualizar Sede
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}