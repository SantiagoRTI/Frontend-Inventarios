import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TableComponent, TableColumn } from '../../../shared/components/table/table.component';
import { InventarioService } from '../../../../services/inventario.service';
import { Inventario } from '../../../../core/models/inventario.model';
import { CruceResponse } from '../../../../core/models/cruce.model';

@Component({
  selector: 'app-inventario-detail',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './inventario-detail.component.html',
  styleUrls: ['./inventario-detail.component.css']
})
export class InventarioDetailComponent implements OnInit {
  inventario = signal<Inventario | null>(null);
  informacionCargada = signal<any>(null);
  activosCruzadosData = signal<CruceResponse | null>(null);

  descargando = signal<boolean>(false);
  cargandoCruce = signal<boolean>(false);
  procesandoCruce = signal<boolean>(false);

  inventarioId: number = 0;

  columnasCruce: TableColumn[] = [
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
    private route: ActivatedRoute,
    private router: Router,
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.inventarioId = +params['id'];
      this.loadInventario();
      this.loadInformacionCargada();
      this.loadActivosCruzados();
    });
  }

  loadInventario(): void {
    this.inventarioService.obtenerPorId(this.inventarioId).subscribe({
      next: (data) => this.inventario.set(data),
      error: (error) => {
        console.error('Error al cargar inventario:', error);
        alert('Error al cargar el inventario');
      }
    });
  }

  loadInformacionCargada(): void {
    this.inventarioService.informacionCargada(this.inventarioId).subscribe({
      next: (data) => this.informacionCargada.set(data),
      error: (error) => console.error('Error al cargar información:', error)
    });
  }

  loadActivosCruzados(): void {
    this.cargandoCruce.set(true);
    this.inventarioService.activosCruzados(this.inventarioId).subscribe({
      next: (data) => {
        this.activosCruzadosData.set(data);
        this.cargandoCruce.set(false);
      },
      error: (error) => {
        console.error('Error al cargar activos cruzados:', error);
        this.activosCruzadosData.set(null);
        this.cargandoCruce.set(false);
      }
    });
  }

  descargarPlantilla(): void {
    this.descargando.set(true);
    this.inventarioService.descargarPlantilla(this.inventarioId).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `plantilla_inventario_${this.inventarioId}.xlsx`);
        this.descargando.set(false);
      },
      error: (error) => {
        console.error('Error al descargar plantilla:', error);
        alert('Error al descargar la plantilla');
        this.descargando.set(false);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.inventarioService.subirExcel(this.inventarioId, file).subscribe({
      next: () => {
        alert('Excel cargado exitosamente');
        this.loadInformacionCargada();
        event.target.value = '';
      },
      error: (error) => {
        console.error('Error al subir Excel:', error);
        alert('Error al subir el archivo Excel: ' + error.message);
        event.target.value = '';
      }
    });
  }

  ejecutarCruceYDescargar(): void {
    this.procesandoCruce.set(true);

    this.inventarioService.ejecutarCruce(this.inventarioId).subscribe({
      next: () => {
        this.loadActivosCruzados();

        this.inventarioService.descargarCruceExcel(this.inventarioId).subscribe({
          next: (blob) => {
            this.downloadFile(blob, `cruce_inventario_${this.inventarioId}.xlsx`);
            this.procesandoCruce.set(false);
          },
          error: (error) => {
            console.error('Error al descargar Excel del cruce:', error);
            alert('El cruce se realizó pero hubo un error al descargar el Excel');
            this.procesandoCruce.set(false);
          }
        });
      },
      error: (error) => {
        console.error('Error al ejecutar cruce:', error);
        alert('Error al ejecutar el cruce: ' + error.message);
        this.procesandoCruce.set(false);
      }
    });
  }

  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  getTagSeverity(value: string): string {
    if (!value) return '';
    const val = value.toUpperCase();
    if (val.includes('FINALIZADO') || val.includes('ACTIVO') || val.includes('NORMAL')) return 'success';
    if (val.includes('EJECUCION') || val.includes('PENDIENTE') || val.includes('EDITADO')) return 'warning';
    if (val.includes('SOBRANTE') || val.includes('FALTANTE')) return 'danger';
    return '';
  }

  get tieneActivos(): boolean {
    return (this.activosCruzadosData()?.activos?.length ?? 0) > 0;
  }

  goBack(): void {
    this.router.navigate(['/admin/inventarios']);
  }
}
