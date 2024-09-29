import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService); // Inyecta el servicio
  const router = inject(Router); // Inyecta el enrutador

  // Verifica si el token existe
  const token = loginService.getToken();
  if (token) {
    // Si el token existe, permite el acceso
    return true;
  } else {
    // Si no hay token, redirige a la página de login
    router.navigate(['/home']);
    return false;
  }
};