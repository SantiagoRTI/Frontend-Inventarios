import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { ConfirmDeleteComponent } from '../../shared/components/confirm-delete/confirm-delete.component';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    ConfirmDeleteComponent
  ],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {
  usuarios = signal<Usuario[]>([]);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);
  
  showFormModal = false;
  showDeleteModal = false;
  editingId: number | null = null;
  deletingUsuario: Usuario | null = null;

  formData: Usuario = {
    nombre: '',
    correo: '',
    password: '',
    rol: 'Inspector'
  };

  columns: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'nombre', header: 'Nombre', sortable: true },
    { field: 'correo', header: 'Correo', sortable: true },
    { field: 'rol', header: 'Rol', sortable: true, type: 'tag' },
    { field: 'acciones', header: 'Acciones', type: 'actions' }
  ];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading.set(true);
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading.set(false);
      }
    });
  }

  handleAction(event: any): void {
    if (event.action === 'edit') {
      this.editUsuario(event.row);
    } else if (event.action === 'delete') {
      this.deletingUsuario = event.row;
      this.showDeleteModal = true;
    }
  }

  editUsuario(usuario: Usuario): void {
    this.editingId = usuario.id!;
    this.formData = {
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    };
    this.showFormModal = true;
  }

  resetForm(): void {
    this.editingId = null;
    this.formData = {
      nombre: '',
      correo: '',
      password: '',
      rol: 'Inspector'
    };
  }

  saveUsuario(): void {
    this.saving.set(true);
    
    const request = this.editingId
      ? this.usuarioService.actualizar(this.editingId, this.formData)
      : this.usuarioService.crear(this.formData);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showFormModal = false;
        this.resetForm();
        this.loadUsuarios();
      },
      error: (error) => {
        console.error('Error al guardar usuario:', error);
        this.saving.set(false);
        alert('Error al guardar el usuario: ' + error.message);
      }
    });
  }

  confirmDelete(): void {
    if (!this.deletingUsuario?.id) return;

    this.usuarioService.eliminar(this.deletingUsuario.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.deletingUsuario = null;
        this.loadUsuarios();
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario: ' + error.message);
      }
    });
  }
}
