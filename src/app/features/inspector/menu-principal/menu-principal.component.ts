import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InspectorStateService } from '../../../services/inspector-state.service';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit {
  inventarioNombre: string = '';

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

    this.inventarioNombre = this.inspectorState.getInventarioNombre() || '';
  }

  navegarA(ruta: string): void {
    this.router.navigate([`/inspector/${ruta}`]);
  }

  cambiarInventario(): void {
    if (confirm('¿Desea cambiar el inventario activo? Deberá ingresar un nuevo código.')) {
      this.inspectorState.limpiarInventario();
      this.router.navigate(['/inspector/codigo-inventario']);
    }
  }
}
