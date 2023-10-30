import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

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
    // Check the authentication stwate in the AuthStore
    const isAuthenticated = this.authService.checkUserExists();

    const currentPath = route.url[0]?.path.toLowerCase();

    if (['login', 'register'].includes(currentPath)) {
      return isAuthenticated ? this.router.navigate(['/']) : true;
    }

    if (!isAuthenticated) {
      return this.router.navigate(['/login']);
    }

    return true;
  }
}
