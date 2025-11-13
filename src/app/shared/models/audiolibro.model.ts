/**
 * Modelo para la entidad Audiolibro
 */
export interface Audiolibro {
  narrador: string;
  duracion: number;
  formato: string;
  producto_id: string;
  id_audiolibro: string;
  id_usuario_crea: string;
  id_usuario_edita?: string;
}

/**
 * Modelo para crear un nuevo Audiolibro
 */
export interface CreateAudiolibroRequest {
    narrador: string;
    duracion: number;   
    formato: string;
    producto_id: string;
    id_usuario_crea: string;
}

/**
 * Modelo para actualizar un Audiolibro
 */
export interface UpdateAudiolibroRequest {
    narrador?: string;
    duracion?: number;
    formato?: string;
    id_usuario_edita: string;
}

/**
 * Modelo para filtros de Audiolibros
 */
export interface AudiolibroFilters {
    narrador?: string;
    formato?: string;
    duracion_min?: number;
    duracion_max?: number;
    producto_id?: string;
}
