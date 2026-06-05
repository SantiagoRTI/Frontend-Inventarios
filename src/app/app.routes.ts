import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { AdminLayoutComponent } from './features/admin/layout/admin-layout.component';
import { UsuariosListComponent } from './features/admin/usuarios/usuarios-list.component';
import { InventariosListComponent } from './features/admin/inventarios/list/inventarios-list.component';
import { InventarioDetailComponent } from './features/admin/inventarios/detail/inventario-detail.component';
import { InspectorLayoutComponent } from './features/inspector/layout/inspector-layout.component';
import { CodigoInventarioComponent } from './features/inspector/codigo-inventario/codigo-inventario.component';
import { MenuPrincipalComponent } from './features/inspector/menu-principal/menu-principal.component';
import { EscanearComponent } from './features/inspector/escanear/escanear.component';
import { DigitarComponent } from './features/inspector/digitar/digitar.component';
import { AgregarComponent } from './features/inspector/agregar/agregar.component';
import { ActivoFormComponent } from './features/inspector/activo-form/activo-form.component';
import { ReporteComponent } from './features/inspector/reporte/reporte.component';
import { InspectorDetailComponent } from './features/inspector/detalle/inspector-detail.component';
import { loggedGuard } from './core/guards/logged.guard';
import { adminGuard } from './core/guards/admin.guard';
import { inspectorGuard } from './core/guards/inspector.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [loggedGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'inventarios',
        pathMatch: 'full'
      },
      {
        path: 'usuarios',
        component: UsuariosListComponent
      },
      {
        path: 'inventarios',
        component: InventariosListComponent
      },
      {
        path: 'inventarios/:id',
        component: InventarioDetailComponent
      }
    ]
  },
  {
    path: 'inspector',
    component: InspectorLayoutComponent,
    canActivate: [loggedGuard, inspectorGuard],
    children: [
      {
        path: '',
        redirectTo: 'codigo-inventario',
        pathMatch: 'full'
      },
      {
        path: 'codigo-inventario',
        component: CodigoInventarioComponent
      },
      {
        path: 'menu',
        component: MenuPrincipalComponent
      },
      {
        path: 'escanear',
        component: EscanearComponent
      },
      {
        path: 'digitar',
        component: DigitarComponent
      },
      {
        path: 'agregar',
        component: AgregarComponent
      },
      {
        path: 'activo',
        component: ActivoFormComponent
      },
      {
        path: 'reporte',
        component: ReporteComponent
      },
      {
        path: 'detalle',
        component: InspectorDetailComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
