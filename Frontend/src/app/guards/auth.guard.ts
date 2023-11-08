import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.checkUserExists();

  const currentPath = route.url[0]?.path.toLowerCase();

  if (["login", "register", "reset-password"].includes(currentPath)) {
    return isAuthenticated ? router.navigate(["/"]) : true;
  }

  if (!isAuthenticated) {
    return router.navigate(["/login"]);
  }

  return true;
};
