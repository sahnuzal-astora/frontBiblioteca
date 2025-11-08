/**
 * Modelo para la entidad Producto
 */
export interface Producto {
  id: number;
  titulo: string;
  autor: string;
  anio:Date;
  disponible: boolean;
}

/**
 * Modelo para crear un nuevo producto
 */
export interface CreateProductoRequest {
  autor: string;
  anio: Date;
  titulo: string;
  disponible: boolean;
  id_usuario_crea: number;
}

/**
 * Modelo para actualizar un producto
 */
export interface UpdateProductoRequest {
  titulo: string;
  autor: string;
  anio: Date;
  disponible: boolean;
  id_usuario_edita: number;
}

/**
 * Modelo para filtros de productos
 */
export interface ProductoFilters {
  nombre?: string;
  categoria_id?: number;
  precio_min?: number;
  precio_max?: number;
  stock_min?: number;
  activo?: boolean;
  fecha_desde?: string;
  fecha_hasta?: string;
}
