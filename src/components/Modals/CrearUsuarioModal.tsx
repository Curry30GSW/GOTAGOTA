import React from 'react';
import { UsuarioFormData } from '../../types/usuario';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    formData: UsuarioFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    formErrors: Partial<UsuarioFormData>;
}

export default function CrearUsuarioModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onSubmit,
    formErrors
}: Props) {
    if (!isOpen) return null;

    const roles = ['admin', 'usuario', 'supervisor'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50">
            <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        Crear Nuevo Usuario
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Usuario */}
                    <div>
                        <Label>
                            Usuario <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            name="usuario"
                            value={formData.usuario}
                            onChange={onChange}
                            placeholder="Ingrese nombre de usuario"
                            required
                        />
                        {formErrors.usuario && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.usuario}</p>
                        )}
                    </div>

                    {/* Contraseña */}
                    <div>
                        <Label>
                            Contraseña <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            name="contraseña"
                            type="password"
                            value={formData.contraseña || ''}
                            onChange={onChange}
                            placeholder="Ingrese contraseña"
                            required
                        />
                        {formErrors.contraseña && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.contraseña}</p>
                        )}
                    </div>

                    {/* Nombre completo */}
                    <div>
                        <Label>
                            Nombre completo <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            name="nombre"
                            value={formData.nombre}
                            onChange={onChange}
                            placeholder="Ingrese nombre completo"
                            required
                        />
                        {formErrors.nombre && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.nombre}</p>
                        )}
                    </div>

                    {/* Rol */}
                    <div>
                        <Label>
                            Rol <span className="text-red-500">*</span>
                        </Label>
                        <select
                            name="rol"
                            value={formData.rol}
                            onChange={onChange}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white/90"
                            required
                        >
                            <option value="">Seleccione un rol</option>
                            {roles.map(rol => (
                                <option key={rol} value={rol}>{rol}</option>
                            ))}
                        </select>
                        {formErrors.rol && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.rol}</p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Crear Usuario
                        </Button>
                        <Button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}