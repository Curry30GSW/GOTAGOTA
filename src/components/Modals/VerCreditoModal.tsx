import React from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { Credito } from '../../types/credito';

interface VerCreditoModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCredito: Credito | null;
    nombreCliente?: string;
    nombreCobrador?: string;
}

export default function VerCreditoModal({
    isOpen,
    onClose,
    selectedCredito,
    nombreCliente,
    nombreCobrador
}: VerCreditoModalProps) {
    if (!selectedCredito) return null;

    const formatCurrency = (amount: number | string) => {
        const valor = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hour}:${minute}`;
    };

    const getEstadoStyles = (estado: string) => {
        const styles = {
            pendiente: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
            pagado: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
            castigado: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
            juridico: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
        };
        return styles[estado as keyof typeof styles] || styles.pendiente;
    };

    // SVG Icons
    const CreditIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    );

    const UserIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

    const HashtagIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
    );

    const BriefcaseIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );

    const StatusIcon = ({ estado }: { estado: string }) => {
        const getIcon = () => {
            switch (estado) {
                case 'pagado':
                    return (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    );
                case 'pendiente':
                    return (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    );
                default:
                    return (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    );
            }
        };

        return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {getIcon()}
            </svg>
        );
    };

    const montoPrestado = typeof selectedCredito.monto_prestado === 'string'
        ? parseFloat(selectedCredito.monto_prestado)
        : selectedCredito.monto_prestado;

    const montoPorPagar = typeof selectedCredito.monto_por_pagar === 'string'
        ? parseFloat(selectedCredito.monto_por_pagar)
        : selectedCredito.monto_por_pagar;

    const intereses = montoPorPagar - montoPrestado;
    const porcentajeInteres = ((intereses / montoPrestado) * 100).toFixed(2);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="relative">
                {/* Header con botón de cierre */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                            <CreditIcon />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Detalles del Crédito
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Información completa del crédito #{selectedCredito.id_credito}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tarjeta de información principal */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="p-4 bg-white dark:bg-gray-700 rounded-full shadow-lg">
                            <CreditIcon />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                Crédito #{selectedCredito.id_credito}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <UserIcon />
                                    {nombreCliente || `Cliente ID: ${selectedCredito.id_cliente}`}
                                </span>
                                <span className="flex items-center gap-1">
                                    <BriefcaseIcon />
                                    {nombreCobrador || `Cobrador ID: ${selectedCredito.id_cobrador}`}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getEstadoStyles(selectedCredito.estado)}`}>
                                <StatusIcon estado={selectedCredito.estado} />
                                {selectedCredito.estado.charAt(0).toUpperCase() + selectedCredito.estado.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Grid de información detallada */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Columna izquierda - Montos */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                                <MoneyIcon /> Detalles del Monto
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                        <MoneyIcon />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Monto prestado</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(montoPrestado)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                                        <MoneyIcon />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Intereses ({porcentajeInteres}%)</p>
                                        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                            + {formatCurrency(intereses)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                        <MoneyIcon />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Total a pagar</p>
                                        <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                            {formatCurrency(montoPorPagar)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha - Cuotas y Fechas */}
                    <div className="space-y-4">

                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                                <CalendarIcon /> Fechas
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                        <CalendarIcon />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Fecha del crédito</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDate(selectedCredito.fecha_credito)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                                        <CalendarIcon />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Fecha de pago</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDate(selectedCredito.fecha_pago)}
                                        </p>
                                    </div>
                                </div>
                                {selectedCredito.created_at && (
                                    <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <CalendarIcon />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Fecha de registro</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatDateTime(selectedCredito.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button type="button" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}