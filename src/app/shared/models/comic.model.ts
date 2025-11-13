/**
 * Modelo para la entidad Comic
 */
export interface Comic {
  ilustrador: string;
  editorial: string;
  volumen: string;
  producto_id: string;
  id_comic: string;
  id_usuario_crea: string;
  id_usuario_edita?: string;
}

/**
 * Modelo para crear un nuevo Comic
 */
export interface CreateComicRequest {
    ilustrador: string;
    editorial: string;   
    volumen: string;
    producto_id: string;
    id_usuario_crea: string;
}

/**
 * Modelo para actualizar un Comic
 */
export interface UpdateComicRequest {
    ilustrador?: string;
    editorial?: string;
    volumen?: string;
    id_usuario_edita: string;
}

/**
 * Modelo para filtros de Comics
 */
export interface ComicFilters {
    ilustrador?: string;
    editorial?: string;
    producto_id?: string;
}
