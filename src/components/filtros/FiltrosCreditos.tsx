import React, { useState } from 'react';
import { FiltrosCreditoState } from '../../types/credito';

interface FiltrosCreditosProps {
    filtros: FiltrosCreditoState;
    totalCreditos: number;
    clientes: { id_cliente: number; nombre: string; apellidos: string; cedula: string }[];
    onCambiarFiltro: <K extends keyof FiltrosCreditoState>(campo: K, valor: FiltrosCreditoState[K]) => void;
    onLimpiarFiltros: () => void;
}

const FiltrosCreditos: React.FC<FiltrosCreditosProps> = ({
    filtros,
    totalCreditos,
    clientes,
    onCambiarFiltro,
    onLimpiarFiltros
}) => {
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    // Contar filtros activos (corregido)
    const filtrosActivos = [
        filtros.search,
        filtros.estado !== 'todos',
        filtros.id_cliente !== 'todos',
        filtros.fechaInicio,
        filtros.fechaFin,
        filtros.montoMinimo,
        filtros.montoMaximo,
        filtros.ordenMonto !== '',
        filtros.filtroRapido !== 'todos'
    ].filter(Boolean).length;

    // Opciones de estado para créditos
    const estadosCredito = [
        { value: 'todos', label: 'Todos los estados' },
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'pagado', label: 'Pagado' },
        { value: 'castigado', label: 'Castigado' },
        { value: 'juridico', label: 'Jurídico' }
    ];

    // Filtros rápidos
    const filtrosRapidos = [
        { id: 'todos', label: 'Todos' },
        { id: 'recientes', label: 'Más Recientes' },
        { id: 'antiguos', label: 'Más Antiguos' },
        { id: 'mayor_monto', label: 'Mayor Monto' },
        { id: 'menor_monto', label: 'Menor Monto' },
        { id: 'pendientes', label: 'Solo Pendientes' }
    ] as const;

    return (
        <div className="space-y-4">
            {/* Barra superior con búsqueda y botón de filtros */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Buscador */}
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        value={filtros.search}
                        onChange={(e) => onCambiarFiltro('search', e.target.value)}
                        placeholder="Buscar por cliente o cédula..."
                        className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
                    />
                </div>

                {/* Botón de filtros */}
                <button
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    className={`
                        inline-flex items-center gap-2
                        rounded-lg border px-3.5 py-2.5
                        text-sm font-medium
                        shadow-theme-xs
                        transition-colors
                        ${mostrarFiltros
                            ? 'border-blue-600 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40'
                            : 'border-amber-600 bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-800 dark:border-amber-500 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40'
                        }
                    `}
                >
                    {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                    {filtrosActivos > 0 && (
                        <span className="ml-1 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {filtrosActivos}
                        </span>
                    )}
                </button>
            </div>

            {/* Contenedor de filtros avanzados */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all ${!mostrarFiltros && 'hidden'}`}>
                {/* Filtros Rápidos */}
                <div className="lg:col-span-3">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Filtros Rápidos
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {filtrosRapidos.map(fr => (
                                <button
                                    key={fr.id}
                                    onClick={() => onCambiarFiltro('filtroRapido', fr.id)}
                                    className={`
                                        px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                        ${filtros.filtroRapido === fr.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }
                                    `}
                                >
                                    {fr.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filtro de Estado */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Estado del Crédito
                    </label>
                    <select
                        value={filtros.estado}
                        onChange={(e) => onCambiarFiltro('estado', e.target.value as FiltrosCreditoState['estado'])}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                    >
                        {estadosCredito.map(estado => (
                            <option key={estado.value} value={estado.value}>
                                {estado.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro por Cliente */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Cliente
                    </label>
                    <select
                        value={filtros.id_cliente}
                        onChange={(e) => {
                            const value = e.target.value;
                            onCambiarFiltro('id_cliente', value === 'todos' ? 'todos' : Number(value));
                        }}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                    >
                        <option value="todos">Todos los clientes</option>
                        {clientes.map(c => (
                            <option key={c.id_cliente} value={c.id_cliente}>
                                {c.nombre} {c.apellidos} - {c.cedula}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rango de Montos */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Monto Mínimo
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={filtros.montoMinimo}
                            onChange={(e) => onCambiarFiltro('montoMinimo', e.target.value)}
                            placeholder="0"
                            min="0"
                            className="w-full rounded-lg border border-gray-300 bg-transparent pl-8 pr-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Monto Máximo
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={filtros.montoMaximo}
                            onChange={(e) => onCambiarFiltro('montoMaximo', e.target.value)}
                            placeholder="999999999"
                            min="0"
                            className="w-full rounded-lg border border-gray-300 bg-transparent pl-8 pr-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                        />
                    </div>
                </div>

                {/* Rango de Fechas */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Fecha Desde
                    </label>
                    <input
                        type="date"
                        value={filtros.fechaInicio}
                        onChange={(e) => onCambiarFiltro('fechaInicio', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Fecha Hasta
                    </label>
                    <input
                        type="date"
                        value={filtros.fechaFin}
                        onChange={(e) => onCambiarFiltro('fechaFin', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                    />
                </div>

                {/* Ordenamiento */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Ordenar por Fecha
                    </label>
                    <select
                        value={filtros.ordenFecha}
                        onChange={(e) => onCambiarFiltro('ordenFecha', e.target.value as 'asc' | 'desc')}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                    >
                        <option value="desc">Más recientes primero</option>
                        <option value="asc">Más antiguos primero</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Ordenar por Monto
                    </label>
                    <select
                        value={filtros.ordenMonto}
                        onChange={(e) => onCambiarFiltro('ordenMonto', e.target.value as '' | 'asc' | 'desc')}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                    >
                        <option value="">Sin orden</option>
                        <option value="asc">Menor a Mayor</option>
                        <option value="desc">Mayor a Menor</option>
                    </select>
                </div>

                {/* Resumen y botón limpiar */}
                <div className="lg:col-span-3">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-semibold text-gray-900 dark:text-white">{totalCreditos}</span> créditos encontrados
                                </p>
                                {filtrosActivos > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {filtros.estado !== 'todos' && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                Estado: {filtros.estado}
                                            </span>
                                        )}
                                        {filtros.id_cliente !== 'todos' && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                Cliente específico
                                            </span>
                                        )}
                                        {(filtros.fechaInicio || filtros.fechaFin) && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                Rango de fechas
                                            </span>
                                        )}
                                        {(filtros.montoMinimo || filtros.montoMaximo) && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                Rango de montos
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={onLimpiarFiltros}
                                className="
                                    inline-flex items-center gap-2
                                    rounded-lg border border-red-500
                                    bg-red-50 px-4 py-2
                                    text-sm font-medium text-red-700
                                    shadow-theme-xs
                                    hover:bg-red-100 hover:text-red-800
                                    dark:border-red-600 dark:bg-red-900/20
                                    dark:text-red-400 dark:hover:bg-red-900/40
                                    dark:hover:text-red-300
                                    transition-colors
                                "
                            >
                                Limpiar Todos los Filtros
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FiltrosCreditos;