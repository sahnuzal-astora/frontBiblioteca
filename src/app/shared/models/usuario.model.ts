/**
 * Modelo para la entidad Usuario
 */
export interface Usuario {
  idusuario: number;          // 🟢 reemplaza 'id'
  nombre: string;
  email: string;
  telefono: string;           // 🟢 nuevo campo
  activo: boolean;
  es_admin: boolean;
}

/**
 * Modelo para crear un nuevo usuario
 */
export interface CreateUsuarioRequest {
  email: string;
  password: string;
  nombre: string;
  telefono: string;  // ← opcional
  esadmin: boolean;
  contrasena_hash: string; 
}


/**
 * Modelo para actualizar un usuario
 */
export interface UpdateUsuarioRequest {
  nombre: string;
  email: string;
  telefono: string;          // 🟢 nuevo campo
  activo: boolean;
  es_admin: boolean;          // 🟢 opcional para permitir cambio
}


/**
 * Modelo para filtros de usuarios
 */
export interface UsuarioFilters {
  email?: string;
  nombre?: string;
  telefono?: string;          // 🟢 nuevo filtro posible
  activo?: boolean | string;
}
