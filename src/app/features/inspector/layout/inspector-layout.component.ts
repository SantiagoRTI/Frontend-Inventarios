import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { AuthService } from '../../../services/auth.service';
import { InspectorStateService } from '../../../services/inspector-state.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-inspector-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToolbarComponent,
    LoadingComponent
  ],
  templateUrl: './inspector-layout.component.html',
  styleUrls: ['./inspector-layout.component.css']
})
export class InspectorLayoutComponent implements OnInit {
  environment = environment;
  currentUser: string = '';
  subtitle: string = 'Inspector';

  constructor(
    private authService: AuthService,
    private inspectorState: InspectorStateService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser() || '';
    const inventarioNombre = this.inspectorState.getInventarioNombre();
    if (inventarioNombre) {
      this.subtitle = `Inspector - ${inventarioNombre}`;
    }
  }

  logout(): void {
    this.inspectorState.limpiarInventario();
    this.authService.logout();
  }
}
