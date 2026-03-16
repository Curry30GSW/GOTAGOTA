import React from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { SedeFormData } from '../../types/sede';

interface CrearSedeModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: SedeFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    formErrors: Partial<SedeFormData>;
}

export default function CrearSedeModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onSubmit,
    formErrors
}: CrearSedeModalProps) {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Nueva Sede
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Registre una nueva sede en el sistema
                        </p>
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

                    {/* Información adicional opcional */}
                    {formData.nombre_sede && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                                📋 Resumen de la Sede
                            </h4>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">Nombre:</span>{' '}
                                    {formData.nombre_sede}
                                </p>
                                {formData.direccion && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Dirección:</span>{' '}
                                        {formData.direccion}
                                    </p>
                                )}
                                {formData.telefono && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Teléfono:</span>{' '}
                                        {formData.telefono}
                                    </p>
                                )}
                            </div>
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
                        >
                            Crear Sede
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}