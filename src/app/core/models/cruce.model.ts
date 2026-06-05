import { Activo } from './activo.model';

export interface CruceResponse {
  inventarioId: number;
  fechaCruce: string;
  resumen: {
    total: number;
    cruceNormal: number;
    editado: number;
    sobrante: number;
    faltante: number;
  };
  activos: Activo[];
}
