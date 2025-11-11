import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Comic,
  CreateComicRequest,
  UpdateComicRequest
} from '../../shared/models/comic.model';
import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ComicService {

  private readonly endpoint = '/comics';

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todos los Comics con paginación
   */
  getComics(
    pagination: PaginationParams
  ): Observable<PaginatedResponse<Comic>> {
    return this.apiService.getPaginated<Comic>(this.endpoint, pagination);
  }

  /**
   * Obtiene un comic por ID
   */
  getComicById(id: string): Observable<ApiResponse<Comic>> {
    return this.apiService.get<Comic>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea un nuevo comic
   */
  createComic(data: CreateComicRequest): Observable<ApiResponse<Comic>> {
    return this.apiService.post<Comic>(this.endpoint, data);
  }

  /**
   * Actualiza un comic existente
   */
  updateComic(id: string, data: UpdateComicRequest): Observable<ApiResponse<Comic>> {
    return this.apiService.put<Comic>(`${this.endpoint}/${id}`, data);
  }

  /**
   * Elimina un comic
   */
  deleteComic(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
