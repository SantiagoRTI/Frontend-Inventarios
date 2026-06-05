import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  type?: 'text' | 'actions' | 'tag' | 'date';
}

export interface TableAction {
  action: string;
  row: any;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() actions: string[] = [];
  @Input() showAddButton: boolean = false;
  @Input() addButtonLabel: string = 'Agregar';
  
  @Output() onAction = new EventEmitter<TableAction>();
  @Output() onAdd = new EventEmitter<void>();

  getActionIcon(action: string): string {
    const icons: Record<string, string> = {
      'view': 'pi-eye',
      'edit': 'pi-pencil',
      'delete': 'pi-trash'
    };
    return icons[action] || 'pi-ellipsis-h';
  }

  getActionLabel(action: string): string {
    const labels: Record<string, string> = {
      'view': 'Ver',
      'edit': 'Editar',
      'delete': 'Eliminar'
    };
    return labels[action] || action;
  }

  getTagSeverity(value: string): string {
    if (!value) return '';
    const val = value.toUpperCase();
    if (val.includes('NORMAL') || val.includes('BUENO') || val.includes('ACTIVO')) {
      return 'success';
    }
    if (val.includes('EDITADO') || val.includes('PENDIENTE')) {
      return 'warning';
    }
    if (val.includes('SOBRANTE') || val.includes('MALO') || val.includes('INACTIVO')) {
      return 'danger';
    }
    return '';
  }
}
