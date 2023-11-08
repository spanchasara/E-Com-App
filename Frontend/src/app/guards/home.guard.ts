import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const homeGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.checkRole("admin")) {
    router.navigate(["admin"]);
    return false;
  } else if (authService.checkRole("seller")) {
    router.navigate(["seller"]);
    return false;
  }
  return true;
};
