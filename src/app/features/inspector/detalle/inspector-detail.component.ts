import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { InventarioService } from '../../../services/inventario.service';
import { InspectorStateService } from '../../../services/inspector-state.service';
import { Inventario } from '../../../core/models/inventario.model';
import { CruceResponse } from '../../../core/models/cruce.model';

@Component({
  selector: 'app-inspector-detail',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './inspector-detail.component.html',
  styleUrls: ['./inspector-detail.component.css']
})
export class InspectorDetailComponent implements OnInit {
  inventario = signal<Inventario | null>(null);
  activosCruzadosData = signal<CruceResponse | null>(null);
  loading = signal<boolean>(false);
  reloading = signal<boolean>(false);

  inventarioId: number = 0;

  columnasActivos: TableColumn[] = [
    { field: 'idActivo', header: 'ID Activo', sortable: true },
    { field: 'etiqueta', header: 'Etiqueta', sortable: true },
    { field: 'descripcion', header: 'Descripción', sortable: true },
    { field: 'marca', header: 'Marca', sortable: true },
    { field: 'serial', header: 'Serial', sortable: true },
    { field: 'modelo', header: 'Modelo', sortable: true },
    { field: 'responsable', header: 'Responsable', sortable: true },
    { field: 'ciudad', header: 'Ciudad', sortable: true },
    { field: 'estado', header: 'Estado', sortable: true, type: 'tag' }
  ];

  constructor(
    private router: Router,
    private inspectorState: InspectorStateService,
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    if (!this.inspectorState.hasInventarioActivo()) {
      this.router.navigate(['/inspector/codigo-inventario']);
      return;
    }

    this.inventarioId = this.inspectorState.getInventarioId() ?? 0;
    this.loadInventario();
    this.loadActivosCruzados();
  }

  loadInventario(): void {
    this.inventarioService.obtenerPorId(this.inventarioId).subscribe({
      next: (data: Inventario) => this.inventario.set(data),
      error: (error: unknown) => {
        console.error('Error al cargar inventario:', error);
        alert('Error al cargar el inventario');
      }
    });
  }

  loadActivosCruzados(): void {
    this.loading.set(true);
    this.inventarioService.activosCruzados(this.inventarioId).subscribe({
      next: (data: CruceResponse) => {
        this.activosCruzadosData.set(data);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        console.error('Error al cargar activos cruzados:', error);
        this.loading.set(false);
      }
    });
  }

  recargarActivosCruzados(): void {
    this.reloading.set(true);
    this.inventarioService.activosCruzados(this.inventarioId).subscribe({
      next: (data: CruceResponse) => {
        this.activosCruzadosData.set(data);
        this.reloading.set(false);
      },
      error: (error: unknown) => {
        console.error('Error al recargar activos cruzados:', error);
        this.reloading.set(false);
      }
    });
  }

  getTagSeverity(value: string): string {
    if (!value) return '';
    const val = value.toUpperCase();
    if (val.includes('NORMAL')) return 'success';
    if (val.includes('EDITADO') || val.includes('PENDIENTE')) return 'warning';
    if (val.includes('SOBRANTE') || val.includes('FALTANTE')) return 'danger';
    return '';
  }

  volver(): void {
    this.router.navigate(['/inspector/menu']);
  }

  get tieneActivos(): boolean {
    return (this.activosCruzadosData()?.activos?.length ?? 0) > 0;
  }
}
