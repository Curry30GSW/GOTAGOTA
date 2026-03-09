import React from 'react';
import { Credito } from '../../types/credito';

interface CreditoCardProps {
    credito: Credito;
    onVer: (credito: Credito) => void;
    onPagar?: (credito: Credito, e: React.MouseEvent) => void;
    formatCurrency: (amount: number | string) => string;
    formatDate: (dateString: string) => string;
    getEstadoStyles: (estado: string) => string;
    getEstadoLabel: (estado: string) => string;
}

export default function CreditoCard({
    credito,
    onVer,
    onPagar,
    formatCurrency,
    formatDate,
    getEstadoStyles,
    getEstadoLabel
}: CreditoCardProps) {
    const montoPrestado = typeof credito.monto_prestado === 'string'
        ? parseFloat(credito.monto_prestado)
        : credito.monto_prestado;

    const montoPorPagar = typeof credito.monto_por_pagar === 'string'
        ? parseFloat(credito.monto_por_pagar)
        : credito.monto_por_pagar;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow">
            {/* Header con ID y Estado */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    #{credito.id_credito}
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoStyles(credito.estado)}`}>
                    {getEstadoLabel(credito.estado)}
                </span>
            </div>

            {/* Información del cliente */}
            <div className="space-y-3">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cliente</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {credito.cliente_nombre} {credito.cliente_apellidos}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        C.C. {credito.cedula}
                    </p>
                </div>

                {/* Cobrador */}
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cobrador</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                        {credito.cobrador_nombre} {credito.cobrador_apellidos}
                    </p>
                </div>

                {/* Montos */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Monto prestado</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(montoPrestado)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total a pagar</p>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {formatCurrency(montoPorPagar)}
                        </p>
                    </div>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Fecha crédito</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                            {formatDate(credito.fecha_credito)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Fecha pago</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                            {formatDate(credito.fecha_pago)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={() => onVer(credito)}
                    className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                    title="Ver detalles"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7 -1.274 4.057-5.065 7-9.542 7 -4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>

                {credito.estado === 'pendiente' && onPagar && (
                    <button
                        onClick={(e) => onPagar(credito, e)}
                        className="p-2 rounded-lg border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 dark:border-green-600 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 transition-colors"
                        title="Pagar crédito"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}