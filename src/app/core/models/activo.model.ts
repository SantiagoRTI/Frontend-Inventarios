export interface Activo {
  id?: number;
  idActivo: string;
  etiqueta: string;
  descripcion: string;
  marca: string;
  serial: string;
  modelo: string;
  responsable?: string;
  ciudad?: string;
  estado?: string;
  camposModificados?: string[];
  inventarioId?: number;
  origen?: 'ADMINISTRADOR' | 'INSPECTOR';
}
