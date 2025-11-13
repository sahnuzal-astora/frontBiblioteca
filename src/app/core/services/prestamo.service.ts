import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo, PrestamoFilters } from '../../shared/models/prestamo.models';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private readonly endpoint = '/prestamo';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todos los préstamos con paginación y filtros opcionales
   */
  getPrestamos(pagination: PaginationParams, filters?: PrestamoFilters): Observable<PaginatedResponse<Prestamo>> {
    return this.apiService.getPaginated<Prestamo>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene un préstamo por su ID
   */
  getPrestamoById(id: string): Observable<ApiResponse<Prestamo>> {
    return this.apiService.get<Prestamo>(`${this.endpoint}/${id}`);
  }
}
