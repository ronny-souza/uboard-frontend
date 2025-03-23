import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  __: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {

  const { authenticated, keycloak } = authData;

  if (!authenticated) {
    await keycloak.login({ redirectUri: window.location.href });
  }

  return true;
};

export const canActivateAuth =
  createAuthGuard<CanActivateFn>(isAccessAllowed);
