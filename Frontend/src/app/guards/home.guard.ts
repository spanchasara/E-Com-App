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
export class HomeGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.checkRole('admin')) {
      this.router.navigate(['admin']);
      return false;
    } else if (this.authService.checkRole('seller')) {
      this.router.navigate(['seller']);
      return false;
    }
    return true;
  }
}
