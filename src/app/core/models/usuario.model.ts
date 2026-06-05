export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  password?: string;
  rol: 'Administrador' | 'Inspector';
  fechaCreacion?: string;
  activo?: boolean;
}
