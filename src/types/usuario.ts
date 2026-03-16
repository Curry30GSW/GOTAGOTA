export interface Usuario {
    id_usuario: number;           // ← Cambiar de 'id' a 'id_usuario' para coincidir con el backend
    usuario: string;
    nombre: string;
    rol: string;
    id_sede: number;               // ← El ID de la sede viene aparte
    nombre_sede?: string;          // ← El nombre de la sede viene aparte (opcional)
    activo: number;
    created_at: string;            // ← Fecha de creación (¡esto es lo que falta!)
    updated_at?: string;           // ← Fecha de actualización (opcional)
}

export interface UsuarioFormData {
    usuario: string;
    contraseña?: string;
    nombre: string;
    rol: string;
    id_sede: number;

}

export interface FiltrosUsuarioState {
    search: string;
    rol: string;
    sede: string;
    activo: string;
    ordenNombre: string;
}