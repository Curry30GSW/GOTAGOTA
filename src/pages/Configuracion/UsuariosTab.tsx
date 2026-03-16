import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import Button from '../../components/ui/button/Button';
import { PencilIcon, TrashBinIcon, PlusIcon } from '../../icons';
import { Usuario, UsuarioFormData, FiltrosUsuarioState } from '../../types/usuario';
import CrearUsuarioModal from '../../components/Modals/CrearUsuarioModal';
import EditarUsuarioModal from '../../components/Modals/EditarUsuarioModal';
import FiltrosUsuarios from '../../components/filtros/FiltrosUsuarios';
import Paginacion from '../../components/Paginacion/Paginacion';
import UsuarioCard from './UsuarioCard'; // ← Importar el nuevo componente

const API_BASE_URL = 'https://api-integracion-movil.vercel.app/';
const ITEMS_PER_PAGE = 10;

export default function UsuariosTab() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [sedes, setSedes] = useState<{ id_sede: number; nombre_sede: string; activo: number }[]>([]);
    const [loading, setLoading] = useState(true);

    // Obtener usuario actual
    const currentUserStr = localStorage.getItem('user');
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

    // Estados para filtros
    const [filtros, setFiltros] = useState<FiltrosUsuarioState>({
        search: '',
        rol: 'todos',
        sede: 'todos',
        activo: 'todos',
        ordenNombre: 'asc'
    });

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

    // Form state
    const [formData, setFormData] = useState<UsuarioFormData>({
        usuario: '',
        contraseña: '',
        nombre: '',
        rol: '',
        id_sede: 0
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
    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/admin/all`, {
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Error al cargar usuarios');
            const data = await response.json();

            // Mapear los datos para asegurar la estructura correcta
            const usuariosMapeados = data.data.map((u: any) => ({
                id_usuario: u.id_usuario,
                usuario: u.usuario,
                nombre: u.nombre,
                rol: u.rol,
                id_sede: u.id_sede,
                nombre_sede: u.nombre_sede,
                activo: u.activo,
                created_at: u.created_at,
                updated_at: u.updated_at
            }));

            setUsuarios(usuariosMapeados);
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const fetchSedes = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/sedes/`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Error al cargar sedes');
            const data = await response.json();
            setSedes(data.data);
        } catch (err) {
            console.error('Error al cargar sedes:', err);
        }
    };

    useEffect(() => {
        fetchUsuarios();
        fetchSedes();
    }, []);

    // Manejador de cambios en filtros
    const handleCambiarFiltro = (campo: keyof FiltrosUsuarioState, valor: any) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
        setCurrentPage(1);
    };

    const handleLimpiarFiltros = () => {
        setFiltros({
            search: '',
            rol: 'todos',
            sede: 'todos',
            activo: 'todos',
            ordenNombre: 'asc'
        });
        setCurrentPage(1);
        mostrarAdvertencia('Filtros limpiados');
    };

    // Aplicar filtros a los datos
    const datosFiltrados = useMemo(() => {
        let filtrados = [...usuarios];

        if (filtros.search) {
            const searchLower = filtros.search.toLowerCase();
            filtrados = filtrados.filter(u =>
                u.usuario.toLowerCase().includes(searchLower) ||
                u.nombre.toLowerCase().includes(searchLower)
            );
        }

        if (filtros.rol !== 'todos') {
            filtrados = filtrados.filter(u => u.rol === filtros.rol);
        }

        if (filtros.sede !== 'todos' && filtros.sede) {
            const sedeId = parseInt(filtros.sede);
            filtrados = filtrados.filter(u => u.id_sede === sedeId);
        }

        if (filtros.activo !== 'todos') {
            const activoValue = filtros.activo === 'activo' ? 1 : 0;
            filtrados = filtrados.filter(u => u.activo === activoValue);
        }

        if (filtros.ordenNombre) {
            filtrados.sort((a, b) => {
                const nombreA = a.nombre.toLowerCase();
                const nombreB = b.nombre.toLowerCase();
                return filtros.ordenNombre === 'asc'
                    ? nombreA.localeCompare(nombreB)
                    : nombreB.localeCompare(nombreA);
            });
        }

        return filtrados;
    }, [usuarios, filtros]);

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

    const validateForm = (creando: boolean = true): boolean => {
        const errors: Partial<UsuarioFormData> = {};

        if (!formData.usuario || formData.usuario.trim() === '') {
            errors.usuario = 'El usuario es requerido';
        }
        if (creando && (!formData.contraseña || formData.contraseña.length < 6)) {
            errors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (!formData.nombre || formData.nombre.trim() === '') {
            errors.nombre = 'El nombre es requerido';
        }
        if (!formData.rol) {
            errors.rol = 'El rol es requerido';
        }
        if (!formData.id_sede || formData.id_sede === 0) {
            errors.id_sede = 'La sede es requerida';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            usuario: '',
            contraseña: '',
            nombre: '',
            rol: '',
            id_sede: 0
        });
        setFormErrors({});
    };

    const handleOpenCreateModal = () => {
        resetForm();
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (usuario: Usuario) => {
        setSelectedUsuario(usuario);
        setFormData({
            usuario: usuario.usuario,
            nombre: usuario.nombre,
            rol: usuario.rol,
            id_sede: usuario.id_sede,
            contraseña: ''
        });
        setIsEditModalOpen(true);
    };

    const handleCreateUsuario = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm(true)) {
            mostrarError('Por favor, completa correctamente todos los campos requeridos');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al crear usuario');
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

        if (!validateForm(false)) {
            mostrarError('Por favor, completa correctamente todos los campos requeridos');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${selectedUsuario.id_usuario}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al actualizar usuario');
            }

            mostrarExito('Usuario actualizado exitosamente');
            setIsEditModalOpen(false);
            setSelectedUsuario(null);
            resetForm();
            fetchUsuarios();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al actualizar usuario');
        }
    };

    const handleDeleteUsuario = async (id: number, nombre: string) => {
        const confirm = await mostrarConfirmacion(
            'Inhabilitar usuario',
            `¿Estás seguro de que deseas inhabilitar al usuario "${nombre}"?`
        );

        if (!confirm) return;

        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al eliminar usuario');
            }

            mostrarExito('Usuario inhabilitado exitosamente');
            fetchUsuarios();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al eliminar usuario');
        }
    };

    const handleActivateUsuario = async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}/activate`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al activar usuario');
            }

            mostrarExito('Usuario activado exitosamente');
            fetchUsuarios();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al activar usuario');
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getRolStyles = (rol: string) => {
        switch (rol) {
            case 'admin':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
            case 'supervisor':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
            default:
                return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
        }
    };

    const getRolLabel = (rol: string) => {
        switch (rol) {
            case 'admin': return 'Administrador';
            case 'supervisor': return 'Supervisor';
            default: return 'Usuario';
        }
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
                    Lista de Usuarios
                </h2>
                <Button
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-100 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                >
                    <PlusIcon className="w-4 h-4" />
                    Nuevo Usuario
                </Button>
            </div>

            {/* Filtros */}
            <FiltrosUsuarios
                filtros={filtros}
                totalItems={totalItems}
                sedes={sedes}
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
                            {filtros.search || filtros.rol !== 'todos' || filtros.sede !== 'todos' || filtros.activo !== 'todos'
                                ? 'No se encontraron resultados con los filtros aplicados'
                                : 'No hay usuarios registrados'}
                        </div>
                    ) : (
                        datosPaginados.map((usuario) => (
                            <UsuarioCard
                                key={usuario.id_usuario}
                                usuario={usuario}
                                onEditar={handleOpenEditModal}
                                onEliminar={handleDeleteUsuario}
                                onActivar={handleActivateUsuario}
                                sedeNombre={sedes.find(s => s.id_sede === usuario.id_sede)?.nombre_sede || 'N/A'}
                                formatDate={formatDate}
                                getRolStyles={getRolStyles}
                                getRolLabel={getRolLabel}
                                getEstadoStyles={getEstadoStyles}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Vista de Tabla - SOLO para desktop (oculto en móvil) */}
            <div className="hidden lg:block overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center">ID</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center uppercase">Usuario</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center uppercase">Nombre</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center uppercase">Rol</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center uppercase">Sede</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center uppercase">Fecha Creación</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center uppercase">Estado</TableCell>
                                    <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center uppercase">Acciones</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="px-5 py-8 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : datosPaginados.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="px-5 py-8 text-center text-gray-500">
                                            No hay usuarios registrados
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    datosPaginados.map((usuario) => (
                                        <TableRow key={usuario.id_usuario}>
                                            <TableCell className="px-5 py-4 text-center">#{usuario.id_usuario}</TableCell>
                                            <TableCell className="px-5 py-4">
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {usuario.usuario}
                                                </p>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">{usuario.nombre}</TableCell>
                                            <TableCell className="px-5 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-md font-medium ${getRolStyles(usuario.rol)}`}>
                                                    {getRolLabel(usuario.rol)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                {sedes.find(s => s.id_sede === usuario.id_sede)?.nombre_sede || 'N/A'}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center dark:text-white">
                                                {formatDate(usuario.created_at)}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-md font-medium ${getEstadoStyles(usuario.activo)}`}>
                                                    {usuario.activo === 1 ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenEditModal(usuario)}
                                                        className="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                                                        title="Editar"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>

                                                    {usuario.activo === 1 ? (
                                                        <button
                                                            onClick={() => handleDeleteUsuario(usuario.id_usuario, usuario.nombre)}
                                                            className="rounded-lg border border-red-300 bg-red-50 p-1.5 text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400"
                                                            title="Inhabilitar"
                                                        >
                                                            <TrashBinIcon className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleActivateUsuario(usuario.id_usuario)}
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
            <CrearUsuarioModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleCreateUsuario}
                formErrors={formErrors}
                sedes={sedes}
                userRol="admin"
            />

            <EditarUsuarioModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedUsuario(null);
                    resetForm();
                }}
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleUpdateUsuario}
                formErrors={formErrors}
                usuario={selectedUsuario}
                sedes={sedes}
                userRol="admin"
            />
        </div>
    );
}