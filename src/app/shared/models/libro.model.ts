/**
 * Modelo para la entidad libro
 */
export interface Libro {
  genero: string;
  paginas: number;
  producto_id: string;
  id_libro: string;
  id_usuario_crea: string;
  id_usuario_edita?: string;
  fecha_creacion?: string;
  fecha_edicion?: string;
}

/**
 * Modelo para crear un nuevo libro
 */
export interface CreateLibroRequest {
    genero: string;
    paginas: number;   
    producto_id: string;
    id_usuario_crea: string;
}

/**
 * Modelo para actualizar un libro
 */
export interface UpdateLibroRequest {
    genero?: string;
    paginas?: number;
    id_usuario_edita: string;
}

/**
 * Modelo para filtros de libros
 */
export interface LibroFilters {
    genero?: string;
    paginas?: number;
    paginas_min?: number;
    paginas_max?: number;
    producto_id?: string;
}
