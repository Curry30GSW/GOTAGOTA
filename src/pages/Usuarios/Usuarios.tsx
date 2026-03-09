import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import PageMeta from '../../components/common/PageMeta';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import Button from '../../components/ui/button/Button';
import { EyeIcon, PencilIcon, TrashBinIcon, PlusIcon } from '../../icons';
import { Usuario, UsuarioFormData, FiltrosUsuarioState } from '../../types/usuario';

// Importar componentes
import CrearUsuarioModal from '../../components/Modals/CrearUsuarioModal';
import EditarUsuarioModal from '../../components/Modals/EditarUsuarioModal';
import VerUsuarioModal from '../../components/Modals/VerUsuarioModal';
import EliminarUsuarioModal from '../../components/Modals/EliminarUsuarioModal';
import FiltrosUsuarios from '../../components/filtros/FiltrosUsuarios';
import Paginacion from '../../components/Paginacion/Paginacion';

const API_BASE_URL = 'http://localhost:3000/api';
const ITEMS_PER_PAGE = 10;

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para filtros
    const [filtros, setFiltros] = useState<FiltrosUsuarioState>({
        search: '',
        rol: '',
        estado: '',
        ordenNombre: '',
        ordenUsuario: '',
        ordenFecha: 'desc',
        filtroRapido: 'todos'
    });

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

    // Form state
    const [formData, setFormData] = useState<UsuarioFormData>({
        usuario: '',
        contraseña: '',
        nombre: '',
        rol: '',
        activo: 1
    });

    // Form errors
    const [formErrors, setFormErrors] = useState<Partial<UsuarioFormData>>({});

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

    const mostrarConfirmacionEliminar = async (usuario: Usuario): Promise<boolean> => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            html: `
                <div class="text-left">
                    <p class="mb-2">Estás a punto de eliminar al usuario:</p>
                    <p class="font-bold text-red-600">${usuario.nombre}</p>
                    <p class="text-sm text-gray-500 mt-2">Usuario: ${usuario.usuario}</p>
                    <p class="text-sm text-red-500 mt-4">¡Esta acción no se puede deshacer!</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            customClass: { popup: 'rounded-lg' }
        });
        return result.isConfirmed;
    };

    // Cargar datos
    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Error al cargar usuarios');
            const data = await response.json();
            setUsuarios(data.data || []);
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    // Manejador de cambios en filtros
    const handleCambiarFiltro = (campo: keyof FiltrosUsuarioState, valor: any) => {
        setFiltros(prev => {
            const nuevosFiltros = { ...prev, [campo]: valor };

            // Manejar filtros rápidos
            if (campo === 'filtroRapido') {
                switch (valor) {
                    case 'activos':
                        nuevosFiltros.estado = 'activos';
                        break;
                    case 'inactivos':
                        nuevosFiltros.estado = 'inactivos';
                        break;
                    case 'recientes':
                        nuevosFiltros.ordenFecha = 'desc';
                        break;
                    case 'todos':
                        nuevosFiltros.estado = '';
                        nuevosFiltros.rol = '';
                        nuevosFiltros.ordenFecha = 'desc';
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
            rol: '',
            estado: '',
            ordenNombre: '',
            ordenUsuario: '',
            ordenFecha: 'desc',
            filtroRapido: 'todos'
        });
        setCurrentPage(1);
        mostrarAdvertencia('Filtros limpiados');
    };

    // Aplicar filtros a los datos
    const datosFiltrados = useMemo(() => {
        let filtrados = [...usuarios];

        // Búsqueda
        if (filtros.search) {
            const searchLower = filtros.search.toLowerCase();
            filtrados = filtrados.filter(u =>
                u.nombre.toLowerCase().includes(searchLower) ||
                u.usuario.toLowerCase().includes(searchLower)
            );
        }

        // Filtro por rol
        if (filtros.rol) {
            filtrados = filtrados.filter(u => u.rol === filtros.rol);
        }

        // Filtro por estado
        if (filtros.estado === 'activos') {
            filtrados = filtrados.filter(u => u.activo === 1);
        } else if (filtros.estado === 'inactivos') {
            filtrados = filtrados.filter(u => u.activo === 0);
        }

        // Ordenamientos
        if (filtros.ordenNombre) {
            filtrados.sort((a, b) => {
                const nombreA = a.nombre.toLowerCase();
                const nombreB = b.nombre.toLowerCase();
                return filtros.ordenNombre === 'asc'
                    ? nombreA.localeCompare(nombreB)
                    : nombreB.localeCompare(nombreA);
            });
        } else if (filtros.ordenUsuario) {
            filtrados.sort((a, b) => {
                const usuarioA = a.usuario.toLowerCase();
                const usuarioB = b.usuario.toLowerCase();
                return filtros.ordenUsuario === 'asc'
                    ? usuarioA.localeCompare(usuarioB)
                    : usuarioB.localeCompare(usuarioA);
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
    }, [usuarios, filtros]);

    // Calcular paginación
    const totalItems = datosFiltrados.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const datosPaginados = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return datosFiltrados.slice(start, end);
    }, [datosFiltrados, currentPage]);

    // Handlers CRUD
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name as keyof UsuarioFormData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (isEdit: boolean = false): boolean => {
        const errors: Partial<UsuarioFormData> = {};

        if (!formData.usuario?.trim()) {
            errors.usuario = 'El usuario es requerido';
        } else if (formData.usuario.length < 3) {
            errors.usuario = 'El usuario debe tener al menos 3 caracteres';
        }

        if (!isEdit || formData.contraseña) {
            if (!formData.contraseña?.trim()) {
                errors.contraseña = 'La contraseña es requerida';
            } else if (formData.contraseña.length < 6) {
                errors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
            }
        }

        if (!formData.nombre?.trim()) {
            errors.nombre = 'El nombre es requerido';
        }

        if (!formData.rol) {
            errors.rol = 'El rol es requerido';
        }

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            mostrarError('Por favor, completa correctamente todos los campos requeridos');
        }

        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            usuario: '',
            contraseña: '',
            nombre: '',
            rol: '',
            activo: 1
        });
        setFormErrors({});
    };

    const handleOpenCreateModal = () => {
        resetForm();
        setIsCreateModalOpen(true);
    };

    const handleOpenViewModal = (usuario: Usuario) => {
        setSelectedUsuario(usuario);
        setIsViewModalOpen(true);
    };

    const handleOpenEditModal = (usuario: Usuario) => {
        setSelectedUsuario(usuario);
        setFormData({
            usuario: usuario.usuario,
            contraseña: '',
            nombre: usuario.nombre,
            rol: usuario.rol,
            activo: usuario.activo
        });
        setFormErrors({});
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteModal = (usuario: Usuario) => {
        setSelectedUsuario(usuario);
        setIsDeleteModalOpen(true);
    };

    const handleCreateUsuario = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear usuario');
            }

            mostrarExito('Usuario creado exitosamente');
            setIsCreateModalOpen(false);
            resetForm();
            fetchUsuarios();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al crear usuario');
        }
    };

    const handleUpdateUsuario = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUsuario) return;

        if (!validateForm(true)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${selectedUsuario.id_usuario}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar usuario');
            }

            mostrarExito('Usuario actualizado exitosamente');
            setIsEditModalOpen(false);
            resetForm();
            setSelectedUsuario(null);
            fetchUsuarios();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al actualizar usuario');
        }
    };

    const handleDeleteUsuario = async () => {
        if (!selectedUsuario) return;

        const confirmado = await mostrarConfirmacionEliminar(selectedUsuario);

        if (!confirmado) return;

        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${selectedUsuario.id_usuario}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al eliminar usuario');
            }

            mostrarExito('Usuario eliminado exitosamente');
            setIsDeleteModalOpen(false);
            setSelectedUsuario(null);
            fetchUsuarios();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al eliminar usuario');
        }
    };

    return (
        <>
            <PageMeta
                title="Usuarios | Panel de Control"
                description="Gestión de usuarios del sistema"
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Usuarios
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Gestiona los usuarios del sistema
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-100 px-4 py-2.5 text-sm font-medium text-blue-700 shadow-theme-xs transition-colors hover:bg-blue-200 hover:text-blue-800 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Nuevo Usuario
                    </Button>
                </div>

                {/* Filtros */}
                <FiltrosUsuarios
                    filtros={filtros}
                    totalUsuarios={totalItems}
                    onCambiarFiltro={handleCambiarFiltro}
                    onLimpiarFiltros={handleLimpiarFiltros}
                />

                {/* Tabla de usuarios */}
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400">ID</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400">Usuario</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400">Nombre</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400">Rol</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400">Estado</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400">Acciones</TableCell>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : datosPaginados.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                                                {filtros.search || filtros.rol || filtros.estado
                                                    ? 'No se encontraron resultados con los filtros aplicados'
                                                    : 'No hay usuarios registrados'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        datosPaginados.map((usuario) => (
                                            <TableRow
                                                key={usuario.id_usuario}
                                                className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                                            >
                                                <TableCell className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {usuario.id_usuario}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {usuario.usuario}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {usuario.nombre}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-md align-middle">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-md font-medium
                                                        ${usuario.rol === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                                                            usuario.rol === 'supervisor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                                                'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                                                        }`}>
                                                        {usuario.rol}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-md align-middle">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-md font-medium ${usuario.activo === 1
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                                        }`}>
                                                        {usuario.activo === 1 ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-md align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenViewModal(usuario)}
                                                            className="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 transition-colors"
                                                            title="Ver detalles"
                                                        >
                                                            <EyeIcon className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenEditModal(usuario)}
                                                            className="rounded-lg border border-gray-300 bg-white p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:border-gray-700 dark:bg-gray-800 dark:text-amber-400 dark:hover:bg-white/[0.03] dark:hover:text-amber-300 transition-colors"
                                                            title="Editar"
                                                        >
                                                            <PencilIcon className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenDeleteModal(usuario)}
                                                            className="rounded-lg border border-gray-300 bg-white p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-gray-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-white/[0.03] dark:hover:text-red-300 transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <TrashBinIcon className="w-5 h-5" />
                                                        </button>
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
            </div>

            {/* Modales */}
            <CrearUsuarioModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleCreateUsuario}
                formErrors={formErrors}
            />

            <EditarUsuarioModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleUpdateUsuario}
                selectedUsuario={selectedUsuario}
                formErrors={formErrors}
            />

            <VerUsuarioModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                selectedUsuario={selectedUsuario}
            />

            <EliminarUsuarioModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteUsuario}
                selectedUsuario={selectedUsuario}
            />
        </>
    );
}