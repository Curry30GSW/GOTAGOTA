import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import PageMeta from '../../components/common/PageMeta';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import Button from '../../components/ui/button/Button';
import { PlusIcon } from '../../icons';
import { Sede, SedeFormData, FiltrosSedeState } from '../../types/sede';

// Importar componentes
import CrearSedeModal from '../../components/Modals/CrearSedeModal';
import EditarSedeModal from '../../components/Modals/EditarSedeModal';
import FiltrosSedes from '../../components/filtros//FiltrosSedes';
import Paginacion from '../../components/Paginacion/Paginacion';

const API_BASE_URL = 'http://localhost:3000/api';
const ITEMS_PER_PAGE = 10;

export default function Sedes() {
    const [sedes, setSedes] = useState<Sede[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para filtros
    const [filtros, setFiltros] = useState<FiltrosSedeState>({
        search: '',
        activo: 'todos',
        ordenNombre: 'asc'
    });

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSede, setSelectedSede] = useState<Sede | null>(null);

    // Form state
    const [formData, setFormData] = useState<SedeFormData>({
        nombre_sede: '',
        direccion: '',
        telefono: ''
    });

    // Form errors
    const [formErrors, setFormErrors] = useState<Partial<SedeFormData>>({});

    // Funciones de SweetAlert
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
            customClass: { popup: 'rounded-lg shadow-lg' }
        });
    };

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
            customClass: { popup: 'rounded-lg shadow-lg' }
        });
    };

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

    const mostrarConfirmacion = async (titulo: string, texto: string): Promise<boolean> => {
        const result = await Swal.fire({
            title: titulo,
            text: texto,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar'
        });
        return result.isConfirmed;
    };

    // Cargar datos - TODAS LAS PETICIONES CON credentials: 'include'
    const fetchSedes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/sedes/`, {
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Error al cargar sedes');

            const data = await response.json();
            setSedes(data.data);
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al cargar sedes');
        } finally {
            setLoading(false);
        }
    };

    const fetchSedesAdmin = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/sedes/admin/all`, {
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Error al cargar sedes');

            const data = await response.json();
            setSedes(data.data);
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al cargar sedes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Determinar si el usuario es admin (esto debe venir de tu contexto de autenticación)
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (user?.rol === 'admin') {
            fetchSedesAdmin();
        } else {
            fetchSedes();
        }
    }, []);

    // Manejador de cambios en filtros
    const handleCambiarFiltro = (campo: keyof FiltrosSedeState, valor: any) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
        setCurrentPage(1);
    };

    const handleLimpiarFiltros = () => {
        setFiltros({
            search: '',
            activo: 'todos',
            ordenNombre: 'asc'
        });
        setCurrentPage(1);
        mostrarAdvertencia('Filtros limpiados');
    };

    // Aplicar filtros a los datos
    const datosFiltrados = useMemo(() => {
        let filtrados = [...sedes];

        // Búsqueda por texto
        if (filtros.search) {
            const searchLower = filtros.search.toLowerCase();
            filtrados = filtrados.filter(s =>
                s.nombre_sede?.toLowerCase().includes(searchLower) ||
                s.direccion?.toLowerCase().includes(searchLower) ||
                s.telefono?.includes(filtros.search)
            );
        }

        // Filtro por estado
        if (filtros.activo !== 'todos') {
            const activoValue = filtros.activo === 'activo' ? 1 : 0;
            filtrados = filtrados.filter(s => s.activo === activoValue);
        }

        // Ordenamiento por nombre
        if (filtros.ordenNombre) {
            filtrados.sort((a, b) => {
                const nombreA = a.nombre_sede.toLowerCase();
                const nombreB = b.nombre_sede.toLowerCase();
                return filtros.ordenNombre === 'asc'
                    ? nombreA.localeCompare(nombreB)
                    : nombreB.localeCompare(nombreA);
            });
        }

        return filtrados;
    }, [sedes, filtros]);

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
        if (formErrors[name as keyof SedeFormData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<SedeFormData> = {};

        if (!formData.nombre_sede || formData.nombre_sede.trim() === '') {
            errors.nombre_sede = 'El nombre de la sede es requerido';
        }
        if (!formData.direccion || formData.direccion.trim() === '') {
            errors.direccion = 'La dirección es requerida';
        }
        if (!formData.telefono || formData.telefono.trim() === '') {
            errors.telefono = 'El teléfono es requerido';
        } else if (!/^\d{7,10}$/.test(formData.telefono)) {
            errors.telefono = 'El teléfono debe tener entre 7 y 10 dígitos';
        }

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            mostrarError('Por favor, completa correctamente todos los campos requeridos');
        }

        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            nombre_sede: '',
            direccion: '',
            telefono: ''
        });
        setFormErrors({});
    };

    const handleOpenCreateModal = () => {
        resetForm();
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (sede: Sede) => {
        setSelectedSede(sede);
        setFormData({
            nombre_sede: sede.nombre_sede,
            direccion: sede.direccion,
            telefono: sede.telefono
        });
        setIsEditModalOpen(true);
    };

    const handleCreateSede = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/sedes/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al crear sede');
            }

            mostrarExito('Sede creada exitosamente');
            setIsCreateModalOpen(false);
            resetForm();

            // Recargar según el rol
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            if (user?.rol === 'admin') {
                fetchSedesAdmin();
            } else {
                fetchSedes();
            }
        } catch (err) {
            console.error('Error al crear sede:', err);
            mostrarError(err instanceof Error ? err.message : 'Error al crear sede');
        }
    };

    const handleUpdateSede = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSede) return;

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/sedes/${selectedSede.id_sede}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al actualizar sede');
            }

            mostrarExito('Sede actualizada exitosamente');
            setIsEditModalOpen(false);
            resetForm();
            setSelectedSede(null);

            // Recargar según el rol
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            if (user?.rol === 'admin') {
                fetchSedesAdmin();
            } else {
                fetchSedes();
            }
        } catch (err) {
            console.error('Error al actualizar sede:', err);
            mostrarError(err instanceof Error ? err.message : 'Error al actualizar sede');
        }
    };

    const handleDeleteSede = async (id: number) => {
        const confirm = await mostrarConfirmacion(
            'Inhabilitar sede',
            'Esta acción desactivará la sede. ¿Estás seguro?'
        );

        if (!confirm) return;

        try {
            const response = await fetch(`${API_BASE_URL}/sedes/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al eliminar sede');
            }

            mostrarExito('Sede eliminada exitosamente');

            // Recargar según el rol
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            if (user?.rol === 'admin') {
                fetchSedesAdmin();
            } else {
                fetchSedes();
            }
        } catch (err) {
            console.error('Error al eliminar sede:', err);
            mostrarError(err instanceof Error ? err.message : 'Error al eliminar sede');
        }
    };

    const handleActivateSede = async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/sedes/${id}/activate`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al activar sede');
            }

            mostrarExito('Sede activada exitosamente');

            // Recargar según el rol
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            if (user?.rol === 'admin') {
                fetchSedesAdmin();
            } else {
                fetchSedes();
            }
        } catch (err) {
            console.error('Error al activar sede:', err);
            mostrarError(err instanceof Error ? err.message : 'Error al activar sede');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const getEstadoStyles = (activo: number) => {
        return activo === 1
            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    };

    const getEstadoLabel = (activo: number) => {
        return activo === 1 ? 'Activo' : 'Inactivo';
    };

    // Obtener el rol del usuario (deberías tener esto en un contexto)
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAdmin = user?.rol === 'admin';

    return (
        <>
            <PageMeta
                title="Sedes | Panel de Control"
                description="Gestión de sedes"
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Sedes
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Gestiona las sedes del sistema
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-100 px-4 py-2.5 text-sm font-medium text-blue-700 shadow-theme-xs transition-colors hover:bg-blue-200 hover:text-blue-800 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Nueva Sede
                    </Button>
                </div>

                {/* Filtros */}
                <FiltrosSedes
                    filtros={filtros}
                    totalItems={totalItems}
                    onCambiarFiltro={handleCambiarFiltro}
                    onLimpiarFiltros={handleLimpiarFiltros}
                    isAdmin={isAdmin}
                />

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400">ID</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Nombre</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Dirección</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Teléfono</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Fecha Creación</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Estado</TableCell>
                                        {isAdmin && (
                                            <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Acciones</TableCell>
                                        )}
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={isAdmin ? 7 : 6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : datosPaginados.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={isAdmin ? 7 : 6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                                                {filtros.search || filtros.activo !== 'todos'
                                                    ? 'No se encontraron resultados con los filtros aplicados'
                                                    : 'No hay sedes registradas'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        datosPaginados.map((sede) => (
                                            <TableRow key={sede.id_sede}>
                                                <TableCell className="px-5 py-4 text-center">
                                                    #{sede.id_sede}
                                                </TableCell>
                                                <TableCell className="px-5 py-4">
                                                    <p className="font-medium text-gray-800 whitespace-nowrap dark:text-white">
                                                        {sede.nombre_sede}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="px-5 py-4">
                                                    <p className="text-gray-800 whitespace-nowrap dark:text-white">
                                                        {sede.direccion}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center">
                                                    <p className="text-gray-800 dark:text-white">
                                                        {sede.telefono}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center dark:text-white">
                                                    {formatDate(sede.created_at)}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-md font-medium ${getEstadoStyles(sede.activo)}`}>
                                                        {getEstadoLabel(sede.activo)}
                                                    </span>
                                                </TableCell>
                                                {isAdmin && (
                                                    <TableCell className="px-5 py-4 text-center align-middle">
                                                        <div className="flex justify-center items-center gap-2">
                                                            <button
                                                                onClick={() => handleOpenEditModal(sede)}
                                                                className="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 transition-colors"
                                                                title="Editar sede"
                                                            >
                                                                <svg
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                    />
                                                                </svg>
                                                            </button>

                                                            {sede.activo === 1 ? (
                                                                <button
                                                                    onClick={() => handleDeleteSede(sede.id_sede)}
                                                                    className="rounded-lg border border-red-300 bg-red-50 p-1.5 text-red-700 hover:bg-red-100 hover:text-red-800 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                                                                    title="Eliminar sede"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleActivateSede(sede.id_sede)}
                                                                    className="rounded-lg border border-green-300 bg-green-50 p-1.5 text-green-700 hover:bg-green-100 hover:text-green-800 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 transition-colors"
                                                                    title="Activar sede"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
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
            <CrearSedeModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleCreateSede}
                formErrors={formErrors}
            />

            <EditarSedeModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedSede(null);
                    resetForm();
                }}
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleUpdateSede}
                formErrors={formErrors}
                sede={selectedSede}
            />
        </>
    );
}