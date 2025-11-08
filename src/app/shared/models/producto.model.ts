/**
 * Modelo para la entidad Producto
 */
export interface Producto {
  id_producto: string;
  titulo: string;
  autor: string;
  anio:number;
  disponible: boolean;
}

/**
 * Modelo para crear un nuevo producto
 */
export interface CreateProductoRequest {
  autor: string;
  anio: number;
  titulo: string;
  disponible: boolean;
  id_usuario_crea: string;
}

/**
 * Modelo para actualizar un producto
 */
export interface UpdateProductoRequest {
  titulo?: string;
  autor?: string;
  anio?: number;
  disponible?: boolean;
  id_usuario_edita: string;
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
