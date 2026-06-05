import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio para generación de reportes (Inspector)
 */
@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private readonly apiUrl = `${environment.REST_API_URL_BASE}/api/reportes`;

  constructor(private http: HttpClient) {}

  /**
   * Descargar reporte de auditoría en formato Excel
   * @param centro Centro de costos
   * @param inventarioId ID del inventario (opcional)
   */
  descargarAuditoria(centro: string, inventarioId?: number): Observable<Blob> {
    let url = `${this.apiUrl}/${centro}`;
    if (inventarioId) {
      url += `?inventarioId=${inventarioId}`;
    }
    return this.http.get(url, { responseType: 'blob' });
  }
}
