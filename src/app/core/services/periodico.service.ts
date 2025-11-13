import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Periodico,
  CreatePeriodicoRequest,
  UpdatePeriodicoRequest,
  PeriodicoFilters
} from '../../shared/models/periodico.model';
import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodicoService {

  private readonly endpoint = '/periodico';

  constructor(private apiService: ApiService) {}

  /**
   *  Obtiene todos los periódicos con paginación y filtros
   */
  getPeriodicos(
    pagination: PaginationParams,
    filters?: PeriodicoFilters
  ): Observable<PaginatedResponse<Periodico>> {
    return this.apiService.getPaginated<Periodico>(this.endpoint, pagination, filters);
  }

  /**
   *  Obtiene un periódico por ID
   */
  getPeriodicoById(id: string): Observable<ApiResponse<Periodico>> {
    return this.apiService.get<Periodico>(`${this.endpoint}/${id}`);
  }

  /**
   *  Crea un nuevo periódico
   */
  createPeriodico(data: CreatePeriodicoRequest): Observable<ApiResponse<Periodico>> {
    return this.apiService.post<Periodico>(this.endpoint, data);
  }

  /**
   *  Actualiza un periódico existente
   */
  updatePeriodico(id: string, data: UpdatePeriodicoRequest): Observable<ApiResponse<Periodico>> {
    return this.apiService.put<Periodico>(`${this.endpoint}/${id}`, data);
  }

  /**
   *  Elimina un periódico
   */
  deletePeriodico(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
