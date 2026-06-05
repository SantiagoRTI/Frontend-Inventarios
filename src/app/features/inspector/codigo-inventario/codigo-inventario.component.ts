import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventarioService } from '../../../services/inventario.service';
import { InspectorStateService } from '../../../services/inspector-state.service';

@Component({
  selector: 'app-codigo-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './codigo-inventario.component.html',
  styleUrls: ['./codigo-inventario.component.css']
})
export class CodigoInventarioComponent {
  codigo: string = '';
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(
    private inventarioService: InventarioService,
    private inspectorState: InspectorStateService,
    private router: Router
  ) {
    // Si ya tiene un código activo, redirigir al menú
    if (this.inspectorState.hasInventarioActivo()) {
      this.router.navigate(['/inspector/menu']);
    }
  }

  validarCodigo(): void {
    if (!this.codigo.trim()) {
      this.errorMessage.set('Por favor ingrese un código de inventario');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.inventarioService.validarCodigo(this.codigo.trim()).subscribe({
      next: (inventario) => {
        // Guardar el código e información del inventario
        this.inspectorState.setCodigoInventario(
          inventario.codigo,
          inventario.id!,
          inventario.nombre
        );
        
        // Navegar al menú principal
        this.router.navigate(['/inspector/menu']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error.error?.message || 
          'Código de inventario inválido o no encontrado'
        );
      }
    });
  }
}
