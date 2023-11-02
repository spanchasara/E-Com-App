import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class CustomerGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      const currentPath = route.url[0]?.path.toLowerCase();
    if (this.authService.checkRole("customer")) {
      if ( ['place-order'].includes(currentPath) &&(
        !sessionStorage.getItem("currentOrder") ||
        sessionStorage.getItem("currentOrder") === "")
      ) {
        return this.router.navigate(["/orders"]);
      }
      return true;
    } else {
      return this.router.navigate(["/"]);
    }
  }
}
