import React from 'react';
import { FiltrosUsuarioState } from '../../types/usuario';

interface Props {
    filtros: FiltrosUsuarioState;
    totalUsuarios: number;
    onCambiarFiltro: (campo: keyof FiltrosUsuarioState, valor: any) => void;
    onLimpiarFiltros: () => void;
}

export default function FiltrosUsuarios({
    filtros,
    totalUsuarios,
    onCambiarFiltro,
    onLimpiarFiltros
}: Props) {
    const roles = ['admin', 'usuario', 'supervisor'];

    return (
        <div className="space-y-4">
            {/* Barra de búsqueda y contador */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={filtros.search}
                        onChange={(e) => onCambiarFiltro('search', e.target.value)}
                        placeholder="Buscar por nombre o usuario..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white/90"
                    />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total: <span className="font-semibold text-gray-700 dark:text-gray-300">{totalUsuarios}</span> usuarios
                </div>
            </div>

            {/* Filtros rápidos */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onCambiarFiltro('filtroRapido', 'todos')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filtros.filtroRapido === 'todos'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                >
                    Todos
                </button>
                <button
                    onClick={() => onCambiarFiltro('filtroRapido', 'activos')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filtros.filtroRapido === 'activos'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                >
                    Activos
                </button>
                <button
                    onClick={() => onCambiarFiltro('filtroRapido', 'inactivos')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filtros.filtroRapido === 'inactivos'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                >
                    Inactivos
                </button>
                <button
                    onClick={() => onCambiarFiltro('filtroRapido', 'recientes')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filtros.filtroRapido === 'recientes'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                >
                    Más recientes
                </button>
            </div>

            {/* Filtros avanzados */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Filtro por rol */}
                <div>
                    <label className="block mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                        Rol
                    </label>
                    <select
                        value={filtros.rol}
                        onChange={(e) => onCambiarFiltro('rol', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white/90"
                    >
                        <option value="">Todos los roles</option>
                        {roles.map(rol => (
                            <option key={rol} value={rol}>{rol}</option>
                        ))}
                    </select>
                </div>

                {/* Ordenar por nombre */}
                <div>
                    <label className="block mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                        Ordenar por nombre
                    </label>
                    <select
                        value={filtros.ordenNombre}
                        onChange={(e) => onCambiarFiltro('ordenNombre', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white/90"
                    >
                        <option value="">Sin orden</option>
                        <option value="asc">A - Z</option>
                        <option value="desc">Z - A</option>
                    </select>
                </div>

                {/* Ordenar por usuario */}
                <div>
                    <label className="block mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                        Ordenar por usuario
                    </label>
                    <select
                        value={filtros.ordenUsuario}
                        onChange={(e) => onCambiarFiltro('ordenUsuario', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white/90"
                    >
                        <option value="">Sin orden</option>
                        <option value="asc">A - Z</option>
                        <option value="desc">Z - A</option>
                    </select>
                </div>

                {/* Botón limpiar filtros */}
                <div className="flex items-end">
                    <button
                        onClick={onLimpiarFiltros}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>
        </div>
    );
}