import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Guard para proteger rutas del Inspector
 * Verifica que el usuario tenga rol 'Inspector'
 */
export const inspectorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const rol = authService.getRol();

  if (rol === 'Inspector') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
