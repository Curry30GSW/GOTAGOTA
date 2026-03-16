import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import PageMeta from '../../components/common/PageMeta';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import Button from '../../components/ui/button/Button';
import { PencilIcon, TrashBinIcon, PlusIcon } from '../../icons';
import { Cliente, ClienteFormData, FiltrosClienteState } from '../../types/cliente';

// Importar componentes
import CrearClienteModal from '../../components/Modals/CrearClienteModal';
import EditarClienteModal from '../../components/Modals/EditarClienteModal';
import VerClienteModal from '../../components/Modals/VerClienteModal';
import EliminarClienteModal from '../../components/Modals/EliminarClienteModal';
import FiltrosClientes from '../../components/filtros/FiltrosClientes';
import Paginacion from '../../components/Paginacion/Paginacion';
import ClienteCard from '../../pages/Clientes/clienteCard';

const API_BASE_URL = 'https://api-integracion-movil.vercel.app/';
const ITEMS_PER_PAGE = 10;

export default function Clientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [cobradores, setCobradores] = useState<{ id_cobrador: number; nombre: string; apellidos: string }[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para filtros
    const [filtros, setFiltros] = useState<FiltrosClienteState>({
        search: '',
        estado: 'todos',
        id_cobrador: 'todos',
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
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

    // Form state
    const [formData, setFormData] = useState<ClienteFormData>({
        nombre: '',
        apellidos: '',
        celular: '',
        direccion: '',
        cedula: '',
        id_cobrador: 0
    });

    // Form errors
    const [formErrors, setFormErrors] = useState<Partial<ClienteFormData>>({});

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

    const mostrarConfirmacionEliminar = async (cliente: Cliente): Promise<boolean> => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            html: `
                <div class="text-left">
                    <p class="mb-2">Estás a punto de eliminar al cliente:</p>
                    <p class="font-bold text-red-600">${cliente.nombre} ${cliente.apellidos}</p>
                    <p class="text-sm text-gray-500 mt-2">Cédula: ${cliente.cedula}</p>
                    <p class="text-sm text-red-500 mt-4">¡Esta acción eliminará todos sus créditos asociados!</p>
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
    const fetchClientes = async () => {
        setLoading(true);
        try {

            const response = await fetch(`${API_BASE_URL}/clientes/`, {
                credentials: "include"
            });

            if (!response.ok) throw new Error('Error al cargar clientes');

            const data = await response.json();

            const clientesConCobrador = await Promise.all(
                data.data.map(async (cliente: any) => {

                    if (cliente.id_cobrador) {

                        try {

                            const cobradorRes = await fetch(`${API_BASE_URL}/cobradores/${cliente.id_cobrador}`, {
                                credentials: "include"
                            });

                            if (cobradorRes.ok) {
                                const cobradorData = await cobradorRes.json();

                                cliente.nombre_cobrador =
                                    `${cobradorData.data.nombre} ${cobradorData.data.apellidos}`;
                            }

                        } catch (error) {
                            console.error('Error al cargar cobrador:', error);
                        }

                    }

                    return cliente;

                })
            );

            setClientes(clientesConCobrador);

        } catch (err) {

            mostrarError(err instanceof Error ? err.message : 'Error al cargar clientes');

        } finally {

            setLoading(false);

        }
    };

    const fetchCobradores = async () => {

        try {

            const response = await fetch(`${API_BASE_URL}/cobradores/`, {
                credentials: "include"
            });

            if (!response.ok) throw new Error('Error al cargar cobradores');

            const data = await response.json();

            setCobradores(data.data.map((c: any) => ({
                id_cobrador: c.id_cobrador,
                nombre: c.nombre,
                apellidos: c.apellidos
            })));

        } catch (err) {

            console.error('Error al cargar cobradores:', err);

        }
    };

    useEffect(() => {
        fetchClientes();
        fetchCobradores();
    }, []);

    // Manejador de cambios en filtros
    const handleCambiarFiltro = (campo: keyof FiltrosClienteState, valor: any) => {
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
            id_cobrador: 'todos',
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
        let filtrados = [...clientes];

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

        if (filtros.id_cobrador !== 'todos') {
            filtrados = filtrados.filter(c => c.id_cobrador === filtros.id_cobrador);
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
    }, [clientes, filtros]);

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
        if (formErrors[name as keyof ClienteFormData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: Number(value) }));
        if (formErrors[name as keyof ClienteFormData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<ClienteFormData> = {};

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
        if (!formData.id_cobrador || formData.id_cobrador === 0) {
            errors.id_cobrador = 'Debe seleccionar un cobrador';
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
            cedula: '',
            id_cobrador: 0
        });
        setFormErrors({});
    };

    const handleOpenCreateModal = () => {
        resetForm();
        setIsCreateModalOpen(true);
    };

    const handleOpenViewModal = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setIsViewModalOpen(true);
    };

    const handleOpenEditModal = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setFormData({
            nombre: cliente.nombre,
            apellidos: cliente.apellidos,
            celular: cliente.celular,
            direccion: cliente.direccion || '',
            cedula: cliente.cedula,
            id_cobrador: cliente.id_cobrador
        });
        setFormErrors({});
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteModal = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setIsDeleteModalOpen(true);
    };

    const handleCreateCliente = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/clientes/`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear cliente');
            }

            mostrarExito('Cliente creado exitosamente');
            setIsCreateModalOpen(false);
            resetForm();
            fetchClientes();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al crear cliente');
        }
    };

    const handleUpdateCliente = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCliente) return;

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${selectedCliente.id_cliente}`, {
                method: 'PUT',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar cliente');
            }

            mostrarExito('Cliente actualizado exitosamente');
            setIsEditModalOpen(false);
            resetForm();
            setSelectedCliente(null);
            fetchClientes();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al actualizar cliente');
        }
    };

    const handleDeleteCliente = async () => {
        if (!selectedCliente) return;

        const confirmado = await mostrarConfirmacionEliminar(selectedCliente);

        if (!confirmado) return;

        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${selectedCliente.id_cliente}`, {
                method: 'DELETE',
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al eliminar cliente');
            }

            mostrarExito('Cliente eliminado exitosamente');
            setIsDeleteModalOpen(false);
            setSelectedCliente(null);
            fetchClientes();
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al eliminar cliente');
        }
    };

    const getNombreCobrador = (id_cobrador?: number): string => {
        if (!id_cobrador) return 'No asignado';
        const cobrador = cobradores.find(c => c.id_cobrador === id_cobrador);
        return cobrador ? `${cobrador.nombre} ${cobrador.apellidos}` : 'No asignado';
    };

    return (
        <>
            <PageMeta
                title="Clientes | Panel de Control"
                description="Gestión de clientes"
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Clientes
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Gestiona los clientes del sistema
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-100 px-4 py-2.5 text-sm font-medium text-blue-700 shadow-theme-xs transition-colors hover:bg-blue-200 hover:text-blue-800 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Nuevo Cliente
                    </Button>
                </div>

                {/* Filtros */}
                <FiltrosClientes
                    filtros={filtros}
                    totalClientes={totalItems}
                    cobradores={cobradores}
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
                                {filtros.search || filtros.estado !== 'todos' || filtros.id_cobrador !== 'todos' || filtros.fechaRegistroInicio
                                    ? 'No se encontraron resultados con los filtros aplicados'
                                    : 'No hay clientes registrados'}
                            </div>
                        ) : (
                            datosPaginados.map((cliente) => (
                                <ClienteCard
                                    key={cliente.id_cliente}
                                    cliente={cliente}
                                    onVer={handleOpenViewModal}
                                    onEditar={handleOpenEditModal}
                                    onEliminar={handleOpenDeleteModal}
                                    getNombreCobrador={getNombreCobrador}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Vista de Tabla - SOLO para desktop (oculto en móvil) */}
                <div className="hidden lg:block overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400">No.</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Nombre</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Apellidos</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Cédula</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Celular</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Cobrador</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Estado</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left text-gray-800 dark:text-gray-400 uppercase">Acciones</TableCell>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : datosPaginados.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                                                {filtros.search || filtros.estado !== 'todos' || filtros.id_cobrador !== 'todos' || filtros.fechaRegistroInicio
                                                    ? 'No se encontraron resultados con los filtros aplicados'
                                                    : 'No hay clientes registrados'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        datosPaginados.map((cliente) => (
                                            <TableRow
                                                key={cliente.id_cliente}
                                                className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                                            >
                                                <TableCell className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {cliente.id_cliente}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {cliente.nombre}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {cliente.apellidos}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {cliente.cedula}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {cliente.celular}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-md text-gray-800 dark:text-gray-200 align-middle">
                                                    {cliente.nombre_cobrador || getNombreCobrador(cliente.id_cobrador)}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-md align-middle">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-md font-medium ${cliente.activo === 1
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                                        }`}>
                                                        {cliente.activo === 1 ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-md align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleOpenViewModal(cliente)}
                                                            className="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 transition-colors"
                                                            title="Ver detalles"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                                                                <circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenEditModal(cliente)}
                                                            className="rounded-lg border border-gray-300 bg-white p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:border-gray-700 dark:bg-gray-800 dark:text-amber-400 dark:hover:bg-white/[0.03] dark:hover:text-amber-300 transition-colors"
                                                            title="Editar"
                                                        >
                                                            <PencilIcon className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenDeleteModal(cliente)}
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
            <CrearClienteModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                formData={formData}
                onChange={handleInputChange}
                onSelectChange={handleSelectChange}
                onSubmit={handleCreateCliente}
                formErrors={formErrors}
                cobradores={cobradores}
            />

            <EditarClienteModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                formData={formData}
                onChange={handleInputChange}
                onSelectChange={handleSelectChange}
                onSubmit={handleUpdateCliente}
                selectedCliente={selectedCliente}
                formErrors={formErrors}
                cobradores={cobradores}
            />

            <VerClienteModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                selectedCliente={selectedCliente}
                nombreCobrador={selectedCliente ? getNombreCobrador(selectedCliente.id_cobrador) : ''}
            />

            <EliminarClienteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteCliente}
                selectedCliente={selectedCliente}
            />
        </>
    );
}