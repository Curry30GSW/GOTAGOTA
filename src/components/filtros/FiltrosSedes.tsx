import React from 'react';
import { FiltrosSedeState } from '../../types/sede';

interface FiltrosSedesProps {
    filtros: FiltrosSedeState;
    totalItems: number;
    onCambiarFiltro: (campo: keyof FiltrosSedeState, valor: any) => void;
    onLimpiarFiltros: () => void;
    isAdmin: boolean;
}

export default function FiltrosSedes({
    filtros,
    totalItems,
    onCambiarFiltro,
    onLimpiarFiltros,
    isAdmin
}: FiltrosSedesProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Búsqueda */}
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Buscar
                    </label>
                    <input
                        type="text"
                        value={filtros.search}
                        onChange={(e) => onCambiarFiltro('search', e.target.value)}
                        placeholder="Nombre, dirección o teléfono..."
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                    />
                </div>

                {/* Filtro por estado - Solo visible para admin */}
                {isAdmin && (
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                            Estado
                        </label>
                        <select
                            value={filtros.activo}
                            onChange={(e) => onCambiarFiltro('activo', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="activo">Activos</option>
                            <option value="inactivo">Inactivos</option>
                        </select>
                    </div>
                )}

                {/* Ordenar por nombre */}
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Ordenar por nombre
                    </label>
                    <select
                        value={filtros.ordenNombre}
                        onChange={(e) => onCambiarFiltro('ordenNombre', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                    >
                        <option value="asc">A - Z</option>
                        <option value="desc">Z - A</option>
                    </select>
                </div>
            </div>

            {/* Barra de acciones */}
            <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {totalItems} {totalItems === 1 ? 'sede encontrada' : 'sedes encontradas'}
                </p>
                <button
                    onClick={onLimpiarFiltros}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                >
                    Limpiar filtros
                </button>
            </div>
        </div>
    );
}