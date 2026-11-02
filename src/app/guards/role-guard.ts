import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Rol } from '../services/auth';
import { map, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['rol'] as Rol;

  return authService.usuario$.pipe(
    take(1),
    map(user => {
      if (user && user.rol === expectedRole) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};