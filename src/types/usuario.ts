export interface Usuario {
    id_usuario: number;
    usuario: string;
    nombre: string;
    rol: string;
    activo: number;
    created_at?: string;
}

export interface UsuarioFormData {
    usuario: string;
    contraseña?: string;
    nombre: string;
    rol: string;
    activo?: number;
}

export interface FiltrosUsuarioState {
    search: string;
    rol: string;
    estado: string;
    ordenNombre: string;
    ordenUsuario: string;
    ordenFecha: string;
    filtroRapido: string;
}