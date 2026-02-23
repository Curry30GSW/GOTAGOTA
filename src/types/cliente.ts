export interface Cliente {
    id_cliente: number;
    nombre: string;
    apellidos: string;
    celular: string;
    direccion?: string;
    cedula: string;
    id_cobrador: number;
    activo: number;
    created_at?: string;
    nombre_cobrador?: string;
}

export interface ClienteFormData {
    nombre: string;
    apellidos: string;
    celular: string;
    direccion: string;
    cedula: string;
    id_cobrador: number;
}

export interface FiltrosClienteState {
    search: string;
    estado: 'todos' | 'activos' | 'inactivos';
    id_cobrador: number | 'todos';
    fechaRegistroInicio: string;
    fechaRegistroFin: string;
    ordenFecha: 'asc' | 'desc';
    ordenNombre: 'asc' | 'desc' | '';
    ordenCedula: 'asc' | 'desc' | '';
    filtroRapido: 'todos' | 'recientes' | 'antiguos' | 'sin_direccion';
}