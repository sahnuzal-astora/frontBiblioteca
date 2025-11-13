/**
 * Modelo para la entidad Usuario
 */
export interface Usuario {
  id_usuario: string;          
  nombre: string;
  email: string;
  telefono: string;           
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
  telefono: string;  
  esadmin: boolean;
  contrasena_hash: string; 
}


/**
 * Modelo para actualizar un usuario
 */
export interface UpdateUsuarioRequest {
  nombre: string;
  email: string;
  telefono: string;          
  activo: boolean;
  es_admin: boolean;          
}


/**
 * Modelo para filtros de usuarios
 */
export interface UsuarioFilters {
  email?: string;
  nombre?: string;
  telefono?: string;          
  activo?: boolean | string;
}
