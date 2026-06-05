import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() logo?: string;
  @Input() userLabel?: string;
  @Input() showLogout: boolean = true;
  
  @Output() onLogout = new EventEmitter<void>();
}
