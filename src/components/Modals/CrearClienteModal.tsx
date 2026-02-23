import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { InputGroup } from '../form/group-input';
import { ClienteFormData } from '../../types/cliente';
import { UserIcon } from '../../icons';

interface CrearClienteModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: ClienteFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    formErrors?: Partial<ClienteFormData>;
    cobradores: { id_cobrador: number; nombre: string; apellidos: string; celular?: string }[];
}

export default function CrearClienteModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onSelectChange,
    onSubmit,
    formErrors = {},
    cobradores
}: CrearClienteModalProps) {
    const [busquedaCobrador, setBusquedaCobrador] = useState('');
    const [mostrarDropdownCobrador, setMostrarDropdownCobrador] = useState(false);
    const [loading, setLoading] = useState(false);

    // Resetear búsqueda cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setBusquedaCobrador('');
        }
    }, [isOpen]);

    // Filtrar cobradores por búsqueda
    const cobradoresFiltrados = useMemo(() => {
        if (!busquedaCobrador) return cobradores;

        const busquedaLower = busquedaCobrador.toLowerCase();
        return cobradores.filter(c =>
            c.nombre.toLowerCase().includes(busquedaLower) ||
            c.apellidos.toLowerCase().includes(busquedaLower) ||
            (c.celular && c.celular.includes(busquedaCobrador))
        );
    }, [cobradores, busquedaCobrador]);

    // Obtener nombre del cobrador seleccionado
    const cobradorSeleccionado = cobradores.find(c => c.id_cobrador === formData.id_cobrador);

    // Actualizar búsqueda cuando se selecciona un cobrador
    useEffect(() => {
        if (cobradorSeleccionado) {
            setBusquedaCobrador(`${cobradorSeleccionado.nombre} ${cobradorSeleccionado.apellidos}`);
        }
    }, [cobradorSeleccionado]);

    const handleSelectCobrador = (cobrador: typeof cobradores[0]) => {
        onSelectChange({
            target: {
                name: 'id_cobrador',
                value: cobrador.id_cobrador.toString()
            }
        } as any);
        setBusquedaCobrador(`${cobrador.nombre} ${cobrador.apellidos}`);
        setMostrarDropdownCobrador(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        await onSubmit(e);
        setLoading(false);
    };

    const handleClose = () => {
        setBusquedaCobrador('');
        setMostrarDropdownCobrador(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Nuevo Cliente
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Registre un nuevo cliente en el sistema Gota a Gota
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div>
                            <InputGroup
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={onChange}
                                required
                                placeholder="Ej: Juan Carlos"
                                error={formErrors.nombre}
                                icon={<UserIcon className="w-5 h-5" />}
                            />
                        </div>

                        {/* Apellidos */}
                        <div>
                            <InputGroup
                                label="Apellidos"
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={onChange}
                                required
                                placeholder="Ej: Rodríguez Pérez"
                                error={formErrors.apellidos}
                                icon={<UserIcon className="w-5 h-5" />}
                            />
                        </div>

                        {/* Cédula */}
                        <div>
                            <InputGroup
                                label="Cédula"
                                name="cedula"
                                value={formData.cedula}
                                onChange={onChange}
                                required
                                type="text"
                                placeholder="Ej: 1234567890"
                                error={formErrors.cedula}
                            />
                        </div>

                        {/* Celular */}
                        <div>
                            <InputGroup
                                label="Celular"
                                name="celular"
                                value={formData.celular}
                                onChange={onChange}
                                required
                                type="tel"
                                placeholder="Ej: 3001234567"
                                error={formErrors.celular}
                            />
                        </div>

                        {/* Dirección (ocupa ambas columnas) */}
                        <div className="md:col-span-2">
                            <InputGroup
                                label="Dirección"
                                name="direccion"
                                value={formData.direccion}
                                onChange={onChange}
                                placeholder="Ej: Calle 123 #45-67, Barrio Centro"
                            />
                        </div>
                    </div>

                    {/* 🔥 Cobrador Asignado - Combobox con búsqueda */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">
                            Cobrador Asignado <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={busquedaCobrador}
                                onChange={(e) => {
                                    setBusquedaCobrador(e.target.value);
                                    setMostrarDropdownCobrador(true);
                                    if (formData.id_cobrador) {
                                        onSelectChange({
                                            target: {
                                                name: 'id_cobrador',
                                                value: '0'
                                            }
                                        } as any);
                                    }
                                }}
                                onFocus={() => setMostrarDropdownCobrador(true)}
                                onBlur={() => {
                                    setTimeout(() => setMostrarDropdownCobrador(false), 200);
                                }}
                                placeholder="Escriba para buscar un cobrador..."
                                className="w-full pl-[62px] pr-10 py-2.5 border border-gray-300 rounded-lg 
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Dropdown de cobradores */}
                        {mostrarDropdownCobrador && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {cobradoresFiltrados.length > 0 ? (
                                    cobradoresFiltrados.map(cobrador => (
                                        <div
                                            key={cobrador.id_cobrador}
                                            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                                            onClick={() => handleSelectCobrador(cobrador)}
                                        >
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {cobrador.nombre} {cobrador.apellidos}
                                            </div>
                                            {cobrador.celular && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    📱 {cobrador.celular}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                        No se encontraron cobradores
                                    </div>
                                )}
                            </div>
                        )}

                        {formErrors.id_cobrador && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.id_cobrador}</p>
                        )}
                    </div>

                    {/* Resumen de información */}
                    {formData.nombre && formData.apellidos && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                                📋 Resumen del Cliente
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-blue-600 dark:text-blue-400">Nombre completo:</span>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {formData.nombre} {formData.apellidos}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-blue-600 dark:text-blue-400">Cédula:</span>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {formData.cedula || 'Pendiente'}
                                    </p>
                                </div>
                                {cobradorSeleccionado && (
                                    <div className="col-span-2">
                                        <span className="text-blue-600 dark:text-blue-400">Cobrador asignado:</span>
                                        <p className="font-medium text-gray-800 dark:text-white">
                                            {cobradorSeleccionado.nombre} {cobradorSeleccionado.apellidos}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creando...
                                </>
                            ) : (
                                'Crear Cliente'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}