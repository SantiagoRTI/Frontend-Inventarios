import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivoService } from '../../../services/activo.service';
import { InspectorStateService } from '../../../services/inspector-state.service';
import { Activo } from '../../../core/models/activo.model';

@Component({
  selector: 'app-digitar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './digitar.component.html',
  styleUrls: ['./digitar.component.css']
})
export class DigitarComponent implements OnInit {
  codigo: string = '';
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  activoEncontrado = signal<Activo | null>(null);

  constructor(
    private activoService: ActivoService,
    private inspectorState: InspectorStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar que tenga un inventario activo
    if (!this.inspectorState.hasInventarioActivo()) {
      this.router.navigate(['/inspector/codigo-inventario']);
    }
  }

  /**
   * Buscar activo por código ingresado manualmente
   */
  buscarActivo(): void {
    if (!this.codigo.trim()) {
      this.errorMessage.set('Por favor ingrese un código');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.activoService.porBarcode(this.codigo.trim()).subscribe({
      next: (activo) => {
        this.loading.set(false);
        this.activoEncontrado.set(activo);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error.error?.message || 
          'No se encontró ningún activo con este código'
        );
      }
    });
  }

  /**
   * Enviar activo sin modificaciones
   */
  enviarActivo(): void {
    const activo = this.activoEncontrado();
    if (!activo) return;

    this.loading.set(true);

    this.activoService.crear(activo).subscribe({
      next: () => {
        this.loading.set(false);
        alert('Activo registrado exitosamente');
        this.volver();
      },
      error: (error) => {
        this.loading.set(false);
        alert('Error al registrar activo: ' + (error.error?.message || error.message));
      }
    });
  }

  /**
   * Habilitar edición del activo
   */
  editarActivo(): void {
    const activo = this.activoEncontrado();
    if (!activo) return;

    // Navegar al formulario con los datos del activo
    this.router.navigate(['/inspector/activo'], {
      state: { activo, modoEdicion: true }
    });
  }

  /**
   * Intentar nuevamente (limpiar formulario)
   */
  intentarNuevamente(): void {
    this.activoEncontrado.set(null);
    this.errorMessage.set('');
    this.codigo = '';
  }

  /**
   * Volver al menú principal
   */
  volver(): void {
    this.router.navigate(['/inspector/menu']);
  }
}
