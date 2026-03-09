import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CobradorDashboardCardProps {
    cobrador: {
        id_cobrador: number;
        nombre: string;
        apellidos: string;
        cedula: string;
        celular: string;
        activo: number;
        total_clientes: number;
        total_creditos: number;
        creditos_pendientes: number;
        monto_total_gestionado: number;
    };
    formatCurrency: (amount: number) => string;
}

export default function CobradorDashboardCard({ cobrador, formatCurrency }: CobradorDashboardCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/cobradores/${cobrador.id_cobrador}/creditos`)}
        >
            {/* Header con ID y Estado */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    #{cobrador.id_cobrador}
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cobrador.activo === 1
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                    {cobrador.activo === 1 ? 'Activo' : 'Inactivo'}
                </span>
            </div>

            {/* Información del cobrador */}
            <div className="space-y-3">
                {/* Nombre completo */}
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cobrador</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {cobrador.nombre} {cobrador.apellidos}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{cobrador.celular}</p>
                </div>

                {/* Cédula */}
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cédula</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                        {cobrador.cedula}
                    </p>
                </div>

                {/* Estadísticas en grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
                        <p className="text-xs text-blue-600 dark:text-blue-400">Clientes</p>
                        <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                            {cobrador.total_clientes}
                        </p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-2 text-center">
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">Créditos</p>
                        <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                            {cobrador.total_creditos}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 text-center">
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">Pendientes</p>
                        <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                            {cobrador.creditos_pendientes}
                        </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                        <p className="text-xs text-green-600 dark:text-green-400">Gestionado</p>
                        <p className="text-sm font-bold text-green-700 dark:text-green-300 truncate">
                            {formatCurrency(cobrador.monto_total_gestionado)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Botón de ver detalles */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/cobradores/${cobrador.id_cobrador}/creditos`);
                    }}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
                >
                    Ver detalles de créditos
                </button>
            </div>
        </div>
    );
}