import React, { useState } from 'react';
import { FiltrosClienteState } from '../../types/cliente';


interface FiltrosClientesProps {
    filtros: FiltrosClienteState;
    totalClientes: number;
    cobradores: { id_cobrador: number; nombre: string; apellidos: string }[];
    onCambiarFiltro: (campo: keyof FiltrosClienteState, valor: unknown) => void;
    onLimpiarFiltros: () => void;
}

const FiltrosClientes: React.FC<FiltrosClientesProps> = ({
    filtros,
    totalClientes,
    cobradores,
    onCambiarFiltro,
    onLimpiarFiltros
}) => {
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    // Contar filtros activos
    const filtrosActivos = [
        filtros.search,
        filtros.estado !== 'todos',
        filtros.id_cobrador !== 'todos',
        filtros.fechaRegistroInicio,
        filtros.fechaRegistroFin,
        filtros.ordenNombre !== '',
        filtros.ordenCedula !== '',
        filtros.filtroRapido !== 'todos'
    ].filter(Boolean).length;

    return (
        <div className="space-y-4">
            {/* Barra superior con búsqueda y botón de filtros */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Buscador */}
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    </div>
                    <input
                        type="text"
                        value={filtros.search}
                        onChange={(e) => onCambiarFiltro('search', e.target.value)}
                        placeholder="Buscar por nombre, apellidos o cédula..."
                        className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
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
                {/* Filtro rápido - Preselecciones comunes */}
                <div className="lg:col-span-3">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Filtros Rápidos
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => onCambiarFiltro('filtroRapido', 'todos')}
                                className={`
                                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                    ${filtros.filtroRapido === 'todos'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => {
                                    onCambiarFiltro('filtroRapido', 'recientes');
                                    onCambiarFiltro('ordenFecha', 'desc');
                                }}
                                className={`
                                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                    ${filtros.filtroRapido === 'recientes'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                Más Recientes
                            </button>
                            <button
                                onClick={() => {
                                    onCambiarFiltro('filtroRapido', 'antiguos');
                                    onCambiarFiltro('ordenFecha', 'asc');
                                }}
                                className={`
                                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                    ${filtros.filtroRapido === 'antiguos'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                Más Antiguos
                            </button>
                            <button
                                onClick={() => onCambiarFiltro('filtroRapido', 'sin_direccion')}
                                className={`
                                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                    ${filtros.filtroRapido === 'sin_direccion'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                Sin Dirección
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtro de Estado */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Estado
                    </label>
                    <select
                        value={filtros.estado}
                        onChange={(e) => onCambiarFiltro('estado', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="activos">Solo Activos</option>
                        <option value="inactivos">Solo Inactivos</option>
                    </select>
                </div>

                {/* Filtro por Cobrador */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Cobrador
                    </label>
                    <select
                        value={filtros.id_cobrador}
                        onChange={(e) => onCambiarFiltro('id_cobrador', e.target.value === 'todos' ? 'todos' : Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                    >
                        <option value="todos">Todos los cobradores</option>
                        {cobradores.map(c => (
                            <option key={c.id_cobrador} value={c.id_cobrador}>
                                {c.nombre} {c.apellidos}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro de Fechas - Rango */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Fecha Registro Desde
                    </label>
                    <input
                        type="date"
                        value={filtros.fechaRegistroInicio}
                        onChange={(e) => onCambiarFiltro('fechaRegistroInicio', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Fecha Registro Hasta
                    </label>
                    <input
                        type="date"
                        value={filtros.fechaRegistroFin}
                        onChange={(e) => onCambiarFiltro('fechaRegistroFin', e.target.value)}
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
                        onChange={(e) => onCambiarFiltro('ordenFecha', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                    >
                        <option value="desc">Más recientes primero</option>
                        <option value="asc">Más antiguos primero</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Ordenar por Nombre
                    </label>
                    <select
                        value={filtros.ordenNombre}
                        onChange={(e) => onCambiarFiltro('ordenNombre', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300/10 dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-blue-800"
                    >
                        <option value="">Sin orden</option>
                        <option value="asc">A - Z</option>
                        <option value="desc">Z - A</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Ordenar por Cédula
                    </label>
                    <select
                        value={filtros.ordenCedula}
                        onChange={(e) => onCambiarFiltro('ordenCedula', e.target.value)}
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
                                    <span className="font-semibold text-gray-900 dark:text-white">{totalClientes}</span> clientes encontrados
                                </p>
                                {filtrosActivos > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {filtros.estado !== 'todos' && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                Estado: {filtros.estado === 'activos' ? 'Activos' : 'Inactivos'}
                                            </span>
                                        )}
                                        {filtros.id_cobrador !== 'todos' && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                Cobrador específico
                                            </span>
                                        )}
                                        {(filtros.fechaRegistroInicio || filtros.fechaRegistroFin) && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                Rango de fechas
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

export default FiltrosClientes;