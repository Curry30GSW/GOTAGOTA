import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import Button from '../../components/ui/button/Button';
import { PencilIcon, TrashBinIcon, PlusIcon } from '../../icons';
import { Sede, SedeFormData, FiltrosSedeState } from '../../types/sede';
import CrearSedeModal from '../../components/Modals/CrearSedeModal';
import EditarSedeModal from '../../components/Modals/EditarSedeModal';
import FiltrosSedes from '../../components/filtros/FiltrosSedes';
import Paginacion from '../../components/Paginacion/Paginacion';

const API_BASE_URL = 'https://api-integracion-movil.vercel.app/';
const ITEMS_PER_PAGE = 10;

export default function SedesTab() {
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

    // Cargar datos
    const fetchSedes = async () => {
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
        fetchSedes();
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

        if (filtros.search) {
            const searchLower = filtros.search.toLowerCase();
            filtrados = filtrados.filter(s =>
                s.nombre_sede?.toLowerCase().includes(searchLower) ||
                s.direccion?.toLowerCase().includes(searchLower) ||
                s.telefono?.includes(filtros.search)
            );
        }

        if (filtros.activo !== 'todos') {
            const activoValue = filtros.activo === 'activo' ? 1 : 0;
            filtrados = filtrados.filter(s => s.activo === activoValue);
        }

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

        if (!validateForm()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/sedes/`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al crear sede');
            }

            mostrarExito('Sede creada exitosamente');
            setIsCreateModalOpen(false);
            resetForm();
            fetchSedes();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al crear sede');
        }
    };

    const handleUpdateSede = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSede) return;

        if (!validateForm()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/sedes/${selectedSede.id_sede}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
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
            fetchSedes();
        } catch (err) {
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
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al eliminar sede');
            }

            mostrarExito('Sede eliminada exitosamente');
            fetchSedes();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al eliminar sede');
        }
    };

    const handleActivateSede = async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/sedes/${id}/activate`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al activar sede');
            }

            mostrarExito('Sede activada exitosamente');
            fetchSedes();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al activar sede');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getEstadoStyles = (activo: number) => {
        return activo === 1
            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    };

    return (
        <div className="space-y-6">
            {/* Header con botón de crear */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Lista de Sedes
                </h2>
                <Button
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-100 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
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
                isAdmin={true}
            />

            {/* Tabla */}
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center">ID</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center uppercase">Nombre</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center uppercase">Dirección</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center uppercase">Teléfono</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center uppercase">Fecha Creación</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center uppercase">Estado</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center uppercase">Acciones</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="px-5 py-8 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : datosPaginados.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="px-5 py-8 text-center text-gray-500">
                                            No hay sedes registradas
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    datosPaginados.map((sede) => (
                                        <TableRow key={sede.id_sede}>
                                            <TableCell className="px-5 py-4 text-center">#{sede.id_sede}</TableCell>
                                            <TableCell className="px-5 py-4">
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {sede.nombre_sede}
                                                </p>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">{sede.direccion}</TableCell>
                                            <TableCell className="px-5 py-4 text-center">{sede.telefono}</TableCell>
                                            <TableCell className="px-5 py-4 text-center dark:text-white">
                                                {formatDate(sede.created_at)}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-md font-medium ${getEstadoStyles(sede.activo)}`}>
                                                    {sede.activo === 1 ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenEditModal(sede)}
                                                        className="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                                                        title="Editar"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>

                                                    {sede.activo === 1 ? (
                                                        <button
                                                            onClick={() => handleDeleteSede(sede.id_sede)}
                                                            className="rounded-lg border border-red-300 bg-red-50 p-1.5 text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400"
                                                            title="Inhabilitar"
                                                        >
                                                            <TrashBinIcon className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleActivateSede(sede.id_sede)}
                                                            className="rounded-lg border border-green-300 bg-green-50 p-1.5 text-green-700 hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400"
                                                            title="Activar"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </TableCell>
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
        </div>
    );
}