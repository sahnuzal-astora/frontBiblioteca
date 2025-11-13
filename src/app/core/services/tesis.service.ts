import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Tesis,
  CreateTesisRequest,
  UpdateTesisRequest,
  TesisFilters
} from '../../shared/models/tesis.model';

@Injectable({
  providedIn: 'root'
})
export class TesisService {
  private apiUrl = 'http://localhost:8000/tesis'; // 🔧 Ajusta si tu endpoint es diferente

  constructor(private http: HttpClient) {}

  /**
   * 🔹 Obtener todas las tesis (con filtros opcionales)
   */
  getTesis(filters?: TesisFilters): Observable<Tesis[]> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params = params.set(key, value);
      });
    }

    return this.http.get<Tesis[]>(this.apiUrl, { params });
  }

  /**
   * 🔹 Obtener una tesis por su ID
   */
  getTesisById(id: string): Observable<Tesis> {
    return this.http.get<Tesis>(`${this.apiUrl}/${id}`);
  }

  /**
   * 🔹 Crear una nueva tesis
   */
  createTesis(data: CreateTesisRequest): Observable<Tesis> {
    return this.http.post<Tesis>(this.apiUrl + '/', data);
  }

  /**
   * 🔹 Actualizar una tesis existente
   */
  updateTesis(id: string, data: UpdateTesisRequest): Observable<Tesis> {
    return this.http.put<Tesis>(`${this.apiUrl}/${id}/`, data);
  }

  /**
   * 🔹 Eliminar una tesis
   */
  deleteTesis(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}
