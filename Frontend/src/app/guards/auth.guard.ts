// auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../utils/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    // Check the authentication state in the AuthStore
    const { isAuthenticated, role } = this.authService.checkUserExists();

    if (route.url[0]?.path === 'login' || route.url[0]?.path === 'register') {
      if (isAuthenticated) {
        return this.router.navigate(['/', role === 'admin' ? 'admin' : '']);
      } else {
        return true;
      }
    } else if (!isAuthenticated) {
      // User is not authenticated, redirect to the login page
      return this.router.navigate(['/login']);
    } else {
      return true;
    }
  }
}
