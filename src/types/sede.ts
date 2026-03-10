export interface Sede {
    id_sede: number;
    nombre_sede: string;
    direccion: string;
    telefono: string;
    created_at: string;
    activo: number;
}

export interface SedeFormData {
    nombre_sede: string;
    direccion: string;
    telefono: string;
}

export interface FiltrosSedeState {
    search: string;
    activo: string; // 'todos', 'activo', 'inactivo'
    ordenNombre: string; // 'asc' o 'desc'
}