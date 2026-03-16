import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { Usuario, UsuarioFormData } from '../../types/usuario';

interface EditarUsuarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: UsuarioFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    formErrors: Partial<UsuarioFormData>;
    usuario: Usuario | null;
    sedes: { id_sede: number; nombre_sede: string; activo: number }[];
    userRol: string;
}

export default function EditarUsuarioModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onSubmit,
    formErrors,
    usuario,
    sedes,
    userRol
}: EditarUsuarioModalProps) {
    if (!isOpen || !usuario) return null;

    const [showPassword, setShowPassword] = useState(false);
    const [cambiarPassword, setCambiarPassword] = useState(false);
    const roles = ['admin', 'supervisor', 'usuario'];

    // Filtrar sedes activas
    const sedesActivas = sedes.filter(s => s.activo === 1);

    // Verificar si hay cambios
    const hasChanges = () => {
        if (!usuario) return false;
        return (
            formData.usuario !== usuario.usuario ||
            formData.nombre !== usuario.nombre ||
            formData.rol !== usuario.rol ||
            formData.id_sede !== usuario.id_sede ||
            (cambiarPassword && formData.contraseña)
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Editar Usuario
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Modifique los datos del usuario
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${usuario.activo === 1
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                }`}>
                                {usuario.activo === 1 ? 'Activo' : 'Inactivo'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                ID: #{usuario.id_usuario}
                            </span>
                        </div>
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
                    {/* Usuario */}
                    <div>
                        <Label>
                            Usuario <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="usuario"
                            value={formData.usuario}
                            onChange={onChange}
                            placeholder="Ej: jperez"
                            required
                            error={formErrors.usuario}
                            hint={formErrors.usuario}
                        />
                    </div>

                    {/* Contraseña - opcional en edición */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                id="cambiarPassword"
                                checked={cambiarPassword}
                                onChange={(e) => setCambiarPassword(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="cambiarPassword" className="mb-0">
                                Cambiar contraseña
                            </Label>
                        </div>

                        {cambiarPassword && (
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="contraseña"
                                    value={formData.contraseña || ''}
                                    onChange={onChange}
                                    placeholder="Nueva contraseña"
                                    required={cambiarPassword}
                                    error={formErrors.contraseña}
                                    hint={formErrors.contraseña}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Nombre completo */}
                    <div>
                        <Label>
                            Nombre completo <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={onChange}
                            placeholder="Ej: Juan Pérez"
                            required
                            error={formErrors.nombre}
                            hint={formErrors.nombre}
                        />
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
                            disabled={userRol !== 'admin' && usuario.id_usuario === JSON.parse(localStorage.getItem('user') || '{}').id}
                        >
                            <option value="">Seleccione un rol</option>
                            {roles.map(rol => (
                                <option key={rol} value={rol}>
                                    {rol === 'admin' ? 'Administrador' :
                                        rol === 'supervisor' ? 'Supervisor' : 'Usuario'}
                                </option>
                            ))}
                        </select>
                        {formErrors.rol && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.rol}</p>
                        )}
                    </div>

                    {/* Sede */}
                    <div>
                        <Label>
                            Sede <span className="text-red-500">*</span>
                        </Label>
                        <select
                            name="id_sede"
                            value={formData.id_sede}
                            onChange={onChange}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white/90"
                            required
                            disabled={userRol !== 'admin'}
                        >
                            <option value="">Seleccione una sede</option>
                            {sedesActivas.map(sede => (
                                <option key={sede.id_sede} value={sede.id_sede}>
                                    {sede.nombre_sede}
                                </option>
                            ))}
                        </select>
                        {formErrors.id_sede && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.id_sede}</p>
                        )}
                    </div>

                    {/* Información adicional */}
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
                                    {new Date(usuario.created_at).toLocaleDateString('es-CO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            {usuario.updated_at && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Última actualización</p>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">
                                        {new Date(usuario.updated_at).toLocaleDateString('es-CO', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Indicador de cambios */}
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
                            Actualizar Usuario
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}