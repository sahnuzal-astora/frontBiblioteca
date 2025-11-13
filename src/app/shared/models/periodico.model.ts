/**
 * Modelo para la entidad periodico
 */
export interface Periodico {
  fecha_publicacion: string;
  producto_id: string;
  id_periodico: string;
  id_usuario_crea: string;
  id_usuario_edita?: string;
}

/**
 * Modelo para crear un nuevo periodico
 */
export interface CreatePeriodicoRequest {
    fecha_publicacion: string;
    producto_id: string;
    id_usuario_crea: string;
}

/**
 * Modelo para actualizar un periodico
 */
export interface UpdatePeriodicoRequest {
    fecha_publicacion?: string;
    id_usuario_edita: string;
}

/**
 * Modelo para filtros de periodicos
 */
export interface PeriodicoFilters {
    fecha_publicacion?: string;
    producto_id?: string;
}
