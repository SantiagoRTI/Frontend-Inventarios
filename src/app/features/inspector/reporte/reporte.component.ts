import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReporteService } from '../../../services/reporte.service';
import { InventarioService } from '../../../services/inventario.service';
import { InspectorStateService } from '../../../services/inspector-state.service';
import { Inventario } from '../../../core/models/inventario.model';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {
  inventario = signal<Inventario | null>(null);
  loading = signal<boolean>(false);
  descargado = signal<boolean>(false);
  pasoActual = signal<string>('');

  constructor(
    private reporteService: ReporteService,
    private inventarioService: InventarioService,
    private inspectorState: InspectorStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.inspectorState.hasInventarioActivo()) {
      this.router.navigate(['/inspector/codigo-inventario']);
      return;
    }
    this.cargarInventario();
  }

  cargarInventario(): void {
    const inventarioId = this.inspectorState.getInventarioId();
    if (!inventarioId) {
      alert('No se encontró el inventario activo');
      this.router.navigate(['/inspector/codigo-inventario']);
      return;
    }

    this.inventarioService.obtenerPorId(inventarioId).subscribe({
      next: (data) => this.inventario.set(data),
      error: (error) => {
        
        
      }
    });
  }

  /**
   * Generar reporte: primero ejecuta el cruce, luego descarga el Excel
   */
  descargarReporte(): void {
    const inventarioId = this.inspectorState.getInventarioId();
    if (!inventarioId) {
      alert('No se encontró el inventario activo');
      return;
    }

    this.loading.set(true);
    this.descargado.set(false);

    // Paso 1: Ejecutar el cruce de información
    this.pasoActual.set('Ejecutando cruce de información...');
    this.inventarioService.ejecutarCruce(inventarioId).subscribe({
      next: () => {
        // Paso 2: Descargar el Excel con el resultado del cruce
        this.pasoActual.set('Generando archivo Excel...');
        this.inventarioService.descargarCruceExcel(inventarioId).subscribe({
          next: (blob) => {
            this.downloadFile(blob, `reporte_inventario_${inventarioId}_${Date.now()}.xlsx`);
            this.loading.set(false);
            this.pasoActual.set('');
            this.descargado.set(true);

            setTimeout(() => this.descargado.set(false), 3000);
          },
          error: (error) => {
            this.loading.set(false);
            this.pasoActual.set('');
            const mensaje = error.error?.message || error.message || 'Error al generar el Excel';
            alert('Error al generar el reporte: ' + mensaje);
          }
        });
      },
      error: (error) => {
        this.loading.set(false);
        this.pasoActual.set('');
        const mensaje = error.error?.message || error.message || 'Error al ejecutar el cruce';
        alert('Error al ejecutar el cruce: ' + mensaje);
      }
    });
  }

  /**
   * Descargar archivo blob
   */
  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Volver al menú principal
   */
  volver(): void {
    this.router.navigate(['/inspector/menu']);
  }
}
