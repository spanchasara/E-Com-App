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
import { UserStore } from '../store/auth/user-store';
import { AuthService } from '../utils/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private userStore: UserStore,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    // Check the authentication state in the AuthStore
    const isAuthenticated = this.authService.checkUserExists();

    if (
      isAuthenticated &&
      (route.url[0]?.path === 'login' || route.url[0]?.path === 'register')
    ) {
      return this.router.navigate(['/']);
    } else if (
      !isAuthenticated &&
      (route.url[0]?.path === 'login' || route.url[0]?.path === 'register')
    ) {
      return true;
    } else if (isAuthenticated) {
      return true;
    } else {
      // User is not authenticated, redirect to the login page
      return this.router.navigate(['/login']);
    }
  }
}
