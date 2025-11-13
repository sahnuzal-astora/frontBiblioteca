import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Audiolibro,
  AudiolibroFilters,
  CreateAudiolibroRequest,
  UpdateAudiolibroRequest
} from '../../shared/models/audiolibro.model';

import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '../models/api-response.model';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AudiolibroService {

  private readonly endpoint = '/audiolibro';

  constructor(private apiService: ApiService) {}

  /**
   *  Obtiene todos los audiolibros con paginación y filtros
   */
  getAudiolibros(
    pagination: PaginationParams,
    filters?: AudiolibroFilters
  ): Observable<PaginatedResponse<Audiolibro>> {
    return this.apiService.getPaginated<Audiolibro>(this.endpoint, pagination, filters);
  }

  /**
   *  Obtiene un audiolibro por ID
   */
  getAudiolibroById(id: string): Observable<ApiResponse<Audiolibro>> {
    return this.apiService.get<Audiolibro>(`${this.endpoint}/${id}`);
  }

  /**
   *  Crea un nuevo audiolibro
   */
  createAudiolibro(data: CreateAudiolibroRequest): Observable<ApiResponse<Audiolibro>> {
    return this.apiService.post<Audiolibro>(this.endpoint, data);
  }

  /**
   *  Actualiza un audiolibro existente
   */
  updateAudiolibro(id: string, data: UpdateAudiolibroRequest): Observable<ApiResponse<Audiolibro>> {
    return this.apiService.put<Audiolibro>(`${this.endpoint}/${id}`, data);
  }

  /**
   *  Elimina un audiolibro
   */
  deleteAudiolibro(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
