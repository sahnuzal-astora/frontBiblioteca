// En src/app/core/services/revista.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    CreateRevistaRequest,
    Revista,
    RevistaFilters,
    UpdateRevistaRequest
} from '../../shared/models/revista.model';

import {
    ApiResponse,
    PaginatedResponse, // <-- Necesitas este tipo
    PaginationParams
} from '../models/api-response.model';

import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class RevistaService {

    private readonly endpoint = '/revistas';

    constructor(private apiService: ApiService) {}

    /**
     * ✅ Obtiene todas las revistas con paginación y filtros
     * CORRECCIÓN: Tipo de retorno similar a AudiolibroService
     */
    getRevistas(
        pagination: PaginationParams,
        filters?: RevistaFilters
    ): Observable<PaginatedResponse<Revista>> { // <--- VUELVE A USAR PaginatedResponse
        return this.apiService.getPaginated<Revista>(this.endpoint, pagination, filters);
    }

    /**
     * ✅ Obtiene una revista por ID
     */
    getRevistaById(id: string): Observable<ApiResponse<Revista>> {
        return this.apiService.get<Revista>(`${this.endpoint}/${id}`);
    }

    /**
     * ✅ Crea una nueva revista
     */
    createRevista(data: CreateRevistaRequest): Observable<ApiResponse<Revista>> {
        return this.apiService.post<Revista>(this.endpoint, data);
    }

    /**
     * ✅ Actualiza una revista existente
     */
    updateRevista(id: string, data: UpdateRevistaRequest): Observable<ApiResponse<Revista>> {
        return this.apiService.put<Revista>(`${this.endpoint}/${id}`, data);
    }

    /**
     * ✅ Elimina una revista
     */
    deleteRevista(id: string): Observable<ApiResponse<void>> {
        return this.apiService.delete<void>(`${this.endpoint}/${id}`);
    }
}