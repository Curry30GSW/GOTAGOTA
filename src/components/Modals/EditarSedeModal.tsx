import React from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
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

    // Función para determinar si hay cambios
    const hasChanges = () => {
        return (
            formData.nombre_sede !== sede.nombre_sede ||
            formData.direccion !== sede.direccion ||
            formData.telefono !== sede.telefono
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Editar Sede
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Modifique los datos de la sede
                        </p>
                        {sede && (
                            <div className="mt-2 flex items-center gap-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sede.activo === 1
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                    }`}>
                                    {sede.activo === 1 ? 'Activa' : 'Inactiva'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ID: #{sede.id_sede}
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Nombre de la Sede */}
                    <div>
                        <Label>
                            Nombre de la Sede <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="nombre_sede"
                            value={formData.nombre_sede}
                            onChange={onChange}
                            placeholder="Ej: Sede Centro"
                            required
                            error={formErrors.nombre_sede}
                            hint={formErrors.nombre_sede}
                        />
                    </div>

                    {/* Dirección */}
                    <div>
                        <Label>
                            Dirección <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={onChange}
                            placeholder="Ej: Calle 123 #45-67"
                            required
                            error={formErrors.direccion}
                            hint={formErrors.direccion}
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <Label>
                            Teléfono <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={onChange}
                            placeholder="Ej: 3001234567"
                            required
                            error={formErrors.telefono}
                            hint={formErrors.telefono}
                        />
                    </div>

                    {/* Información de la sede (solo lectura) */}
                    {sede && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Información adicional
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Fecha de creación</p>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">
                                        {new Date(sede.created_at).toLocaleDateString('es-CO', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                {sede.updated_at && (
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Última actualización</p>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">
                                            {new Date(sede.updated_at).toLocaleDateString('es-CO', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Resumen de cambios */}
                    {hasChanges() && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                            <p className="text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Se detectaron cambios sin guardar
                            </p>
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={!hasChanges()}
                        >
                            Actualizar Sede
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}