import React from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { Credito } from '../../types/credito';

interface ConfirmPagoModalProps {
    isOpen: boolean;
    onClose: () => void;
    credito: Credito | null;
    onConfirm: () => void;
    isPaying: boolean;
    formatCurrency: (amount: number | string) => string;
}

export default function ConfirmPagoModal({
    isOpen,
    onClose,
    credito,
    onConfirm,
    isPaying,
    formatCurrency
}: ConfirmPagoModalProps) {
    if (!credito) return null;

    const montoPorPagar = typeof credito.monto_por_pagar === 'string'
        ? parseFloat(credito.monto_por_pagar)
        : credito.monto_por_pagar;

    const nombreCliente = credito.cliente_nombre && credito.cliente_apellidos
        ? `${credito.cliente_nombre} ${credito.cliente_apellidos}`
        : `Cliente ID: ${credito.id_cliente}`;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-full dark:bg-green-900/20">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Confirmar Pago
                    </h3>
                </div>

                {/* Información del crédito */}
                <div className="mb-6 space-y-3">
                    <p className="text-gray-600 dark:text-gray-400">
                        ¿Estás seguro de que deseas marcar este crédito como pagado?
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Crédito #:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{credito.id_credito}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Cliente:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{nombreCliente}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Monto a pagar:</span>
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(montoPorPagar)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        onClick={onClose}
                        disabled={isPaying}
                        className="bg-gray-500 hover:bg-gray-600"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isPaying}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isPaying ? 'Procesando...' : 'Confirmar Pago'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}