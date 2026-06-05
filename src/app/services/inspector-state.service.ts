import { Injectable, signal } from '@angular/core';

/**
 * Servicio para mantener el estado del inspector durante la sesión
 * Almacena el código del inventario y la información del inventario activo
 */
@Injectable({
  providedIn: 'root'
})
export class InspectorStateService {
  private codigoInventario = signal<string | null>(null);
  private inventarioId = signal<number | null>(null);
  private inventarioNombre = signal<string | null>(null);

  /**
   * Establecer el código del inventario actual
   */
  setCodigoInventario(codigo: string, id: number, nombre: string): void {
    this.codigoInventario.set(codigo);
    this.inventarioId.set(id);
    this.inventarioNombre.set(nombre);
    // Guardar también en sessionStorage para persistencia
    sessionStorage.setItem('inspector_codigo', codigo);
    sessionStorage.setItem('inspector_id', id.toString());
    sessionStorage.setItem('inspector_nombre', nombre);
  }

  /**
   * Obtener el código del inventario actual
   */
  getCodigoInventario(): string | null {
    if (!this.codigoInventario()) {
      // Intentar recuperar de sessionStorage
      const codigo = sessionStorage.getItem('inspector_codigo');
      if (codigo) {
        this.codigoInventario.set(codigo);
      }
    }
    return this.codigoInventario();
  }

  /**
   * Obtener el ID del inventario actual
   */
  getInventarioId(): number | null {
    if (!this.inventarioId()) {
      const id = sessionStorage.getItem('inspector_id');
      if (id) {
        this.inventarioId.set(parseInt(id));
      }
    }
    return this.inventarioId();
  }

  /**
   * Obtener el nombre del inventario actual
   */
  getInventarioNombre(): string | null {
    if (!this.inventarioNombre()) {
      const nombre = sessionStorage.getItem('inspector_nombre');
      if (nombre) {
        this.inventarioNombre.set(nombre);
      }
    }
    return this.inventarioNombre();
  }

  /**
   * Verificar si hay un inventario activo
   */
  hasInventarioActivo(): boolean {
    return this.getCodigoInventario() !== null;
  }

  /**
   * Limpiar el estado del inventario
   */
  limpiarInventario(): void {
    this.codigoInventario.set(null);
    this.inventarioId.set(null);
    this.inventarioNombre.set(null);
    sessionStorage.removeItem('inspector_codigo');
    sessionStorage.removeItem('inspector_id');
    sessionStorage.removeItem('inspector_nombre');
  }
}
