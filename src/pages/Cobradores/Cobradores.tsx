import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import PageMeta from '../../components/common/PageMeta';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import Button from '../../components/ui/button/Button';
import { PencilIcon, TrashBinIcon } from '../../icons';
import { Cobrador, CobradorFormData, FiltrosCobradorState } from '../../types/cobrador';

// Importar componentes
import CrearCobradorModal from '../../components/Modals/CrearCobradorModal';
import EditarCobradorModal from '../../components/Modals/EditarCobradorModal';
import VerCobradorModal from '../../components/Modals/VerCobradorModal';
import EliminarCobradorModal from '../../components/Modals/EliminarCobradorModal';
import FiltrosCobradores from '../../components/Filtros/FiltrosCobradores';
import Paginacion from '../../components/Paginacion/Paginacion';
import CobradorCard from '../../pages/Cobradores/CobradorCard';

const API_BASE_URL = 'http://localhost:3000/api';
const ITEMS_PER_PAGE = 10;

export default function Cobradores() {
    const [cobradores, setCobradores] = useState<Cobrador[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para filtros
    const [filtros, setFiltros] = useState<FiltrosCobradorState>({
        search: '',
        estado: 'todos',
        fechaRegistroInicio: '',
        fechaRegistroFin: '',
        ordenFecha: 'desc',
        ordenNombre: '',
        ordenCedula: '',
        filtroRapido: 'todos'
    });

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCobrador, setSelectedCobrador] = useState<Cobrador | null>(null);

    // Form state
    const [formData, setFormData] = useState<CobradorFormData>({
        nombre: '',
        apellidos: '',
        celular: '',
        direccion: '',
        cedula: ''
    });

    // Form errors
    const [formErrors, setFormErrors] = useState<Partial<CobradorFormData>>({});

    // Función para mostrar alerta de éxito
    const mostrarExito = (mensaje: string) => {
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: mensaje,
            timer: 3000,
            showConfirmButton: false,
            position: 'top-end',
            toast: true,
            background: '#10b981',
            color: '#ffffff',
            iconColor: '#ffffff',
            customClass: {
                popup: 'rounded-lg shadow-lg'
            }
        });
    };

    // Función para mostrar alerta de error
    const mostrarError = (mensaje: string) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            timer: 4000,
            showConfirmButton: true,
            confirmButtonColor: '#ef4444',
            background: '#fef2f2',
            color: '#991b1b',
            customClass: {
                popup: 'rounded-lg shadow-lg'
            }
        });
    };

    // Función para mostrar alerta de advertencia
    const mostrarAdvertencia = (mensaje: string) => {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: mensaje,
            timer: 3000,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });
    };

    // Función para mostrar confirmación antes de eliminar
    const mostrarConfirmacionEliminar = async (cobrador: Cobrador): Promise<boolean> => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            html: `
                <div class="text-left">
                    <p class="mb-2">Estás a punto de desactivar al cobrador:</p>
                    <p class="font-bold text-red-600">${cobrador.nombre} ${cobrador.apellidos}</p>
                    <p class="text-sm text-gray-500 mt-2">Cédula: ${cobrador.cedula}</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-lg'
            }
        });
        return result.isConfirmed;
    };

    // Cargar cobradores - CON credentials: 'include'
    const fetchCobradores = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/cobradores/`, {
                credentials: 'include' // IMPORTANTE: Agregar esto
            });
            
            if (!response.ok) throw new Error('Error al cargar cobradores');
            
            const data = await response.json();
            setCobradores(data.data);
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al cargar cobradores');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCobradores();
    }, []);

    // Manejador de cambios en filtros
    const handleCambiarFiltro = (campo: keyof FiltrosCobradorState, valor: unknown) => {
        setFiltros(prev => {
            const nuevosFiltros = { ...prev, [campo]: valor };

            if (campo === 'filtroRapido') {
                switch (valor) {
                    case 'recientes':
                        nuevosFiltros.ordenFecha = 'desc';
                        break;
                    case 'antiguos':
                        nuevosFiltros.ordenFecha = 'asc';
                        break;
                }
            }

            return nuevosFiltros;
        });
        setCurrentPage(1);
    };

    const handleLimpiarFiltros = () => {
        setFiltros({
            search: '',
            estado: 'todos',
            fechaRegistroInicio: '',
            fechaRegistroFin: '',
            ordenFecha: 'desc',
            ordenNombre: '',
            ordenCedula: '',
            filtroRapido: 'todos'
        });
        setCurrentPage(1);
        mostrarAdvertencia('Filtros limpiados');
    };

    // Aplicar filtros a los datos
    const datosFiltrados = useMemo(() => {
        let filtrados = [...cobradores];

        if (filtros.search) {
            const searchLower = filtros.search.toLowerCase();
            filtrados = filtrados.filter(c =>
                c.nombre.toLowerCase().includes(searchLower) ||
                c.apellidos.toLowerCase().includes(searchLower) ||
                c.cedula.includes(filtros.search)
            );
        }

        if (filtros.estado === 'activos') {
            filtrados = filtrados.filter(c => c.activo === 1);
        } else if (filtros.estado === 'inactivos') {
            filtrados = filtrados.filter(c => c.activo === 0);
        }

        if (filtros.filtroRapido === 'sin_direccion') {
            filtrados = filtrados.filter(c => !c.direccion || c.direccion.trim() === '');
        }

        if (filtros.fechaRegistroInicio && filtros.fechaRegistroFin) {
            const inicio = new Date(filtros.fechaRegistroInicio);
            const fin = new Date(filtros.fechaRegistroFin);
            filtrados = filtrados.filter(c => {
                if (!c.created_at) return true;
                const fecha = new Date(c.created_at);
                return fecha >= inicio && fecha <= fin;
            });
        }

        if (filtros.ordenNombre) {
            filtrados.sort((a, b) => {
                const nombreA = `${a.nombre} ${a.apellidos}`.toLowerCase();
                const nombreB = `${b.nombre} ${b.apellidos}`.toLowerCase();
                return filtros.ordenNombre === 'asc'
                    ? nombreA.localeCompare(nombreB)
                    : nombreB.localeCompare(nombreA);
            });
        } else if (filtros.ordenCedula) {
            filtrados.sort((a, b) => {
                const cedulaA = parseInt(a.cedula) || 0;
                const cedulaB = parseInt(b.cedula) || 0;
                return filtros.ordenCedula === 'asc'
                    ? cedulaA - cedulaB
                    : cedulaB - cedulaA;
            });
        } else if (filtros.ordenFecha) {
            filtrados.sort((a, b) => {
                const fechaA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const fechaB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return filtros.ordenFecha === 'asc'
                    ? fechaA - fechaB
                    : fechaB - fechaA;
            });
        }

        return filtrados;
    }, [cobradores, filtros]);

    // Calcular paginación
    const totalItems = datosFiltrados.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const datosPaginados = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return datosFiltrados.slice(start, end);
    }, [datosFiltrados, currentPage]);

    // Handlers CRUD
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name as keyof CobradorFormData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<CobradorFormData> = {};

        if (!formData.nombre.trim()) {
            errors.nombre = 'El nombre es requerido';
        }
        if (!formData.apellidos.trim()) {
            errors.apellidos = 'Los apellidos son requeridos';
        }
        if (!formData.cedula.trim()) {
            errors.cedula = 'La cédula es requerida';
        } else if (!/^\d+$/.test(formData.cedula)) {
            errors.cedula = 'La cédula debe contener solo números';
        }
        if (!formData.celular.trim()) {
            errors.celular = 'El celular es requerido';
        } else if (!/^\d+$/.test(formData.celular)) {
            errors.celular = 'El celular debe contener solo números';
        }

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            mostrarError('Por favor, completa correctamente todos los campos requeridos');
        }

        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            apellidos: '',
            celular: '',
            direccion: '',
            cedula: ''
        });
        setFormErrors({});
    };

    const handleOpenCreateModal = () => {
        resetForm();
        setIsCreateModalOpen(true);
    };

    const handleOpenViewModal = (cobrador: Cobrador) => {
        setSelectedCobrador(cobrador);
        setIsViewModalOpen(true);
    };

    const handleOpenEditModal = (cobrador: Cobrador) => {
        setSelectedCobrador(cobrador);
        setFormData({
            nombre: cobrador.nombre,
            apellidos: cobrador.apellidos,
            celular: cobrador.celular,
            direccion: cobrador.direccion || '',
            cedula: cobrador.cedula
        });
        setFormErrors({});
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteModal = (cobrador: Cobrador) => {
        setSelectedCobrador(cobrador);
        setIsDeleteModalOpen(true);
    };

    const handleCreateCobrador = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cobradores/`, {
                method: 'POST',
                credentials: 'include', // IMPORTANTE: Agregar esto
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear cobrador');
            }

            mostrarExito('Cobrador creado exitosamente');
            setIsCreateModalOpen(false);
            resetForm();
            fetchCobradores();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al crear cobrador');
        }
    };

    const handleUpdateCobrador = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCobrador) return;

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cobradores/${selectedCobrador.id_cobrador}`, {
                method: 'PUT',
                credentials: 'include', // IMPORTANTE: Agregar esto
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar cobrador');
            }

            mostrarExito('Cobrador actualizado exitosamente');
            setIsEditModalOpen(false);
            resetForm();
            setSelectedCobrador(null);
            fetchCobradores();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al actualizar cobrador');
        }
    };

    const handleDeleteCobrador = async () => {
        if (!selectedCobrador) return;

        const confirmado = await mostrarConfirmacionEliminar(selectedCobrador);

        if (!confirmado) return;

        try {
            const response = await fetch(`${API_BASE_URL}/cobradores/${selectedCobrador.id_cobrador}`, {
                method: 'DELETE',
                credentials: 'include', // IMPORTANTE: Agregar esto
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al eliminar cobrador');
            }

            mostrarExito('Cobrador eliminado exitosamente');
            setIsDeleteModalOpen(false);
            setSelectedCobrador(null);
            fetchCobradores();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al eliminar cobrador');
        }
    };

    const handleReactivarCobrador = async (cobrador: Cobrador) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/cobradores/${cobrador.id_cobrador}/reactivar`,
                {
                    method: 'PATCH',
                    credentials: 'include', // IMPORTANTE: Agregar esto
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al reactivar cobrador');
            }

            mostrarExito('Cobrador reactivado exitosamente');
            fetchCobradores();

        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al reactivar cobrador');
        }
    };

    return (
        <>
            <PageMeta
                title="Cobradores | Panel de Control"
                description="Gestión de cobradores"
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Cobradores
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Gestiona los cobradores del sistema
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleOpenCreateModal}
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-100 px-4 py-2.5 text-sm font-medium text-blue-700 shadow-theme-xs transition-colors hover:bg-blue-200 hover:text-blue-800 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Nuevo Cobrador
                        </Button>
                    </div>
                </div>

                {/* Filtros */}
                <FiltrosCobradores
                    filtros={filtros}
                    totalCobradores={totalItems}
                    onCambiarFiltro={handleCambiarFiltro}
                    onLimpiarFiltros={handleLimpiarFiltros}
                />

                {/* Vista de Tarjetas - SOLO para móvil (oculto en desktop) */}
                <div className="block lg:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {loading ? (
                            <div className="col-span-full flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                            </div>
                        ) : datosPaginados.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                                {filtros.search || filtros.estado !== 'todos' || filtros.fechaRegistroInicio
                                    ? 'No se encontraron resultados con los filtros aplicados'
                                    : 'No hay cobradores registrados'}
                            </div>
                        ) : (
                            datosPaginados.map((cobrador) => (
                                <CobradorCard
                                    key={cobrador.id_cobrador}
                                    cobrador={cobrador}
                                    onVer={handleOpenViewModal}
                                    onEditar={handleOpenEditModal}
                                    onEliminar={handleOpenDeleteModal}
                                    onReactivar={handleReactivarCobrador}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Vista de Tabla - SOLO para desktop (oculto en móvil) */}
                <div className="hidden lg:block overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <tr>
                                        <th className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400">No.</th>
                                        <th className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Nombre</th>
                                        <th className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Apellidos</th>
                                        <th className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Cédula</th>
                                        <th className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Celular</th>
                                        <th className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Dirección</th>
                                        <th className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Estado</th>
                                        <th className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={8} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : datosPaginados.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                                                {filtros.search || filtros.estado !== 'todos' || filtros.fechaRegistroInicio
                                                    ? 'No se encontraron resultados con los filtros aplicados'
                                                    : 'No hay cobradores registrados'}
                                            </td>
                                        </tr>
                                    ) : (
                                        datosPaginados.map((cobrador) => (
                                            <tr
                                                key={cobrador.id_cobrador}
                                                className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {cobrador.id_cobrador}
                                                </td>
                                                <td className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {cobrador.nombre}
                                                </td>
                                                <td className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {cobrador.apellidos}
                                                </td>
                                                <td className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {cobrador.cedula}
                                                </td>
                                                <td className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {cobrador.celular}
                                                </td>
                                                <td className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {cobrador.direccion || '-'}
                                                </td>
                                                <td className="px-5 py-4 text-md align-middle">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-md font-medium ${cobrador.activo === 1
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                                        }`}>
                                                        {cobrador.activo === 1 ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-md align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenViewModal(cobrador)}
                                                            className="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 transition-colors"
                                                            title="Ver detalles"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                                                                <circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenEditModal(cobrador)}
                                                            className="rounded-lg border border-gray-300 bg-white p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:border-gray-700 dark:bg-gray-800 dark:text-amber-400 dark:hover:bg-white/[0.03] dark:hover:text-amber-300 transition-colors"
                                                            title="Editar"
                                                        >
                                                            <PencilIcon className="w-5 h-5" />
                                                        </button>
                                                        {cobrador.activo === 1 ? (
                                                            <button
                                                                onClick={() => handleOpenDeleteModal(cobrador)}
                                                                className="rounded-lg border border-gray-300 bg-white p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-gray-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-white/[0.03] dark:hover:text-red-300 transition-colors"
                                                                title="Eliminar"
                                                            >
                                                                <TrashBinIcon className="w-5 h-5" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleReactivarCobrador(cobrador)}
                                                                className="rounded-lg border border-gray-300 bg-white p-1.5 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-gray-700 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-white/[0.03] dark:hover:text-green-300 transition-colors"
                                                                title="Activar"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Paginación */}
                {!loading && datosFiltrados.length > 0 && (
                    <Paginacion
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            {/* Modales */}
            <CrearCobradorModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleCreateCobrador}
                formErrors={formErrors}
            />

            <EditarCobradorModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleUpdateCobrador}
                selectedCobrador={selectedCobrador}
                formErrors={formErrors}
            />

            <VerCobradorModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                selectedCobrador={selectedCobrador}
            />

            <EliminarCobradorModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteCobrador}
                selectedCobrador={selectedCobrador}
            />
        </>
    );
}