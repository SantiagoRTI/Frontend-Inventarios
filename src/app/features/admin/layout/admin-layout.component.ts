import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { SidenavComponent, MenuItem } from '../../shared/components/sidenav/sidenav.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToolbarComponent,
    SidenavComponent,
    LoadingComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  environment = environment;
  currentUser: string = '';
  
  menuItems: MenuItem[] = [
    {
      label: 'Inventarios',
      icon: 'pi-list',
      route: '/admin/inventarios'
    },
    {
      label: 'Usuarios',
      icon: 'pi-users',
      route: '/admin/usuarios'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser() || '';
  }

  logout(): void {
    this.authService.logout();
  }
}
