/**
 * Modelo para la entidad mapa
 */
export interface Mapa {
  region: string;
  escala: string;
  tipo: string;
  producto_id: string;
  id_mapa: string;
  id_usuario_crea: string;
  id_usuario_edita?: string;
}

/**
 * Modelo para crear un nuevo mapa
 */
export interface CreateMapaRequest {
    region: string;
    escala: string;   
    tipo: string;
    producto_id: string;
    id_usuario_crea: string;
}

/**
 * Modelo para actualizar un mapa
 */
export interface UpdateMapaRequest {
    region?: string;
    escala ?: string;
    tipo?: string;
    id_usuario_edita: string;
}

/**
 * Modelo para filtros de Mapa
 */
export interface MapaFilters {
    region?: string;
    escala?: string;
    tipo?: string;
    producto_id?: string;
}
