import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface CobradorData {
    id_cobrador: number;
    nombre: string;
    apellidos: string;
    total_clientes: number;
    total_creditos: number;
    creditos_pendientes: number | string; // Puede venir como string
    monto_total_gestionado: number | string;
}

interface EstadisticasCobradoresChartProps {
    cobradores: CobradorData[];
    formatCurrency: (amount: number) => string;
}

export default function EstadisticasCobradoresChart({ cobradores, formatCurrency }: EstadisticasCobradoresChartProps) {

    // Función para convertir a número de forma segura
    const toNumber = (value: number | string | undefined): number => {
        if (value === undefined || value === null) return 0;
        return typeof value === 'string' ? parseFloat(value) || 0 : value;
    };

    // Procesar datos de cobradores asegurando que sean números
    const cobradoresProcesados = cobradores.map(c => ({
        ...c,
        total_clientes: toNumber(c.total_clientes),
        total_creditos: toNumber(c.total_creditos),
        creditos_pendientes: toNumber(c.creditos_pendientes),
        monto_total_gestionado: toNumber(c.monto_total_gestionado)
    }));

    // Top 5 cobradores por créditos gestionados
    const topCobradores = [...cobradoresProcesados]
        .sort((a, b) => (b.total_creditos || 0) - (a.total_creditos || 0))
        .slice(0, 5);

    const nombresCobradores = topCobradores.map(c => {
        const nombreCompleto = `${c.nombre} ${c.apellidos}`;
        return nombreCompleto.length > 15 ? nombreCompleto.substring(0, 15) + '...' : nombreCompleto;
    });

    const creditosData = topCobradores.map(c => c.total_creditos || 0);
    const clientesData = topCobradores.map(c => c.total_clientes || 0);

    // Gráfico de barras - Top cobradores
    const barOptions: ApexOptions = {
        colors: ["#3B82F6", "#10B981"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "bar",
            height: 350,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                borderRadius: 5,
                borderRadiusApplication: "end",
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
        },
        xaxis: {
            categories: nombresCobradores,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    fontSize: "11px",
                    colors: "#6B7280",
                },
            },
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "left",
            fontFamily: "Outfit",
        },
        yaxis: {
            title: {
                text: undefined,
            },
            labels: {
                style: {
                    fontSize: "11px",
                    colors: ["#6B7280"],
                },
            },
        },
        grid: {
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        tooltip: {
            y: {
                formatter: (val: number) => val.toString(),
            },
        },
    };

    const barSeries = [
        {
            name: "Créditos",
            data: creditosData,
        },
        {
            name: "Clientes",
            data: clientesData,
        },
    ];

    // Calcular distribución global de créditos CORREGIDO
    const totalPendientes = cobradoresProcesados.reduce((sum, c) => sum + (c.creditos_pendientes || 0), 0);
    const totalCreditos = cobradoresProcesados.reduce((sum, c) => sum + (c.total_creditos || 0), 0);
    const totalPagados = totalCreditos - totalPendientes;

    // Calcular porcentajes
    const porcentajePendientes = totalCreditos > 0 ? Math.round((totalPendientes / totalCreditos) * 100) : 0;
    const porcentajePagados = totalCreditos > 0 ? Math.round((totalPagados / totalCreditos) * 100) : 0;

    console.log('Debug - Totales:', {
        totalCreditos,
        totalPendientes,
        totalPagados,
        porcentajePendientes,
        porcentajePagados
    });

    // Opciones para gráfico de pastel
    const pieOptions: ApexOptions = {
        chart: {
            type: "pie",
            height: 350,
            fontFamily: "Outfit, sans-serif",
            toolbar: {
                show: false,
            },
        },
        labels: ["Créditos Pendientes", "Créditos Pagados"],
        colors: ["#F59E0B", "#10B981"],
        legend: {
            position: "bottom",
            fontFamily: "Outfit",
            fontSize: "14px",
            markers: {
                width: 12,
                height: 12,
                radius: 12,
            },
            itemMargin: {
                horizontal: 10,
                vertical: 5,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => `${val.toFixed(1)}%`,
            style: {
                fontSize: '14px',
                fontFamily: 'Outfit',
                fontWeight: 'bold',
                colors: ["#fff"],
            },
            dropShadow: {
                enabled: false,
            },
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} créditos (${((val / totalCreditos) * 100).toFixed(1)}%)`,
            },
        },
        plotOptions: {
            pie: {
                expandOnClick: true,
                dataLabels: {
                    offset: 0,
                    minAngleToShowLabel: 10,
                },
            },
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    height: 300,
                },
                legend: {
                    position: 'bottom',
                },
            },
        }],
    };

    const pieSeries = [totalPendientes, totalPagados];

    // Gráfico de barras horizontales - Montos gestionados
    const montosData = topCobradores.map(c => c.monto_total_gestionado || 0);
    const montosLabels = topCobradores.map(c => {
        const nombreCompleto = `${c.nombre} ${c.apellidos}`;
        return nombreCompleto.length > 20 ? nombreCompleto.substring(0, 20) + '...' : nombreCompleto;
    });

    const montosOptions: ApexOptions = {
        colors: ["#8B5CF6"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "bar",
            height: 350,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 5,
                borderRadiusApplication: "end",
                barHeight: '70%',
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => formatCurrency(val),
            style: {
                fontSize: '11px',
                fontFamily: 'Outfit',
                colors: ["#304758"],
            },
            background: {
                enabled: true,
                foreColor: '#fff',
                borderRadius: 2,
                padding: 4,
                opacity: 0.8,
                borderWidth: 1,
                borderColor: '#fff',
            },
        },
        xaxis: {
            categories: montosLabels,
            labels: {
                style: {
                    fontSize: "11px",
                    fontFamily: 'Outfit',
                    colors: "#6B7280",
                },
                formatter: (val: string) => val,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "11px",
                    fontFamily: 'Outfit',
                    colors: ["#6B7280"],
                },
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: false,
                },
            },
        },
        tooltip: {
            y: {
                formatter: (val: number) => formatCurrency(val),
            },
        },
    };

    const montosSeries = [
        {
            name: "Monto Gestionado",
            data: montosData,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Primera fila de gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Cobradores por Créditos */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Top 5 Cobradores por Créditos Gestionados
                    </h3>
                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[500px]">
                            <Chart
                                options={barOptions}
                                series={barSeries}
                                type="bar"
                                height={350}
                            />
                        </div>
                    </div>
                </div>

                {/* Distribución Global de Créditos */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Distribución Global de Créditos
                    </h3>

                    {totalCreditos === 0 ? (
                        <div className="h-[350px] flex items-center justify-center text-gray-500">
                            No hay créditos registrados
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            {/* Tarjetas de resumen */}
                            <div className="grid grid-cols-2 gap-4 w-full mb-6">
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Pendientes</p>
                                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                                        {totalPendientes}
                                    </p>
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                        {porcentajePendientes}%
                                    </p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                                    <p className="text-sm text-green-600 dark:text-green-400">Pagados</p>
                                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                        {totalPagados}
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                        {porcentajePagados}%
                                    </p>
                                </div>
                            </div>

                            {/* Gráfico de pastel */}
                            <div className="w-full max-w-[400px]">
                                <Chart
                                    options={pieOptions}
                                    series={pieSeries}
                                    type="pie"
                                    height={300}
                                />
                            </div>

                            {/* Total */}
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Total de créditos: <span className="font-semibold text-gray-800 dark:text-white">{totalCreditos}</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Segunda fila - Montos Gestionados */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Top 5 Cobradores por Monto Gestionado
                    </h3>
                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[600px]">
                            <Chart
                                options={montosOptions}
                                series={montosSeries}
                                type="bar"
                                height={350}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}