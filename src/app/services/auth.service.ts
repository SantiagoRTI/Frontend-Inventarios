import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../core/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.REST_API_URL_BASE}/api/auth`;
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY = 'usuario';
  private readonly ROL_KEY = 'rol';
  
  private currentUserSubject = new BehaviorSubject<string | null>(this.getUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(credentials: { usuario: string; password: string }): Observable<LoginResponse> {
    const requestBody = {
      usuario: credentials.usuario,
      contraseña: credentials.password
    };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, requestBody).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, response.usuario);
        localStorage.setItem(this.ROL_KEY, response.rol);
        this.currentUserSubject.next(response.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROL_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  getRol(): 'Administrador' | 'Inspector' | null {
    return localStorage.getItem(this.ROL_KEY) as 'Administrador' | 'Inspector' | null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRol() === 'Administrador';
  }

  isInspector(): boolean {
    return this.getRol() === 'Inspector';
  }
}
