export interface Inventario {
  id?: number;
  nombre: string;
  codigo: string;
  estado: string;
  inspectorId?: number;
  inspectorNombre?: string;
  centroCostosId?: number;
  centroCostosNombre?: string;
  fechaCreacion?: string;
}

export interface InformacionCargada {
  activosAdministrador: number;
  activosInspector: number;
  fechaUltimaCarga?: string;
}
