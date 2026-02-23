export interface Cobrador {
    id_cobrador: number;
    nombre: string;
    apellidos: string;
    celular: string;
    direccion?: string;
    cedula: string;
    activo: number;
    created_at?: string;
}

export interface CobradorFormData {
    nombre: string;
    apellidos: string;
    celular: string;
    direccion: string;
    cedula: string;
}


export interface FiltrosCobradorState {
    search: string;
    estado: 'todos' | 'activos' | 'inactivos';
    fechaRegistroInicio: string;
    fechaRegistroFin: string;
    ordenFecha: 'asc' | 'desc';
    ordenNombre: 'asc' | 'desc' | '';
    ordenCedula: 'asc' | 'desc' | '';
    filtroRapido: 'todos' | 'recientes' | 'antiguos' | 'sin_direccion';
}