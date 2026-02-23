import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import PageMeta from '../../components/common/PageMeta';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import Button from '../../components/ui/button/Button';
import { PlusIcon } from '../../icons';
import { Credito, CreditoFormData, FiltrosCreditoState, getEstadoLabel } from '../../types/credito';
import { Cobrador } from '../../types/cobrador';

// Importar componentes
import CrearCreditoModal from '../../components/Modals/CrearCreditoModal';
import VerCreditoModal from '../../components/Modals/VerCreditoModal';
import FiltrosCreditos from '../../components/filtros/FiltrosCreditos';
import Paginacion from '../../components/Paginacion/Paginacion';

const API_BASE_URL = 'http://localhost:3000/api';
const ITEMS_PER_PAGE = 10;

export default function Creditos() {
    const [creditos, setCreditos] = useState<Credito[]>([]);
    const [clientes, setClientes] = useState<{ id_cobrador: number; id_cliente: number; nombre: string; apellidos: string; cedula: string }[]>([]);
    const [cobradores, setCobradores] = useState<Cobrador[]>([]);
    const [loading, setLoading] = useState(true);


    // Estados para filtros
    const [filtros, setFiltros] = useState<FiltrosCreditoState>({
        search: '',
        estado: 'todos',
        id_cliente: 'todos',
        id_cobrador: 'todos',
        fechaInicio: '',
        fechaFin: '',
        montoMinimo: '',
        montoMaximo: '',
        ordenFecha: 'desc',
        ordenMonto: '',
        filtroRapido: 'todos'
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');

        // Array con los meses en español abreviado
        const months = [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ];

        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedCredito, setSelectedCredito] = useState<Credito | null>(null);

    // Form state
    const [formData, setFormData] = useState<CreditoFormData>({
        id_cliente: 0,
        monto_prestado: 0,
        numero_cuotas: 1,
        fecha_credito: new Date().toISOString().split('T')[0]
    });

    // Form errors
    const [formErrors, setFormErrors] = useState<Partial<CreditoFormData>>({});

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

    // Cargar datos
    const fetchCreditos = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/creditos/`);
            if (!response.ok) throw new Error('Error al cargar créditos');
            const data = await response.json();

            // Los créditos ya vienen con la información del cliente y cobrador
            // del JOIN en el backend (según el JSON que mostraste)
            const creditosConCliente = data.data.map((credito: any) => {
                // Asegurarse de que los datos del cliente estén presentes
                return {
                    ...credito,
                    cliente_nombre: credito.cliente_nombre || 'N/A',
                    cliente_apellidos: credito.cliente_apellidos || 'N/A',
                    cedula: credito.cedula || 'N/A',
                    cobrador_nombre: credito.cobrador_nombre || 'N/A',
                    cobrador_apellidos: credito.cobrador_apellidos || 'N/A'
                };
            });

            setCreditos(creditosConCliente);
        } catch (err) {
            mostrarError(err instanceof Error ? err.message : 'Error al cargar créditos');
        } finally {
            setLoading(false);
        }
    };

    const fetchClientes = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/`);
            if (!response.ok) throw new Error('Error al cargar clientes');
            const data = await response.json();
            setClientes(data.data.map((c: any) => ({
                id_cliente: c.id_cliente,
                nombre: c.nombre,
                apellidos: c.apellidos,
                cedula: c.cedula
            })));
        } catch (err) {
            console.error('Error al cargar clientes:', err);
        }
    };

    const fetchCobradores = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/cobradores/`);
            if (!response.ok) throw new Error('Error al cargar cobradores');
            const data = await response.json();
            // Mapear los datos al formato que necesita el modal
            const cobradoresMapeados = data.data.map((c: any) => ({
                id_cobrador: c.id_cobrador,
                nombre: c.nombre,
                apellidos: c.apellidos
            }));
            setCobradores(cobradoresMapeados);
        } catch (err) {
            console.error('Error al cargar cobradores:', err);
            mostrarError('Error al cargar la lista de cobradores');
        }
    };

    useEffect(() => {
        if (isCreateModalOpen) {
            fetchClientes();
            fetchCobradores();
        }
    }, [isCreateModalOpen]);

    useEffect(() => {
        fetchCreditos();
        fetchClientes();
        fetchCobradores();
    }, []);

    // Calcular valor de cuota
    const calcularValorCuota = (monto: number, cuotas: number): number => {
        if (monto <= 0 || cuotas <= 0) return 0;
        // Aquí puedes aplicar lógica de intereses si es necesario
        return Math.round(monto / cuotas);
    };

    // Manejador de cambios en filtros
    const handleCambiarFiltro = (campo: keyof FiltrosCreditoState, valor: any) => {
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
                    case 'mayor_monto':
                        nuevosFiltros.ordenMonto = 'desc';
                        break;
                    case 'menor_monto':
                        nuevosFiltros.ordenMonto = 'asc';
                        break;
                    case 'pendientes':
                        nuevosFiltros.estado = 'pendiente';
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
            id_cliente: 'todos',
            fechaInicio: '',
            fechaFin: '',
            montoMinimo: '',
            montoMaximo: '',
            ordenFecha: 'desc',
            ordenMonto: '',
            filtroRapido: 'todos'
        });
        setCurrentPage(1);
        mostrarAdvertencia('Filtros limpiados');
    };

    // Aplicar filtros a los datos
    const datosFiltrados = useMemo(() => {
        let filtrados = [...creditos];

        // Búsqueda por texto
        if (filtros.search) {
            const searchLower = filtros.search.toLowerCase();
            filtrados = filtrados.filter(c =>
                c.cliente_nombre?.toLowerCase().includes(searchLower) ||
                c.cliente_apellidos?.toLowerCase().includes(searchLower) ||
                c.cliente_cedula?.includes(filtros.search) ||
                c.id_credito.toString().includes(filtros.search)
            );
        }

        // Filtro por estado
        if (filtros.estado !== 'todos') {
            filtrados = filtrados.filter(c => c.estado === filtros.estado);
        }

        // Filtro por cliente
        if (filtros.id_cliente !== 'todos') {
            filtrados = filtrados.filter(c => c.id_cliente === filtros.id_cliente);
        }

        // Filtro por rango de montos
        if (filtros.montoMinimo) {
            const min = parseFloat(filtros.montoMinimo);
            filtrados = filtrados.filter(c => c.monto_prestado >= min);
        }
        if (filtros.montoMaximo) {
            const max = parseFloat(filtros.montoMaximo);
            filtrados = filtrados.filter(c => c.monto_prestado <= max);
        }

        // Filtro por rango de fechas
        if (filtros.fechaInicio && filtros.fechaFin) {
            const inicio = new Date(filtros.fechaInicio);
            const fin = new Date(filtros.fechaFin);
            filtrados = filtrados.filter(c => {
                const fecha = new Date(c.fecha_credito);
                return fecha >= inicio && fecha <= fin;
            });
        }

        // Ordenamiento
        if (filtros.ordenMonto) {
            filtrados.sort((a, b) => {
                return filtros.ordenMonto === 'asc'
                    ? a.monto_prestado - b.monto_prestado
                    : b.monto_prestado - a.monto_prestado;
            });
        } else if (filtros.ordenFecha) {
            filtrados.sort((a, b) => {
                const fechaA = new Date(a.fecha_credito).getTime();
                const fechaB = new Date(b.fecha_credito).getTime();
                return filtros.ordenFecha === 'asc'
                    ? fechaA - fechaB
                    : fechaB - fechaA;
            });
        }

        return filtrados;
    }, [creditos, filtros]);

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
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('monto') ? parseFloat(value) || 0 :
                name === 'numero_cuotas' ? parseInt(value) || 1 : value
        }));
        if (formErrors[name as keyof CreditoFormData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: Number(value) }));
        if (formErrors[name as keyof CreditoFormData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<CreditoFormData> = {};

        if (!formData.id_cliente || formData.id_cliente === 0) {
            errors.id_cliente = 'Debe seleccionar un cliente';
        }
        if (!formData.id_cobrador || formData.id_cobrador === 0) {
            errors.id_cobrador = 'Debe seleccionar un cobrador';
        }
        if (!formData.monto_prestado || formData.monto_prestado < 10000) {
            errors.monto_prestado = 'El monto debe ser mayor a $10.000';
        }
        if (!formData.numero_cuotas || formData.numero_cuotas < 1) {
            errors.numero_cuotas = 'El número de cuotas debe ser al menos 1';
        }
        if (!formData.fecha_credito) {
            errors.fecha_credito = 'La fecha es requerida';
        }

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            mostrarError('Por favor, completa correctamente todos los campos requeridos');
        }

        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            id_cliente: 0,
            monto_prestado: 0,
            numero_cuotas: 1,
            fecha_credito: new Date().toISOString().split('T')[0]
        });
        setFormErrors({});
    };

    const handleOpenCreateModal = () => {
        resetForm();
        setIsCreateModalOpen(true);
    };

    const handleOpenViewModal = (credito: Credito) => {
        setSelectedCredito(credito);
        setIsViewModalOpen(true);
    };

    const handleCreateCredito = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            // Calcular montos usando la MISMA fórmula que en el modal
            const tasaInteres = 30; // 30% mensual
            const monto = formData.monto_prestado;
            const cuotas = formData.numero_cuotas;

            // Interés simple mensual
            const interesTotal = monto * (tasaInteres / 100) * cuotas;
            const montoPorPagar = monto + interesTotal;

            // Calcular fecha de pago (1 mes después)
            const fecha = new Date(formData.fecha_credito);
            fecha.setMonth(fecha.getMonth() + 1);
            const fechaPago = fecha.toISOString().split('T')[0];

            // IMPORTANTE: Redondear a 2 decimales para evitar problemas con decimales
            const montoPorPagarRedondeado = Math.round(montoPorPagar * 100) / 100;

            console.log('Enviando crédito:', {
                fecha_credito: formData.fecha_credito,
                fecha_pago: fechaPago,
                monto_prestado: monto,
                monto_por_pagar: montoPorPagarRedondeado,
                id_cliente: formData.id_cliente,
                id_cobrador: formData.id_cobrador,
                estado: 'pendiente'
            });

            const response = await fetch(`${API_BASE_URL}/creditos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fecha_credito: formData.fecha_credito,
                    fecha_pago: fechaPago,
                    monto_prestado: monto,
                    monto_por_pagar: montoPorPagarRedondeado,
                    id_cliente: formData.id_cliente,
                    id_cobrador: formData.id_cobrador,
                    estado: 'pendiente'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear crédito');
            }

            mostrarExito('Crédito creado exitosamente');
            setIsCreateModalOpen(false);
            resetForm();
            fetchCreditos();
        } catch (err) {
            console.error('Error al crear crédito:', err);
            mostrarError(err instanceof Error ? err.message : 'Error al crear crédito');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getEstadoStyles = (estado: string) => {
        const styles = {
            pendiente: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
            pagado: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
            castigado: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
            juridico: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
        };
        return styles[estado as keyof typeof styles] || styles.pendiente;
    };

    const getNombreCliente = (credito: Credito): string => {
        if (credito.cliente_nombre && credito.cliente_apellidos) {
            return `${credito.cliente_nombre} ${credito.cliente_apellidos}`;
        }
        const cliente = clientes.find(c => c.id_cliente === credito.id_cliente);
        return cliente ? `${cliente.nombre} ${cliente.apellidos}` : `Cliente ID: ${credito.id_cliente}`;
    };

    return (
        <>
            <PageMeta
                title="Créditos | Panel de Control"
                description="Gestión de créditos"
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Créditos
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Gestiona los créditos del sistema
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-100 px-4 py-2.5 text-sm font-medium text-blue-700 shadow-theme-xs transition-colors hover:bg-blue-200 hover:text-blue-800 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Nuevo Crédito
                    </Button>
                </div>

                {/* Filtros */}
                <FiltrosCreditos
                    filtros={filtros}
                    totalCreditos={totalItems}
                    clientes={clientes}
                    onCambiarFiltro={handleCambiarFiltro}
                    onLimpiarFiltros={handleLimpiarFiltros}
                />

                {/* Tabla de créditos */}
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400">No.</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Cliente</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Cobrador</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Monto</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Monto a Pagar</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Fecha Credito</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Fecha Pago</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Estado</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center text-gray-800 dark:text-gray-400 uppercase">Acciones</TableCell>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {creditos.map((credito) => {
                                        const montoPrestado = typeof credito.monto_prestado === 'string'
                                            ? parseFloat(credito.monto_prestado)
                                            : credito.monto_prestado;

                                        const montoPorPagar = typeof credito.monto_por_pagar === 'string'
                                            ? parseFloat(credito.monto_por_pagar)
                                            : credito.monto_por_pagar;

                                        return (
                                            <TableRow key={credito.id_credito}>
                                                <TableCell className="px-5 py-4">
                                                    #{credito.id_credito}
                                                </TableCell>
                                                <TableCell className="px-5 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-800 whitespace-nowrap dark:text-white">
                                                            {credito.cliente_nombre} {credito.cliente_apellidos}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            C.C. {credito.cedula}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-4">
                                                    <div>
                                                        <p className="font-medium whitespace-nowrap text-gray-800 dark:text-white">
                                                            {credito.cobrador_nombre} {credito.cobrador_apellidos}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-4">
                                                    <p className="font-medium text-gray-800 dark:text-white">
                                                        {formatCurrency(montoPrestado)}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="px-5 py-4">
                                                    <p className="text-blue-600 text-center dark:text-blue-400 font-medium">
                                                        {formatCurrency(montoPorPagar)}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center dark:text-white">
                                                    {formatDate(credito.fecha_credito)}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center dark:text-white">
                                                    {formatDate(credito.fecha_pago)}
                                                </TableCell>
                                                <TableCell className="px-5 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-md font-medium ${getEstadoStyles(credito.estado)}`}>
                                                        {getEstadoLabel(credito.estado)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center align-middle">
                                                    <div className="flex justify-center items-center">
                                                        <button
                                                            onClick={() => handleOpenViewModal(credito)}
                                                            className="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 transition-colors"
                                                            title="Ver detalles"
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
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5 c4.477 0 8.268 2.943 9.542 7 -1.274 4.057-5.065 7-9.542 7 -4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
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
            <CrearCreditoModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                formData={formData}
                onChange={handleInputChange}
                onSelectChange={handleSelectChange}
                onSubmit={handleCreateCredito}
                formErrors={formErrors}
                clientes={clientes}
                cobradores={cobradores}
                calcularValorCuota={calcularValorCuota}
            />

            <VerCreditoModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                selectedCredito={selectedCredito}
                nombreCliente={selectedCredito ? getNombreCliente(selectedCredito) : ''}
            />
        </>
    );
}