/**
 * Modelo para la entidad Préstamo
 */
export interface Prestamo {
  id_prestamo: string;
  usuario_id: string;
  producto_id: string;
  fecha_prestamo: string; // ISO string (ej. "2025-11-08T22:27:34.941Z")
  devuelto: boolean;
}

/**
 * Modelo para filtros de préstamos
 */
export interface PrestamoFilters {
  usuario_id?: string;
  producto_id?: string;
  devuelto?: boolean;
  fecha_desde?: string;
  fecha_hasta?: string;
}
