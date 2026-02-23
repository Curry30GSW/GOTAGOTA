export interface Credito {
    id_credito: number;
    fecha_credito: string;
    fecha_pago: string;
    monto_prestado: number | string;
    monto_por_pagar: number | string;
    id_cliente: number;
    id_cobrador: number;
    estado: 'pendiente' | 'pagado' | 'castigado' | 'juridico';
    created_at: string;
    cliente_nombre?: string;
    cliente_apellidos?: string;
    cedula?: string;
    cobrador_nombre?: string;
    cobrador_apellidos?: string;
}

export interface CreditoFormData {
    id_cliente: number;
    id_cobrador: number;
    monto_prestado: number;
    numero_cuotas: number;
    fecha_credito: string;
}

export interface FiltrosCreditoState {
    search: string;
    estado: 'todos' | 'pendiente' | 'pagado' | 'castigado' | 'juridico';
    id_cliente: number | 'todos';
    id_cobrador: number | 'todos';
    fechaInicio: string;
    fechaFin: string;
    montoMinimo: string;
    montoMaximo: string;
    ordenFecha: 'asc' | 'desc';
    ordenMonto: 'asc' | 'desc' | '';
    filtroRapido: 'todos' | 'recientes' | 'antiguos' | 'mayor_monto' | 'menor_monto' | 'pendientes';
}

// Utilidades para formatear datos del crédito
export const formatMonto = (monto: number | string): number => {
    if (typeof monto === 'string') {
        return parseFloat(monto);
    }
    return monto;
};

export const getEstadoStyles = (estado: string) => {
    const styles = {
        pendiente: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
        pagado: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
        castigado: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
        juridico: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
    };
    return styles[estado as keyof typeof styles] || styles.pendiente;
};

export const getEstadoLabel = (estado: string): string => {
    const labels = {
        pendiente: 'Pendiente',
        pagado: 'Pagado',
        castigado: 'Castigado',
        juridico: 'Jurídico'
    };
    return labels[estado as keyof typeof labels] || estado;
};