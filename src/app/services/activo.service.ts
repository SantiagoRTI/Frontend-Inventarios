import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Activo } from '../core/models/activo.model';

/**
 * Servicio para gestión de activos (Inspector)
 * Consume los endpoints de activos del API REST
 */
@Injectable({
  providedIn: 'root'
})
export class ActivoService {
  private readonly apiUrl = `${environment.REST_API_URL_BASE}/api/activos`;

  constructor(private http: HttpClient) {}

  /**
   * Buscar activo por código de activo
   */
  porCodigo(codigo: string): Observable<Activo> {
    return this.http.get<Activo>(`${this.apiUrl}/${codigo}`);
  }

  /**
   * Buscar activo por código de barras
   */
  porBarcode(barcode: string): Observable<Activo> {
    return this.http.get<Activo>(`${this.apiUrl}/barcode/${barcode}`);
  }

  /**
   * Crear nuevo activo
   */
  crear(activo: Activo): Observable<Activo> {
    return this.http.post<Activo>(this.apiUrl, activo);
  }

  /**
   * Actualizar activo existente
   */
  actualizar(id: number, activo: Activo): Observable<Activo> {
    return this.http.put<Activo>(`${this.apiUrl}/${id}`, activo);
  }
}
