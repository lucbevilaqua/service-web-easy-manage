import { inject } from '@angular/core';
import { CanMatchFn, Router, Route } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { firstValueFrom } from 'rxjs';
import { extractRoles, hasAllRoles } from '../auth/roles';

function requiredRoles(route: Route): string[] {
  return (route.data?.['roles'] as string[]) ?? [];
}

/**
 * Guard de autorização por roles usando canMatch (evita carregar o bundle
 * do componente quando o usuário não tem permissão).
 *
 * Comportamento:
 * - Se não autenticado: redireciona para o Auth0 login e bloqueia a rota.
 * - Se autenticado sem role necessária: navega para /not-authorized.
 * - Se autenticado e autorizado: permite a rota.
 */
export const authRoleCanMatch: CanMatchFn = async (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(auth.isAuthenticated$);
  if (!isAuthenticated) {
    await auth.loginWithRedirect({ appState: { target: router.url || '/dashboard' } });
    return false;
  }

  const user = await firstValueFrom(auth.user$);
  const roles = extractRoles(user);
  const needed = requiredRoles(route);

  const ok = hasAllRoles(roles, needed);
  if (!ok) {
    await router.navigateByUrl('/not-authorized');
  }
  return ok;
};
