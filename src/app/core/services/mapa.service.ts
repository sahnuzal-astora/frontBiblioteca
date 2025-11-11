import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Mapa,
  CreateMapaRequest,
  UpdateMapaRequest,
  MapaFilters
} from '../../shared/models/mapa.model';

import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '../models/api-response.model';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  private readonly endpoint = '/mapas';

  constructor(private apiService: ApiService) {}

  /**
   * ✅ Obtiene todos los mapas con paginación y filtros
   */
  getMapas(
    pagination: PaginationParams,
    filters?: MapaFilters
  ): Observable<PaginatedResponse<Mapa>> {
    return this.apiService.getPaginated<Mapa>(this.endpoint, pagination, filters);
  }

  /**
   * ✅ Obtiene un mapa por ID
   */
  getMapaById(id: string): Observable<ApiResponse<Mapa>> {
    return this.apiService.get<Mapa>(`${this.endpoint}/${id}`);
  }

  /**
   * ✅ Crea un nuevo mapa
   */
  createMapa(data: CreateMapaRequest): Observable<ApiResponse<Mapa>> {
    return this.apiService.post<Mapa>(this.endpoint, data);
  }

  /**
   * ✅ Actualiza un mapa existente
   */
  updateMapa(id: string, data: UpdateMapaRequest): Observable<ApiResponse<Mapa>> {
    return this.apiService.put<Mapa>(`${this.endpoint}/${id}`, data);
  }

  /**
   * ✅ Elimina un mapa
   */
  deleteMapa(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
