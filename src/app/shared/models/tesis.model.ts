/**
 * Modelo para la entidad tesis
 */
export interface Tesis {
  universidad: string;
  grado_academico: string;
  director: string;
  producto_id: string;
  id_tesis: string;
  id_usuario_crea: string;
  id_usuario_edita?: string;
}

/**
 * Modelo para crear un nuevo tesis
 */
export interface CreateTesisRequest {
    universidad: string;  
    director: string;
    grado_academico: string;
    producto_id: string;
    id_usuario_crea: string;
}

/**
 * Modelo para actualizar un tesis
 */
export interface UpdateTesisRequest {
    universidad?: string;
    director?: string;
    grado_academico?: string;
    id_usuario_edita: string;
}

/**
 * Modelo para filtros de tesis
 */
export interface TesisFilters {
    universidad?: string;
    director?: string;
    grado_academico?: string;
    producto_id?: string;
}
