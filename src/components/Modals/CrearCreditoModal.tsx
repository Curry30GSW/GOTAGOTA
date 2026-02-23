import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { InputGroup } from '../form/group-input';
import { CreditoFormData } from '../../types/credito';
import { formatMonto, parseMonto } from '../../utils/formatters'

interface CrearCreditoModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: CreditoFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    formErrors?: Partial<CreditoFormData>;
    clientes?: { id_cliente: number; nombre: string; apellidos: string; cedula: string; id_cobrador: number }[]; // Opcional
    cobradores?: { id_cobrador: number; nombre: string; apellidos: string }[]; // Opcional
    tasaInteres?: number;
}

export default function CrearCreditoModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onSelectChange,
    onSubmit,
    formErrors = {},
    clientes = [], // Valor por defecto
    cobradores = [], // Valor por defecto
    tasaInteres = 30
}: CrearCreditoModalProps) {
    const [busquedaCliente, setBusquedaCliente] = useState('');
    const [busquedaCobrador, setBusquedaCobrador] = useState('');
    const [mostrarDropdownCliente, setMostrarDropdownCliente] = useState(false);
    const [mostrarDropdownCobrador, setMostrarDropdownCobrador] = useState(false);
    const [loading, setLoading] = useState(false);
    const [valorCuota, setValorCuota] = useState(0);
    const [totalPagar, setTotalPagar] = useState(0);
    const [fechaPago, setFechaPago] = useState('');
    const [montoFormateado, setMontoFormateado] = useState('');

    // Resetear búsquedas cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setBusquedaCliente('');
            setBusquedaCobrador('');
            setValorCuota(0);
            setTotalPagar(0);
            setFechaPago('');
        }
    }, [isOpen]);

    // Calcular montos y fecha de pago
    useEffect(() => {
        if (formData.monto_prestado > 0 && formData.numero_cuotas > 0) {
            const monto = formData.monto_prestado;
            const cuotas = formData.numero_cuotas;

            const interesTotal = monto * (tasaInteres / 100) * cuotas;
            const totalConInteres = monto + interesTotal;
            const valorCuotaCalculado = totalConInteres / cuotas;

            setTotalPagar(totalConInteres);
            setValorCuota(valorCuotaCalculado);
        }

        // Calcular fecha de pago (1 mes después)
        if (formData.fecha_credito) {
            const fecha = new Date(formData.fecha_credito);
            fecha.setMonth(fecha.getMonth() + 1);
            setFechaPago(fecha.toISOString().split('T')[0]);
        }
    }, [formData.monto_prestado, formData.numero_cuotas, formData.fecha_credito, tasaInteres]);

    // Filtrar clientes (con validación)
    const clientesFiltrados = useMemo(() => {
        if (!clientes || clientes.length === 0) return [];
        if (!busquedaCliente) return clientes;

        const busquedaLower = busquedaCliente.toLowerCase();
        return clientes.filter(c =>
            c.nombre.toLowerCase().includes(busquedaLower) ||
            c.apellidos.toLowerCase().includes(busquedaLower) ||
            c.cedula.includes(busquedaCliente)
        );
    }, [clientes, busquedaCliente]);

    // Filtrar cobradores (con validación)
    const cobradoresFiltrados = useMemo(() => {
        if (!cobradores || cobradores.length === 0) return [];
        if (!busquedaCobrador) return cobradores;

        const busquedaLower = busquedaCobrador.toLowerCase();
        return cobradores.filter(c =>
            c.nombre.toLowerCase().includes(busquedaLower) ||
            c.apellidos.toLowerCase().includes(busquedaLower)
        );
    }, [cobradores, busquedaCobrador]);

    // Cliente seleccionado (con validación)
    const clienteSeleccionado = useMemo(() => {
        if (!clientes || clientes.length === 0 || !formData.id_cliente) return undefined;
        return clientes.find(c => c.id_cliente === formData.id_cliente);
    }, [clientes, formData.id_cliente]);

    // Cobrador seleccionado (con validación)
    const cobradorSeleccionado = useMemo(() => {
        if (!cobradores || cobradores.length === 0 || !formData.id_cobrador) return undefined;
        return cobradores.find(c => c.id_cobrador === formData.id_cobrador);
    }, [cobradores, formData.id_cobrador]);

    // Actualizar búsqueda del cliente
    useEffect(() => {
        if (clienteSeleccionado) {
            setBusquedaCliente(`${clienteSeleccionado.nombre} ${clienteSeleccionado.apellidos} - ${clienteSeleccionado.cedula}`);
            // Auto-asignar el cobrador del cliente
            if (clienteSeleccionado.id_cobrador && !formData.id_cobrador) {
                onSelectChange({
                    target: {
                        name: 'id_cobrador',
                        value: clienteSeleccionado.id_cobrador.toString()
                    }
                } as any);
            }
        }
    }, [clienteSeleccionado]);

    useEffect(() => {
        if (formData.monto_prestado) {
            setMontoFormateado(formatMonto(formData.monto_prestado.toString()));
        } else {
            setMontoFormateado('');
        }
    }, [formData.monto_prestado]);

    const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;

        // Extraer solo números del valor ingresado
        const soloNumeros = rawValue.replace(/\D/g, '');

        if (soloNumeros) {
            // Actualizar el formData con el número sin formato
            const montoNumerico = parseInt(soloNumeros);

            // Crear un evento simulado para onChange
            const simulatedEvent = {
                target: {
                    name: 'monto_prestado',
                    value: montoNumerico
                }
            } as React.ChangeEvent<HTMLInputElement>;

            onChange(simulatedEvent);
        } else {
            // Si no hay números, establecer a 0
            const simulatedEvent = {
                target: {
                    name: 'monto_prestado',
                    value: 0
                }
            } as React.ChangeEvent<HTMLInputElement>;

            onChange(simulatedEvent);
        }
    };

    // Actualizar búsqueda del cobrador
    useEffect(() => {
        if (cobradorSeleccionado) {
            setBusquedaCobrador(`${cobradorSeleccionado.nombre} ${cobradorSeleccionado.apellidos}`);
        }
    }, [cobradorSeleccionado]);

    const handleSelectCliente = (cliente: typeof clientes[0]) => {
        onSelectChange({
            target: {
                name: 'id_cliente',
                value: cliente.id_cliente.toString()
            }
        } as any);
        setBusquedaCliente(`${cliente.nombre} ${cliente.apellidos} - ${cliente.cedula}`);
        setMostrarDropdownCliente(false);
    };

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
        e.preventDefault();

        // Validar que todos los campos requeridos estén llenos
        if (!formData.id_cliente || !formData.id_cobrador || !formData.monto_prestado || !formData.numero_cuotas || !formData.fecha_credito) {
            return;
        }

        setLoading(true);
        await onSubmit(e);
        setLoading(false);
    };

    const handleClose = () => {
        setBusquedaCliente('');
        setBusquedaCobrador('');
        setMostrarDropdownCliente(false);
        setMostrarDropdownCobrador(false);
        onClose();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // SVG Icons
    const UserIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );

    const BriefcaseIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );

    const SearchIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );

    const MoneyIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const CalendarIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );

    const AlertIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    );

    const CloseIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );

    const SpinnerIcon = () => (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Nuevo Crédito - Gota a Gota
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Registre un nuevo crédito para un cliente
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Cliente - Combobox con búsqueda */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">
                            Cliente <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800">
                                <UserIcon />
                            </span>
                            <input
                                type="text"
                                value={busquedaCliente}
                                onChange={(e) => {
                                    setBusquedaCliente(e.target.value);
                                    setMostrarDropdownCliente(true);
                                    if (formData.id_cliente) {
                                        onSelectChange({
                                            target: {
                                                name: 'id_cliente',
                                                value: '0'
                                            }
                                        } as any);
                                    }
                                }}
                                onFocus={() => setMostrarDropdownCliente(true)}
                                onBlur={() => {
                                    setTimeout(() => setMostrarDropdownCliente(false), 200);
                                }}
                                placeholder="Escriba para buscar un cliente..."
                                className="w-full pl-[62px] pr-10 py-2.5 border border-gray-300 rounded-lg 
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <SearchIcon />
                            </span>
                        </div>

                        {/* Dropdown de clientes */}
                        {mostrarDropdownCliente && clientesFiltrados.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {clientesFiltrados.map(cliente => (
                                    <div
                                        key={cliente.id_cliente}
                                        className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                                        onClick={() => handleSelectCliente(cliente)}
                                    >
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {cliente.nombre} {cliente.apellidos}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            📄 C.C. {cliente.cedula}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {mostrarDropdownCliente && clientesFiltrados.length === 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 text-center text-gray-500">
                                No se encontraron clientes
                            </div>
                        )}

                        {formErrors.id_cliente && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.id_cliente}</p>
                        )}
                    </div>

                    {/* Cobrador - Combobox con búsqueda */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">
                            Cobrador <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800">
                                <BriefcaseIcon />
                            </span>
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
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <SearchIcon />
                            </span>
                        </div>

                        {/* Dropdown de cobradores */}
                        {mostrarDropdownCobrador && cobradoresFiltrados.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {cobradoresFiltrados.map(cobrador => (
                                    <div
                                        key={cobrador.id_cobrador}
                                        className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                                        onClick={() => handleSelectCobrador(cobrador)}
                                    >
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {cobrador.nombre} {cobrador.apellidos}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {mostrarDropdownCobrador && cobradoresFiltrados.length === 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 text-center text-gray-500">
                                No se encontraron cobradores
                            </div>
                        )}

                        {formErrors.id_cobrador && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.id_cobrador}</p>
                        )}
                    </div>

                    {/* Grid de campos del crédito */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">
                                Monto del Préstamo <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800">
                                    <MoneyIcon />
                                </span>
                                <input
                                    type="text"
                                    value={montoFormateado}
                                    onChange={handleMontoChange}
                                    placeholder="$ 0"
                                    className={`w-full pl-[62px] pr-4 py-2.5 border rounded-lg 
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        dark:bg-gray-800 dark:text-white
                                        ${formErrors.monto_prestado
                                            ? 'border-red-500'
                                            : 'border-gray-300 dark:border-gray-700'
                                        }`}
                                />
                            </div>
                            {formErrors.monto_prestado && (
                                <p className="mt-1 text-sm text-red-500">{formErrors.monto_prestado}</p>
                            )}
                        </div>


                        <InputGroup
                            label="Número de Cuotas"
                            name="numero_cuotas"
                            type="number"
                            value={formData.numero_cuotas.toString()}
                            onChange={onChange}
                            required
                            placeholder="1"
                            min="1"
                            max="60"
                            error={formErrors.numero_cuotas}
                        />

                        <InputGroup
                            label="Fecha del Crédito"
                            name="fecha_credito"
                            type="date"
                            value={formData.fecha_credito}
                            onChange={onChange}
                            required
                            error={formErrors.fecha_credito}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1.5">
                                Tasa de Interés Mensual
                            </label>
                            <div className="relative">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800">
                                    <AlertIcon />
                                </span>
                                <input
                                    type="text"
                                    value={`${tasaInteres}%`}
                                    disabled
                                    className="w-full pl-[62px] pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg 
                                             dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Tasa fija del sistema</p>
                        </div>
                    </div>

                    {/* Vista previa del cálculo */}
                    {formData.monto_prestado > 0 && formData.numero_cuotas > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl p-5">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-1">
                                <MoneyIcon /> Resumen del Crédito
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monto solicitado</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(formData.monto_prestado)}
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total a pagar</p>
                                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                        {formatCurrency(totalPagar)}
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                        +{formatCurrency(totalPagar - formData.monto_prestado)} intereses
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Valor por cuota</p>
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(valorCuota)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formData.numero_cuotas} cuota(s)
                                    </p>
                                </div>
                            </div>

                            {/* Fecha de pago */}
                            {fechaPago && (
                                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                        <CalendarIcon />
                                        Fecha de pago: <span className="font-semibold">{formatDate(fechaPago)}</span>
                                    </p>
                                </div>
                            )}

                            {/* Advertencia */}
                            {formData.monto_prestado > 10000000 && (
                                <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                    <p className="text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                                        <AlertIcon />
                                        Monto alto. Asegúrese de verificar la capacidad de pago del cliente.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Botones */}
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
                            disabled={loading || !clienteSeleccionado || !cobradorSeleccionado}
                            className="inline-flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <SpinnerIcon />
                                    Creando...
                                </>
                            ) : (
                                'Crear Crédito'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}