import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Inventario, InformacionCargada } from '../core/models/inventario.model';
import { Activo } from '../core/models/activo.model';
import { CruceResponse } from '../core/models/cruce.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private readonly apiUrl = `${environment.REST_API_URL_BASE}/api/inventarios`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.apiUrl}/${id}`);
  }

  crear(inventario: Inventario): Observable<Inventario> {
    return this.http.post<Inventario>(this.apiUrl, inventario);
  }

  actualizar(id: number, inventario: Inventario): Observable<Inventario> {
    return this.http.put<Inventario>(`${this.apiUrl}/${id}`, inventario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  validarCodigo(codigo: string): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.apiUrl}/validar/${codigo}`);
  }

  descargarPlantilla(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/plantilla`, {
      responseType: 'blob'
    });
  }

  subirExcel(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', file);
    return this.http.post(`${this.apiUrl}/${id}/cargar-excel`, formData);
  }

  informacionCargada(id: number): Observable<InformacionCargada> {
    return this.http.get<InformacionCargada>(`${this.apiUrl}/${id}/activos-inspector`);
  }

  ejecutarCruce(id: number): Observable<CruceResponse> {
    return this.http.post<CruceResponse>(`${this.apiUrl}/${id}/cruce`, {});
  }

  activosCruzados(id: number): Observable<CruceResponse> {
    return this.http.get<CruceResponse>(`${this.apiUrl}/${id}/activos-cruzados`);
  }

  descargarCruceExcel(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/cruce/excel`, {
      responseType: 'blob'
    });
  }

  obtenerActivosAdministrador(id: number): Observable<Activo[]> {
    return this.http.get<Activo[]>(`${this.apiUrl}/${id}/activos-administrador`);
  }
}
