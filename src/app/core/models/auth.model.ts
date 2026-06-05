export interface LoginResponse {
  token: string;
  usuario: string;
  rol: 'Administrador' | 'Inspector';
}

export interface LoginRequest {
  usuario: string;
  contraseña: string;
}
