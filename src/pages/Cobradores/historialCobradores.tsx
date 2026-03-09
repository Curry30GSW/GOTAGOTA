import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import PageMeta from '../../components/common/PageMeta';
import Button from '../../components/ui/button/Button';
import EstadisticasCobradoresChart from './EstadisticasCobradorChart';
import CobradorDashboardCard from './CobradorDashboardCard';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';

const API_BASE_URL = 'http://localhost:3000/api';

interface CobradorEstadisticas {
    id_cobrador: number;
    nombre: string;
    apellidos: string;
    cedula: string;
    celular: string;
    activo: number;
    total_clientes: number;
    total_creditos: number;
    creditos_pendientes: number;
    monto_total_gestionado: number;
}

export default function DashboardCobradores() {
    const navigate = useNavigate();
    const [cobradores, setCobradores] = useState<CobradorEstadisticas[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Función para convertir a número de forma segura
    const toNumber = (value: number | string | undefined | null): number => {
        if (value === undefined || value === null) return 0;
        if (typeof value === 'string') {
            const cleaned = value.replace(/[^\d.-]/g, '');
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) ? 0 : parsed;
        }
        return value;
    };

    const formatCurrency = (amount: number | string) => {
        const numAmount = toNumber(amount);
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numAmount);
    };

    useEffect(() => {
        fetchCobradoresEstadisticas();
    }, []);

    const fetchCobradoresEstadisticas = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/cobradores/estadisticas/all`);
            if (!response.ok) throw new Error('Error al cargar datos');
            const data = await response.json();

            const cobradoresProcesados = data.data.map((c: any) => ({
                ...c,
                total_clientes: toNumber(c.total_clientes),
                total_creditos: toNumber(c.total_creditos),
                creditos_pendientes: toNumber(c.creditos_pendientes),
                monto_total_gestionado: toNumber(c.monto_total_gestionado)
            }));

            setCobradores(cobradoresProcesados);
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las estadísticas',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    const cobradoresFiltrados = cobradores.filter(cobrador => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            cobrador.nombre.toLowerCase().includes(search) ||
            cobrador.apellidos.toLowerCase().includes(search) ||
            cobrador.cedula.includes(search)
        );
    });

    // Calcular totales para el dashboard
    const totales = {
        total_cobradores: cobradores.length,
        total_clientes: cobradores.reduce((sum, c) => sum + (c.total_clientes as number), 0),
        total_creditos: cobradores.reduce((sum, c) => sum + (c.total_creditos as number), 0),
        total_pendientes: cobradores.reduce((sum, c) => sum + (c.creditos_pendientes as number), 0),
        total_gestionado: cobradores.reduce((sum, c) => sum + (c.monto_total_gestionado as number), 0)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <>
            <PageMeta
                title="Dashboard de Cobradores"
                description="Estadísticas y gestión de cobradores"
            />

            <div className="space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Dashboard de Cobradores
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Visualiza estadísticas y rendimiento de todos los cobradores
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate('/cobradores')}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-100 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                    >
                        Ver lista de cobradores
                    </Button>
                </div>

                {/* Tarjetas de resumen general */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-xl p-5">
                        <p className="text-sm text-blue-600 dark:text-blue-400">Total Cobradores</p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totales.total_cobradores}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 rounded-xl p-5">
                        <p className="text-sm text-purple-600 dark:text-purple-400">Total Clientes</p>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{totales.total_clientes}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/30 rounded-xl p-5">
                        <p className="text-sm text-indigo-600 dark:text-indigo-400">Total Créditos</p>
                        <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{totales.total_creditos}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/30 rounded-xl p-5">
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">Créditos Pendientes</p>
                        <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{totales.total_pendientes}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-xl p-5">
                        <p className="text-sm text-green-600 dark:text-green-400">Total Gestionado</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">{formatCurrency(totales.total_gestionado)}</p>
                    </div>
                </div>

                {/* Gráficos */}
                <EstadisticasCobradoresChart
                    cobradores={cobradores}
                    formatCurrency={formatCurrency}
                />

                {/* Buscador */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Buscar cobrador por nombre o cédula..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                {/* VISTA DE TARJETAS - Solo para móvil/tablet */}
                <div className="block lg:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {cobradoresFiltrados.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No hay cobradores para mostrar
                            </div>
                        ) : (
                            cobradoresFiltrados.map((cobrador) => (
                                <CobradorDashboardCard
                                    key={cobrador.id_cobrador}
                                    cobrador={cobrador}
                                    formatCurrency={formatCurrency}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* VISTA DE TABLA - Solo para desktop */}
                <div className="hidden lg:block overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-left">Cobrador</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center">Cédula</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center">Clientes</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center">Créditos</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center">Pendientes</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center">Monto Gestionado</TableCell>
                                        <TableCell isHeader className="px-5 py-4 text-lg font-bold text-center">Acciones</TableCell>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {cobradoresFiltrados.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="px-5 py-8 text-center text-gray-500">
                                                No hay cobradores para mostrar
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        cobradoresFiltrados.map((cobrador) => (
                                            <TableRow key={cobrador.id_cobrador}>
                                                <TableCell className="px-5 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-800 dark:text-white">
                                                            {cobrador.nombre} {cobrador.apellidos}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{cobrador.celular}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center">
                                                    {cobrador.cedula}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center">
                                                    <span className="font-semibold text-blue-600">
                                                        {cobrador.total_clientes}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center">
                                                    <span className="font-semibold text-indigo-600">
                                                        {cobrador.total_creditos}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center">
                                                    <span className="font-semibold text-yellow-600">
                                                        {cobrador.creditos_pendientes}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center">
                                                    <span className="font-semibold text-green-600">
                                                        {formatCurrency(cobrador.monto_total_gestionado)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center">
                                                    <button
                                                        onClick={() => navigate(`/cobradores/${cobrador.id_cobrador}/creditos`)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                    >
                                                        Ver detalles
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}