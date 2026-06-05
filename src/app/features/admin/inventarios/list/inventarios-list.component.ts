import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableComponent, TableColumn } from '../../../shared/components/table/table.component';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { InventarioService } from '../../../../services/inventario.service';
import { Inventario } from '../../../../core/models/inventario.model';

@Component({
  selector: 'app-inventarios-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    ConfirmDeleteComponent
  ],
  templateUrl: './inventarios-list.component.html',
  styleUrls: ['./inventarios-list.component.css']
})
export class InventariosListComponent implements OnInit {
  inventarios = signal<Inventario[]>([]);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  
  showFormModal = false;
  showDeleteModal = false;
  editingId: number | null = null;
  deletingInventario: Inventario | null = null;

  formData: Inventario = {
    nombre: '',
    codigo: '',
    estado: ''
  };

  columns: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'nombre', header: 'Nombre', sortable: true },
    { field: 'codigo', header: 'Código', sortable: true },
    { field: 'estado', header: 'Estado', sortable: true, type: 'tag' },
    { field: 'acciones', header: 'Acciones', type: 'actions' }
  ];

  constructor(
    private inventarioService: InventarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInventarios();
  }

  loadInventarios(): void {
    this.loading.set(true);
    this.inventarioService.listar().subscribe({
      next: (data) => {
        this.inventarios.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar inventarios:', error);
        this.loading.set(false);
      }
    });
  }

  handleAction(event: any): void {
    if (event.action === 'view') {
      this.router.navigate(['/admin/inventarios', event.row.id]);
    } else if (event.action === 'edit') {
      this.editInventario(event.row);
    } else if (event.action === 'delete') {
      this.deletingInventario = event.row;
      this.showDeleteModal = true;
    }
  }

  editInventario(inventario: Inventario): void {
    this.editingId = inventario.id!;
    this.formData = {
      nombre: inventario.nombre,
      codigo: inventario.codigo,
      estado: inventario.estado
    };
    this.showFormModal = true;
  }

  resetForm(): void {
    this.editingId = null;
    this.formData = {
      nombre: '',
      codigo: '',
      estado: ''
    };
  }

  saveInventario(): void {
    this.saving.set(true);
    
    const request = this.editingId
      ? this.inventarioService.actualizar(this.editingId, this.formData)
      : this.inventarioService.crear(this.formData);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showFormModal = false;
        this.resetForm();
        this.loadInventarios();
      },
      error: (error) => {
        console.error('Error al guardar inventario:', error);
        this.saving.set(false);
        alert('Error al guardar el inventario: ' + error.message);
      }
    });
  }

  confirmDelete(): void {
    if (!this.deletingInventario?.id) return;

    this.inventarioService.eliminar(this.deletingInventario.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.deletingInventario = null;
        this.loadInventarios();
      },
      error: (error) => {
        console.error('Error al eliminar inventario:', error);
        alert('Error al eliminar el inventario: ' + error.message);
      }
    });
  }
}
