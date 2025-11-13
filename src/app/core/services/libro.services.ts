import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Libro,
  CreateLibroRequest,
  UpdateLibroRequest,
  LibroFilters
} from '../../shared/models/libro.model';

import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '../models/api-response.model';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private readonly endpoint = '/libro';

  constructor(private apiService: ApiService) {}

  /**
   *  Obtiene todos los libros con paginación y filtros
   */
  getLibros(
    pagination: PaginationParams,
    filters?: LibroFilters
  ): Observable<PaginatedResponse<Libro>> {
    return this.apiService.getPaginated<Libro>(this.endpoint, pagination, filters);
  }

  /**
   *  Obtiene un libro por ID
   */
  getLibroById(id: string): Observable<ApiResponse<Libro>> {
    return this.apiService.get<Libro>(`${this.endpoint}/${id}`);
  }

  /**
   *  Crea un nuevo libro
   */
  createLibro(data: CreateLibroRequest): Observable<ApiResponse<Libro>> {
    return this.apiService.post<Libro>(this.endpoint, data);
  }

  /**
   *  Actualiza un libro existente
   */
  updateLibro(id: string, data: UpdateLibroRequest): Observable<ApiResponse<Libro>> {
    return this.apiService.put<Libro>(`${this.endpoint}/${id}`, data);
  }

  /**
   *  Elimina un libro
   */
  deleteLibro(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
