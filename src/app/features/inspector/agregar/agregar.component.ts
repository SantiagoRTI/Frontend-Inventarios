import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InspectorStateService } from '../../../services/inspector-state.service';

/**
 * Componente wrapper que redirige al formulario de activo en modo creación
 * Simplemente navega a activo-form con datos vacíos
 */
@Component({
  selector: 'app-agregar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container">
      <i class="pi pi-spin pi-spinner"></i>
      <p>Cargando formulario...</p>
    </div>
  `,
  styles: [`
    .loading-container {
      min-height: 50vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      color: var(--color-text-secondary);
    }

    .loading-container i {
      font-size: 3rem;
      color: var(--color-toolbar);
    }

    .loading-container p {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
    }
  `]
})
export class AgregarComponent implements OnInit {
  constructor(
    private router: Router,
    private inspectorState: InspectorStateService
  ) {}

  ngOnInit(): void {
    // Verificar que tenga un inventario activo
    if (!this.inspectorState.hasInventarioActivo()) {
      this.router.navigate(['/inspector/codigo-inventario']);
      return;
    }

    // Navegar al formulario con datos vacíos
    this.router.navigate(['/inspector/activo'], {
      state: {
        activo: null,
        modoEdicion: false
      }
    });
  }
}
