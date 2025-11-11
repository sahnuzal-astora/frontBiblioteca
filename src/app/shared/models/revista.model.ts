/**
 * Modelo para la entidad revitas
 */
export interface Revista {
  edicion: string;
  producto_id: string;
  id_revista: string;
  id_usuario_crea: string;
  id_usuario_edita?: string;
}

/**
 * Modelo para crear un nuevo revista
 */
export interface CreateRevistaRequest {
    edicion: string;
    producto_id: string;
    id_usuario_crea: string;
}

/**
 * Modelo para actualizar un revista
 */
export interface UpdateRevistaRequest {
    edicion?: string;
    id_usuario_edita: string;
}

/**
 * Modelo para filtros de revistas
 */
export interface RevistaFilters {
    edicion?: string;
    producto_id?: string;
}
